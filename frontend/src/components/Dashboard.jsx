
import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <div className="container">
        <header className="header">
          <h1>Dashboard</h1>
          <button onClick={onLogout} className="btn btn-danger">
            Logout
          </button>
        </header>
        
        <div className="user-info">
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
          {user.picture && (
            <img 
              src={user.picture} 
              alt="Profile" 
              style={{ width: '100px', borderRadius: '50%', marginTop: '10px' }}
            />
          )}
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h3>Your Access Level</h3>
          <p>
            {user.groups && user.groups.length > 0 
              ? `You are a member of: ${user.groups.join(', ')}` 
              : 'You are not a member of any groups yet.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
