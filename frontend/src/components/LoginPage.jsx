import React from "react";
import '../styles/Styles.css';
import '../styles/LoginPage.css';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import axios from 'axios';

function LoginPage() {

    const loginService = 'https://localhost:7053/api/users/login';
    const nav = useNavigate();

    const login = async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await axios.post(loginService, {
                email,
                password
            });

            const jwtToken = response.data.token;
            const expirationDate = response.data.expiration;

            Cookies.set('jwtToken', jwtToken, { expires: new Date(expirationDate) });
            nav('/');
        } catch (error) {
            alert('Invalid email or password!');
        }
    };





    return (
        <div class="mainDiv">
            <div class="loginForm roundedDiv">
                <img src={process.env.PUBLIC_URL + "logo.png"} class="centerLOGO" alt="logo" />
                <form class="flexForm">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Your email.."></input>
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Your password.."></input>
                    <div class="flexButtons">
                        <button type="button" class="btn btn-primary button-17" onClick={() => login()}>Login</button>
                        <button type="button" class="btn btn-primary button-17" onClick={() => nav('/register')}>Register</button>
                    </div>
                    <div class="copyright">
                    Copyleft
                    <span id="copyright"> &copy; </span>
                    2023
                    Meddis. Very few rights reserved.
                    </div>
                </form>
                
            </div>
        </div>
    );
}

export default LoginPage;