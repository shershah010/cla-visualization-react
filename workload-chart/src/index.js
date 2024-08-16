import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GlobalState } from './components/globalState';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <GoogleOAuthProvider clientId="178168358494-jkik1kjlqofgls3rhq0p7q1qq28dg5dq.apps.googleusercontent.com">
      <GlobalState>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </GlobalState>
    </GoogleOAuthProvider>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
