import React, { useEffect, useRef, useState } from "react";
import '../styles/Styles.css';
import '../styles/HomePage.css';
import WithAuth from "./WithAuth";
import MyNavbar from './Navbar';
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import jwt from 'jwt-decode';
import axios from 'axios';
import Papa from "papaparse";

function HomePage() {
    const location = window.location.pathname;
    const generateService = "https://localhost:7053/api/allocations/generate";
    const generateWithIndifferenceService = "https://localhost:7053/api/allocations/generate-with-indifference";
    const getAllUsersService = "https://localhost:7053/api/users";
    const deleteUserByIdService = "https://localhost:7053/api/users/";
    const getDeadlineService = "https://localhost:7053/api/allocations/get-deadline";
    const setDeadlineService = "https://localhost:7053/api/allocations/set-deadline/";
    const nav = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [deadline, setDeadline] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateAccount, setUpdateAccount] = useState({});

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
    }, [refreshKey]);


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

    const handleUpdate = (account) => {
        setIsModalOpen(true);
        setUpdateAccount(account);
      };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
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
            await axios.post(generateWithIndifferenceService);
            alert('Allocations have been generated.');
        }
        catch (error) {
            alert('Error in generating allocations.')
        }
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value);
    };

    const searchedAccounts = searchValue === ""
    ? accounts
    : accounts.filter(
        (account) =>
           (account.firstName != null ? account.firstName.toLowerCase().includes(searchValue.toLowerCase()):false) ||
            account.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
            account.role.toLowerCase().includes(searchValue.toLowerCase())
      );

    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
          console.log(file);
        } else {
          alert('Invalid file type. Please select a CSV file.');
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async function(results) {
                const data = results.data;
                var ids = [];

                for (let i = 0; i < data.length; i++) {
                    if(data[i].Role === "Doctor") {

                        var firstName = data[i].FirstName;
                        var lastName = data[i].LastName;
                        var role = data[i].Role;
                        var email = data[i].Email;
                        var password = "Password123!";
                        var doctor = {
                            firstName,
                            lastName,
                            role,
                            email,
                            password
                        }

                        await axios.post('https://localhost:7053/api/users/register', doctor)
                            .then((response) => {
                                ids[i] = response.data.id;
                                accounts.push(response.data);
                            });

                    }
                    else if(data[i].Role === "Hospital") {
                         firstName = "";
                         lastName = data[i].LastName;
                         role = data[i].Role;
                         email = data[i].Email;
                         password = "Password123!";
                         var hospital = {
                            firstName,
                            lastName,
                            role,
                            email,
                            password
                        }

                        await axios.post('https://localhost:7053/api/users/register', hospital)
                            .then((response) => {
                                ids[i] = response.data.id;
                                accounts.push(response.data);
                            });

           
                    }
                }

                setRefreshKey((oldKey) => oldKey + 1);

                for (let i = 0; i < data.length; i++) {
                    if(data[i].Role === "Doctor") {
                        var id = ids[i];

                        if(!data[i].hasOwnProperty("__parsed_extra")) {
                            accounts.forEach((account) => {
                                if(account.lastName === data[i].Preferences || account.firstName + " " + account.lastName === data[i].Preferences || data.find((account) => account.lastName === data[i].Preferences) ){
                                    data[i].Preferences = account.id;
                                }
                            });

                            for(let k = 0; k < data.length; k++) {
                                if(data[k].lastName === data[i].Preferences || data[k].firstName + " " + data[k].lastName === data[i].Preferences) {
                                    data[i].Preferences = ids[k];
                                }
                            }
                            
                            var preferences = data[i].ExamGrade + "|" + data[i].Preferences + "|" + data[i].Specialization;
                        }
                        else {
                            accounts.forEach((account) => {
                                if(account.lastName === data[i].Preferences || account.firstName + " " + account.lastName === data[i].Preferences) {
                                    data[i].Preferences = account.id;
                                }

                                for (let j = 0; j < data[i].__parsed_extra.length; j++) {
                                    if(account.lastName === data[i].__parsed_extra[j] || account.firstName + " " + account.lastName === data[i].__parsed_extra[j] ) {
                                        data[i].__parsed_extra[j] = account.id;
                                    } 
                                }
                            });

                            for(let k = 0; k < data.length; k++) {
                                if(data[k].lastName === data[i].Preferences || data[k].firstName + " " + data[k].lastName === data[i].Preferences) {
                                    data[i].Preferences = ids[k];
                                }

                                for (let j = 0; j < data[i].__parsed_extra.length; j++) {
                                    if(data[k].lastName === data[i].__parsed_extra[j] || data[k].firstName + " " + data[k].lastName === data[i].__parsed_extra[j] ) {
                                        data[i].__parsed_extra[j] = ids[k];
                                    }
                                }
                            }


                            preferences = data[i].ExamGrade + "|" + data[i].Preferences + "," + data[i].__parsed_extra.join(",") + "|" + data[i].Specialization;
                        }

                        await axios.put("https://localhost:7053/api/users/set-users-preferences/" + id  + '/' + preferences);
                    }
                    else if(data[i].Role === "Hospital"){
                        id = ids[i];

                        if(!data[i].hasOwnProperty("__parsed_extra")) {
                            preferences = data[i].Preferences;
                        }
                        else {
                            preferences = data[i].Preferences + "," + data[i].__parsed_extra.join(",");
                        }

                        await axios.put("https://localhost:7053/api/users/set-users-preferences/" + id + '/' + preferences);
                    }

                }
            }

        });
        
    };

    const handleImport = async () => {
        fileInputRef.current.click();
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
                        <div><b>Search for a user:</b> <input type="text" placeholder="Search.." onChange={handleSearchChange}></input></div>
                        <table className="accountsTable">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedAccounts.map((account) => (
                                    <tr key={account.lastName}>
                                        <td>{account.firstName} {account.lastName}</td>
                                        <td>{account.role}</td>
                                        <td>
                                            <button className="deleteBtn" onClick={() => handleDelete(account.id)}>Delete</button>
                                            <button className="updateBtn" onClick={() => handleUpdate(account)}>Update</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="buttonGroup">
                            <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept=".csv"
                            onChange={handleFileSelect}
                            />
                            <button className="deadlineBtn" onClick={handleImport}>Import Data</button>
                            <button className="deadlineBtn" onClick={handleSetDeadline}>Set Form Deadline</button>
                            <p><b>Current Deadline: {deadline}</b></p>
                            <select name="algorithms" className="selectBtn">
                                <option value="">Select an algorithm</option>
                                <option value="Doctor">Classic stable matching</option>
                                <option value="Hospital">Stable matching with indifference </option>
                            </select>
                            <button className="generateBtn" onClick={handleGenerateAllocations}>Generate Allocations</button>
                        </div>
                    </div>
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal} account={updateAccount}/>
                </div>

            )}
        </div>
    );

}

export default WithAuth(HomePage);