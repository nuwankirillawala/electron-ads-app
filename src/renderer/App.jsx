// src/App.js
import React, { useState } from 'react';
import Login from '../components/Login/Login';
import './App.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    // Perform logout via API
    const response = await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setLoggedIn(false);
      setUsername('');
    }
  };

  return (
    <div className="app-container">
      {!loggedIn ? (
        <Login onLogin={() => {
          setUsername('user'); // Set username or fetch from the response if needed
          handleLogin();
        }} />
      ) : (
        <div className="welcome-container">
          <h1>Welcome, {username}!</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
