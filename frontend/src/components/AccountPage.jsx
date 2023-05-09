import React, {useEffect, useState} from "react";
import '../styles/Styles.css';
import '../styles/AccountPage.css';
import WithAuth from "./WithAuth";
import MyNavbar from './Navbar';
import Cookies from "js-cookie";
import jwt from "jwt-decode";
import axios from "axios";

function AccountPage() {
    const location = window.location.pathname;
    const jwtToken = Cookies.get('jwtToken');
    const decodedToken = jwt(jwtToken);
    const getUserByIdService = "https://localhost:7053/api/users/";
    const [user, setUser] = useState({});
    const [hospitals, setHospitals] = useState([]);
    const [specializations, setSpecializations] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(getUserByIdService + decodedToken.userId);
                setUser(response.data);
                if(response.data.role === "Doctor") {
                var hospitals = user.doctorHospitalPreferences.split(",");
                if (hospitals!=null){
                    for (let i = 0; i < hospitals.length; i++) {
                        const hospitalUser = await axios.get(getUserByIdService + hospitals[i]);
                        hospitals[i] = hospitalUser.data.firstName + " " + hospitalUser.data.lastName;
                    }
                }
                setHospitals(hospitals);
                var specializationsD = user.doctorSpecializationPreferences.split(",");
                setSpecializations(specializationsD);
            } else {
                var specializationsH = user.hospitalSpecializationPreferences.split(",");
                setSpecializations(specializationsH);
            }
            } catch (error) {
                console.error(error);
            }
        }

        fetchUser();
    });

    return (
        <div>
            {location !== "/login" && <MyNavbar />}
            <div className="mainDiv">
                <div className="profileContainer">
                    <h1>Profile</h1>
                    {user.role === "Doctor" ? (
                    <div className="profileContent">
                        
                        <div className="profileField">
                            <label htmlFor="firstName">First Name:</label>
                            <input type="text" id="firstName" name="firstName" value={user.firstName}/>
                        </div>
                        <div className="profileField">
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="text" id="lastName" name="lastName" value={user.lastName}/>
                        </div>
                        <div >
                            <label>Your last preferences set:</label>
                            <div>
                                <i><b>Hospital Preferences:</b></i>

                                {hospitals.map((hospital) => (
                                    <div>
                                    {hospital}
                                    </div>
                                ))}

                                <i><b>Specialization Preferences:</b></i> 
                                {specializations.map((specialization) => (
                                    <div>
                                        {specialization}
                                    </div>
                                ))}

                                <i><b>ExamGrade:</b></i> {user.examGrade}
                            </div>
                        </div>
                    </div>
                     ) : (

                        <div className="profileContent">
                        
                        <div className="profileField">
                            <label htmlFor="name">Hospital's Name:</label>
                            <input type="text" id="name" name="name" value={user.lastName}/>
                        </div>
                        <div >
                            <label>Your last preferences set:</label>
                            <div>
                                <i><b>Specialization Preferences:</b></i> 
                                {specializations.map((specialization) => (
                                    <div>
                                        {specialization}
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                        )}

                    <button type="submit">Save</button>
                </div>
            </div>
        </div>
    );
}

export default WithAuth(AccountPage);