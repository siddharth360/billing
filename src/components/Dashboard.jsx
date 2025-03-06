
import React from 'react';
import '../App.css';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}!</h1>
        {user?.picture && (
          <img 
            src={user.picture} 
            alt="Profile" 
            className="profile-image"
          />
        )}
      </div>
      
      <div className="user-info">
        <p><strong>Email:</strong> {user?.email}</p>
        
        {user?.groups && user.groups.length > 0 ? (
          <div className="groups-section">
            <h2>Your Groups</h2>
            <ul className="groups-list">
              {user.groups.map((group, index) => (
                <li key={index} className="group-item">{group}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No groups associated with your account.</p>
        )}
      </div>
      
      <button 
        onClick={onLogout} 
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
