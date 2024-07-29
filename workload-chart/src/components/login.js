import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useGlobalState } from './globalState';
import { useNavigate } from 'react-router';
import './login.css';

const Login = () => {
    const [_, setGlobalState] = useGlobalState();
    const navigate = useNavigate();
    
    const handleSuccess = (response) => {
        const userInfo = decodeJwtResponse(response.credential);
        setGlobalState('isAuthenticated', true);
        setGlobalState('user', userInfo);
        navigate('/graph');
    }
    
    const handleFailure = (response) => {
        console.error(response);
    }

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