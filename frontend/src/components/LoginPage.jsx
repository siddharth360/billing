
import { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = ({ onLogin }) => {
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Send the token to our backend
        const backendResponse = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ token: response.access_token }),
        });

        if (backendResponse.ok) {
          const userData = await backendResponse.json();
          onLogin(userData);
        } else {
          console.error('Backend authentication failed');
        }
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    onError: () => {
      console.error('Google Login Failed');
    },
    scope: 'email profile',
  });

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome</h1>
        <p>Please sign in with your Google account to access the application.</p>
        <button 
          onClick={() => login()} 
          className="btn btn-primary" 
          style={{ marginTop: '20px' }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
