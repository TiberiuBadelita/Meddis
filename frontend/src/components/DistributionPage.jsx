import React from "react";
import { useState, useEffect } from "react";
import MyNavbar from "./Navbar";
import WithAuth from "./WithAuth";
import "../styles/Styles.css";
import "../styles/DistributionPage.css";
import axios from "axios";

function DistributionPage(){
        const location = window.location.pathname;
        
        const getAllocationsService = "https://localhost:7053/api/allocations";
        const getUserByIdService = "https://localhost:7053/api/users/";
        const [doctors, setDoctors] = useState([]);
        const [hospitals, setHospitals] = useState([]);
    
        useEffect(() => {
        const getAllocations = async () => {
          const response = await axios.get(getAllocationsService);
          var doctorsArray = [];
          for (let i = 0; i < response.data.length; i++) {
            const doctorResponse = await axios.get(
              getUserByIdService + response.data[i].doctorId
            );

            const hospitalResponse = await axios.get(
              getUserByIdService + response.data[i].hospitalId
            );

            const doctorName = "Dr. " + doctorResponse.data.firstName + " " + doctorResponse.data.lastName;
            
            const hospitalName = hospitalResponse.data.firstName + " " + hospitalResponse.data.lastName;

            doctorsArray.push({ name: doctorName, hospital: hospitalName, specialization: response.data[i].specialization});
          }
          setDoctors(doctorsArray);
          const hospitalsArray = [...new Set(doctorsArray.map((doctor) => doctor.hospital))];
          setHospitals((hospitalsArray));
        };

        getAllocations();
      }, []);

      
      const specialties = [
        "All Specialties",
        "Anesthesiology", "Cardiology", "Dermatology", "Emergency medicine",
        "Endocrinology", "Gastroenterology", "General surgery", "Hematology",
        "Infectious disease", "Internal medicine", "Neurology",
        "Obstetrics and gynecology", "Oncology", "Ophthalmology", "Orthopedics",
        "Otolaryngology", "Pediatrics", "Physical medicine and rehabilitation",
        "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Urology"
      ];
          
     
        const [selectedHospital, setSelectedHospital] = useState("");
        const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
      
        const handleHospitalChange = (event) => {
          setSelectedHospital(event.target.value);
        };
      
        const handleSpecialtyChange = (event) => {
          setSelectedSpecialty(event.target.value);
        };
        const [searchValue, setSearchValue] = useState("");

        const handleSearchChange = (event) => {
          setSearchValue(event.target.value);
        };
        
        const filteredDoctors =
          selectedHospital === ""
            ? doctors
            : doctors.filter((doctor) => doctor.hospital === selectedHospital);
        
        const searchedDoctors =
          searchValue === ""
            ? filteredDoctors
            : filteredDoctors.filter(
                (doctor) =>
                  doctor.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                  doctor.hospital.toLowerCase().includes(searchValue.toLowerCase()) ||
                  doctor.specialization.toLowerCase().includes(searchValue.toLowerCase())
              );
        
        const finalFilteredDoctors =
          selectedSpecialty === "All Specialties"
            ? searchedDoctors
            : searchedDoctors.filter((doctor) => doctor.specialization === selectedSpecialty);
        
        console.log(finalFilteredDoctors);
        return (
          <div>
            {location !== "/login" && <MyNavbar/>}
            <div className="mainDiv">
              <div className="distDiv">
                <h1>Doctors Distribution to Hospitals</h1>
                <div className="filterDiv">
                  <label htmlFor="hospital-select">Select a hospital:</label>
                  <select id="hospital-select" onChange={handleHospitalChange}>
                    <option value="">All Hospitals</option>
                    {hospitals.map((hospital) => (
                      <option key={hospital} value={hospital}>
                        {hospital}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="specialty-select">Select a specialty:</label>
                  <select id="specialty-select" onChange={handleSpecialtyChange}>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  <input type="text" placeholder="Search.." value={searchValue} onChange={handleSearchChange}></input>
                </div>
                <table border>
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Hospital Name</th>
                      <th>Specialization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalFilteredDoctors.map((doctor) => (
                      <tr key={doctor.name}>
                        <td>{doctor.name}</td>
                        <td>{doctor.hospital}</td>
                        <td>{doctor.specialization}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
    }

export default WithAuth(DistributionPage);