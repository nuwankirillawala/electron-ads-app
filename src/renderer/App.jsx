import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "../components/Login/Login";
import AdWindow from "../components/AdWindow/AdWindow"; // Import the AdWindow component
import Information from "../components/Information/Information"; // Import the Information component

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ad, setAd] = useState(null);
  const [username, setUsername] = useState("");

  const handleLogin = async (username, password) => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setLoggedIn(true);
      setUsername(username); // Set username on login
    } else {
      alert("Login failed"); // Provide feedback on login failure
    }
  };

  const handleLogout = async () => {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setLoggedIn(false);
      setUsername(""); // Clear username on logout
    } else {
      alert("Logout failed"); // Provide feedback on logout failure
    }
  };

  useEffect(() => {
    if (loggedIn) {
      const fetchAd = async () => {
        const response = await fetch("http://localhost:3000/ads");
        if (response.ok) {
          const ad = await response.json();
          console.log("Fetched Ad:", ad); // Debugging: Check if ads are fetched
          setAd(ad);
        } else {
          console.error("Failed to fetch ads"); // Provide feedback on ad fetch failure
        }
      };

      fetchAd(); // Fetch ad on login
      const interval = setInterval(fetchAd, 10000); // Fetch ads every 10 seconds

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [loggedIn]);

  return (
    <div className="app-container">
      <Routes>
        <Route
          path="/"
          element={
            !loggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <div>
                <h1>Welcome, {username}</h1>
                <button onClick={handleLogout}>Logout</button>
                {/* Render the AdWindow component if there is an ad */}
                {ad && <AdWindow ad={ad} username={username} />}
              </div>
            )
          }
        />
        <Route path="/information" element={<Information />} />
      </Routes>
      {/* <footer className="app-footer">
        <div className="footer-left">
          <Link to="/information">Information</Link>
        </div>
        <div className="footer-right">
          <p>Powered by Fantasia App Solutions</p>
        </div>
      </footer> */}
    </div>
  );
}

export default App;
