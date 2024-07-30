import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useGlobalState } from './globalState';
import { useNavigate } from 'react-router';
import { AWS_ENDPOINT} from '../config';
import './login.css';

const Login = () => {
    const [_, setGlobalState] = useGlobalState();
    const navigate = useNavigate();
    const COOKIE_EXPIRATION = 30;
    
    const setCookie = (name, value, days) => {
        let expires = "";
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = `expires=${date.toUTCString()};`;
        }
        document.cookie = `${name}=${value}; ${expires}path=/; SameSite=Lax`;
    };

    const decodeJwtResponse = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
    };

    const handleSuccess = async (response) => {
        const jwtToken = response.credential;
        const userInfo = decodeJwtResponse(jwtToken);
        try {
            const lambdaResponse = await fetch(`${AWS_ENDPOINT}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "user_id": userInfo.sub,
                    "name": userInfo.name,
                    "email": userInfo.email
                })
            });
    
            if (lambdaResponse.ok) {
                const responseData = await lambdaResponse.json();
                setGlobalState('isAuthenticated', true);
                setGlobalState('user', responseData.user);
                setCookie('user', responseData.token, COOKIE_EXPIRATION);
                navigate('/graph');
            } else {
                console.error('Failed to authenticate:', lambdaResponse.statusText);
            }
        } catch (error) {
            console.error('Error occurred:', error);
        }
    };
    
    const handleFailure = (response) => {
        console.error(response);
    }
    return (
        <div className="center-container">
            <h1 className="header">Log into CLA Platform with your Google Account:</h1>
            <div className="body">
                <GoogleLogin
                    className="loginButton"
                    clientId="178168358494-jkik1kjlqofgls3rhq0p7q1qq28dg5dq.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </div>
    )
}

export default Login