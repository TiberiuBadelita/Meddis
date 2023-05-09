import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Styles.css';
import '../styles/RegisterPage.css';
import axios from 'axios';

function RegisterPage() {

    const [role, setRole] = useState('');
    const [showLastname, setShowLastname] = useState(true);
  
    const handleRoleChange = (event) => {
      const { value } = event.target;
      setRole(value);
      setShowLastname(value !== 'Hospital');
    };

    const registerService = 'https://localhost:7053/api/users/register';
    const nav = useNavigate();
    
    const register = async () => {
        var role = document.getElementById('role').value;
        var firstname = document.getElementById('name').value;
        var lastname;

        if (role === 'Hospital'){
            lastname = firstname;
            firstname = '';
        }
        else{
            lastname =  document.getElementById('lastname').value;
        }

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirmPassword').value;
        

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
           await axios.post(registerService, {
            firstname,
            lastname,
            role,
            email,
            password,
          });

        nav('/login');
        alert('You have successfully registered!');
        } catch (error) {
          alert('Email is already used or not all fields are filled in!!');
        }
    }; 


  return (
      <div className="mainDiv">
          <div className="registerForm roundedDiv">
              <img src={process.env.PUBLIC_URL + "logo.png"} className="logo" alt="logo" />
              <form className="flexForm">
                  <h2>REGISTER ON OUR SITE</h2>
                  <label htmlFor="role" className="roleLabel">Role</label>
                  <select id="role" name="role" value={role} onChange={handleRoleChange}>
                      <option value="">Select a role</option>
                      <option value="Doctor">Resident Doctor</option>
                      <option value="Hospital">Hospital</option>
                  </select>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="Your email.." />
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name.." />
                  {showLastname && (
                      <>
                          <label htmlFor="lastname">Last Name</label>
                          <input type="text" id="lastname" name="lastname" placeholder="Your lastname.." />
                      </>
                  )}
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" name="password" placeholder="Your password.." />
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Your password.." />

                  <div className="flexButtons">
                      <button type="button" className="btn btn-primary button-17" onClick={() => register()}>
                          Register
                      </button>
                  </div>
              </form>
          </div>
      </div>
  );
}

export default RegisterPage;