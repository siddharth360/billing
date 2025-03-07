import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import '../App.css';

const LoginPage = ({ onLogin }) => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome</h1>
        <p>Please sign in with your Google account</p>

        <div className="google-login-button">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                // Get the ID token from the response
                const { credential } = credentialResponse;

                // Send the token to our backend
                const backendResponse = await fetch('/api/auth/google', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ token: credential }),
                  credentials: 'include'
                });

                if (backendResponse.ok) {
                  const data = await backendResponse.json();
                  onLogin(data.user);
                } else {
                  console.error('Backend authentication failed');
                }
              } catch (error) {
                console.error('Authentication error:', error);
              }
            }}
            onError={() => {
              console.error('Login Failed');
            }}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;