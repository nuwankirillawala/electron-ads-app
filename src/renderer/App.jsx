import React, { useState, useEffect } from 'react';
import './App.css';
import Login from '../components/Login/Login';
import AdWindow from '../components/AdWindow/AdWindow'; // Import the AdWindow component

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ad, setAd] = useState([]);

  const handleLogin = async (username, password) => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setLoggedIn(true);
    }
  };

  const handleLogout = async () => {
    const response = await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      const fetchAd = async () => {
        const response = await fetch('http://localhost:3000/ads');
        if (response.ok) {
          const ad = await response.json();
          console.log('Fetched Ad:', ad); // Debugging: Check if ads are fetched          
          setAd(ad);
        }
      };

      fetchAd(); // Fetch ads on login
      const interval = setInterval(fetchAd, 10000); // Fetch ads every 10 seconds

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [loggedIn]);

  return (
    <div className="app-container">
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <h1>Welcome, User</h1>
          <button onClick={handleLogout}>Logout</button>
          {/* Render the AdWindow component if there are ads */}
          {ad && <AdWindow ad={ad} />}
        </div>
      )}
    </div>
  );
}

export default App;
