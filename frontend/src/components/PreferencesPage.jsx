import React, { useState, useEffect } from "react";
import '../styles/Styles.css';
import '../styles/PreferencesPage.css';
import WithAuth from "./WithAuth";
import MyNavbar from './Navbar';
import Cookies from 'js-cookie';
import jwt from 'jwt-decode';
import axios from 'axios';


const PreferencesPage = () => {

  const [hospitals, setHospitals] = useState([]);
  const qualifications = ["Anesthesiology", "Cardiology", "Dermatology", "Emergency medicine",
    "Endocrinology", "Gastroenterology", "General surgery", "Hematology",
    "Infectious disease", "Internal medicine", "Neurology",
    "Obstetrics and gynecology", "Oncology", "Ophthalmology", "Orthopedics",
    "Otolaryngology", "Pediatrics", "Physical medicine and rehabilitation",
    "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Urology"];
  const [deadline, setDeadline] = useState("");

  const getAllUsersService = "https://localhost:7053/api/users";
  const getDeadlineService = "https://localhost:7053/api/allocations/get-deadline";

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(getAllUsersService);
        setHospitals(response.data.filter((account) => account.role === "Hospital"));
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


  const location = window.location.pathname;
  const jwtToken = Cookies.get('jwtToken');
  const decodedToken = jwt(jwtToken);
  const sendPreferencesService = "https://localhost:7053/api/users/set-users-preferences/" + decodedToken.userId;

  const [examGrade, setExamGrade] = useState(""); // State for residency exam grade
  const [hospitalPreferences, setHospitalPreferences] = useState(Array(1).fill(hospitals[0])); // State for hospital preferences
  const [qualificationPreferences, setQualificationPreferences] = useState(Array(1).fill(qualifications[0])); // State for qualification preferences
  const [placesLeft, setPlacesLeft] = useState([0, 0, 0]);
  const handlePlacesLeftChange = (index, event) => {
    const updatedPlacesLeft = [...placesLeft];
    updatedPlacesLeft[index] = event.target.value;
    setPlacesLeft(updatedPlacesLeft);
  };

  const role = decodedToken.role;

  // Handler for when residency exam grade is changed
  const handleExamGradeChange = (event) => {
    setExamGrade(event.target.value);
  };

  // Handler for when a hospital preference is changed
  const handleHospitalPreferenceChange = (index, event) => {
    const newHospitalPreferences = [...hospitalPreferences];
    newHospitalPreferences[index] = event.target.value;
    setHospitalPreferences(newHospitalPreferences);
  };

  // Handler for when a qualification preference is changed
  const handleQualificationPreferenceChange = (index, event) => {
    const newQualificationPreferences = [...qualificationPreferences];
    newQualificationPreferences[index] = event.target.value;
    setQualificationPreferences(newQualificationPreferences);
  };

  // Handler for when form is submitted
  const handleDoctorsSubmit = async (event) => {
    event.preventDefault();
    var qualificationPreferencesString = examGrade + "|" + hospitalPreferences.join(",") + "|" + qualificationPreferences.join(",");
    console.log(qualificationPreferencesString);
    try {
      await axios.put(sendPreferencesService + '/' + qualificationPreferencesString);

      alert('Preferences have been sent.');
    }
    catch (error) {
      alert('Error in sending preferences.')
    }

  };

  // Handler for when form is submitted
  const handleHospitalsSubmit = async (event) => {
    event.preventDefault();
    for (var i = 0; i < qualificationPreferences.length; i++) {
      qualificationPreferences[i] = qualificationPreferences[i] + "-" + placesLeft[i];
    }
    var qualificationPreferencesString = qualificationPreferences.join(",");

    console.log(qualificationPreferencesString);

    try {
      await axios.put(sendPreferencesService + '/' + qualificationPreferencesString);
      alert('Preferences have been sent.');
    }
    catch (error) {
      alert('Error in sending preferences.')
    }
  };

  const handleAddPreferenceClick = () => {
    setHospitalPreferences([...hospitalPreferences, { id: "", name: "" }]);
  };

  const handleRemovePreferenceClick = (index) => {
    const list = [...hospitalPreferences];

    if (list.length > 1) {
      list.splice(index, 1);
      setHospitalPreferences(list);
    }
  };

  const handleAddSpecialtyClick = () => {
    setQualificationPreferences([...qualificationPreferences, ""]);
  };

  const handleRemoveSpecialtyClick = (index) => {
    const list = [...qualificationPreferences];
    if (list.length > 1) {
      list.splice(index, 1);
      setQualificationPreferences(list);
    }
  };

  return (
    <div className="mainDiv">
      {location !== "/login" && <MyNavbar />}
      <div className="introDiv2">
        Complete your preferences form below. You can change your preferences at any time before the deadline: <b>{deadline}</b>.
      </div>
      {role === "Doctor" ? (
        <form onSubmit={handleDoctorsSubmit}>
          <div className="row">
            <div className="col">
              <label className="firstLabel">Hospital Preferences:</label>
              <div className="scrollable-container">
                {hospitalPreferences.map((hospital, index) => (
                  <div key={index}>
                    <label>
                      Hospital {index + 1}:
                      <select
                        value={hospital}
                        onChange={(event) => handleHospitalPreferenceChange(index, event)}
                      >
                        <option value="">Select an hospital</option>
                        {hospitals.map((hospital) => (
                          <option key={hospital.id} value={hospital.id}>
                            {hospital.firstName} {hospital.lastName}
                          </option>
                        ))}
                      </select>
                    </label>

                    {index === hospitalPreferences.length - 1 && (
                      <div>
                        <button type="button" onClick={() => handleRemovePreferenceClick(index)}>
                          -
                        </button>
                        <button type="button" onClick={handleAddPreferenceClick}>
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="col">
              <label className="firstLabel">Specialization Preferences:</label>
              <div className="scrollable-container">
                {qualificationPreferences.map((qualification, index) => (
                  <div key={index}>
                    <label>
                      Qualification {index + 1}:
                      <select
                        value={qualification}
                        onChange={(event) => handleQualificationPreferenceChange(index, event)}
                      >
                        <option value="">Select a specialization</option>
                        {qualifications.map((qualification) => (
                          <option key={qualification} value={qualification}>
                            {qualification}
                          </option>
                        ))}
                      </select>
                    </label>

                    {index === qualificationPreferences.length - 1 && (
                      <div>
                        <button type="button" onClick={() => handleRemoveSpecialtyClick(index)}>
                          -
                        </button>
                        <button type="button" onClick={handleAddSpecialtyClick}>
                          +
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
          <div>
            <label>Exam Grade: </label>
            <input
              type="number"
              min={1}
              max={10}
              step="0.01"
              value={examGrade}
              onChange={handleExamGradeChange}
            />
          </div>
          <div>
            <button type="submit">SEND</button>
          </div>
        </form>
      ) : role === "Hospital" ? (
        <form onSubmit={handleHospitalsSubmit}>
          {qualificationPreferences.map((qualification, index) => (
            <div>
              <div key={index} className="rowH">
                <label>
                  Specialization {index + 1}:
                  <select
                    value={qualification}
                    onChange={(event) => handleQualificationPreferenceChange(index, event)}
                  >
                    <option value="">Select a specialization</option>
                    {qualifications.map((qualification) => (
                      <option key={qualification} value={qualification}>
                        {qualification}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Places Needed:
                  <input
                    type="number"
                    min={0}
                    value={placesLeft[index]}
                    onChange={(event) => handlePlacesLeftChange(index, event)}
                  />
                </label>
              </div>
              {index === qualificationPreferences.length - 1 && (
                <div>
                  <button type="button" onClick={handleRemoveSpecialtyClick}>-</button>
                  <button type="button" onClick={handleAddSpecialtyClick}>+</button>
                </div>
              )}
            </div>
          ))}
          <div>
            <button type="submit">SEND</button>
          </div>
        </form>
      ) : (
        <div>Invalid role</div>
      )}
    </div>
  );
}

export default WithAuth(PreferencesPage);