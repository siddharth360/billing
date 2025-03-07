import React from 'react';
import '../App.css';

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

        <div className="groups-section">
          <h3>Your Google Groups</h3>
          {user.groups && user.groups.length > 0 ? (
            <ul className="groups-list">
              {user.groups.map(group => (
                <li key={group} className="group-item">{group}</li>
              ))}
            </ul>
          ) : (
            <p>You are not a member of any Google Groups.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;