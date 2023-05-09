import React, { useEffect, useState } from "react";
import '../styles/Styles.css';
import '../styles/HomePage.css';
import WithAuth from "./WithAuth";
import MyNavbar from './Navbar';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt from 'jwt-decode';
import axios from 'axios';


function HomePage() {
    const location = window.location.pathname;
    const generateService = "https://localhost:7053/api/allocations/generate";
    const getAllUsersService = "https://localhost:7053/api/users";
    const deleteUserByIdService = "https://localhost:7053/api/users/";
    const getDeadlineService = "https://localhost:7053/api/allocations/get-deadline";
    const setDeadlineService = "https://localhost:7053/api/allocations/set-deadline/";
    const nav = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await axios.get(getAllUsersService);
                setAccounts(response.data.filter((account) => account.role !== "Admin"));
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDeadline = async () => {
            try {
                const response = await axios.get(getDeadlineService);
                setDeadline(response.data);
            } catch (error) {
                console.error(error);
            }
        };


        fetchAccounts();
        fetchDeadline();
    }, []);


    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            console.log(`Deleting account ${id}`);
            await axios.delete(deleteUserByIdService + id)
                .then(() => {
                    setAccounts(accounts.filter((account) => account.id !== id));
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleUpdate = (id) => {
        console.log(`Updating account ${id}`);
    };

    const handleSetDeadline = async () => {
        let deadline = prompt("Please enter the deadline for filling the preferences form (YYYY-MM-DD):");
        if (deadline != null) {
            let parsedDate = new Date(Date.parse(deadline));
            if (!isNaN(parsedDate.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
                if (parsedDate > Date.now()) {
                    try {
                        await axios.post(setDeadlineService + deadline);
                        alert('Deadline has been set.');
                    } catch (error) {
                        alert('Error in setting deadline.');
                    }
                } else {
                    alert('Please enter a deadline date that is greater than the current date.');
                }
            } else {
                alert('Please enter a valid deadline date in the format YYYY-MM-DD.');
            }
        }
    };

    const handleGenerateAllocations = async () => {
        try {
            await axios.post(generateService);
            alert('Allocations have been generated.');
        }
        catch (error) {
            alert('Error in generating allocations.')
        }
    };

    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwt(jwtToken);

    const role = decodedToken.role;

    return (
        <div>
            {role !== "Admin" ? (
                <div>
                    {location !== "/login" && <MyNavbar />}
                    <div className="mainDiv">
                        <div className="introDiv">
                            <h1>Welcome to Meddis Allocation System</h1>
                            <p>
                                This system allows doctors to input their preferences for hospitals and specializations, as well as their residency exam grades. Administrators can then use this information to allocate doctors to hospitals based on their preferences and qualifications.
                            </p>
                        </div>
                        <div className="buttonsDiv">
                            <button className="button-10" onClick={e => nav('/preferences')}>PREFERENCES FORM</button>
                            <button className="button-10" onClick={e => nav('/allocation')}>DOCTORS ALLOCATION</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mainDiv">
                    <div className="dashboard">
                        <h1>Admin Dashboard</h1>
                        <table className="accountsTable">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map((account) => (
                                    <tr key={account.lastName}>
                                        <td>{account.firstName} {account.lastName}</td>
                                        <td>{account.role}</td>
                                        <td>
                                            <button className="deleteBtn" onClick={() => handleDelete(account.id)}>Delete</button>
                                            <button className="updateBtn" onClick={() => handleUpdate(account.id)}>Update</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="buttonGroup">
                            <button className="deadlineBtn" onClick={handleSetDeadline}>Set Form Deadline</button>
                            <p><b>Current Deadline: {deadline}</b></p>
                            <button className="generateBtn" onClick={handleGenerateAllocations}>Generate Allocations</button>
                        </div>
                    </div>
                </div>

            )}
        </div>
    );

}

export default WithAuth(HomePage);