import React, { useState } from "react";
import "./Login.css"; // Import the CSS file for this component
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Perform login via API
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      onLogin(username, password); // Pass username and password to the onLogin callback if needed
    } else {
      alert("Login failed");
    }
  };

  const handleForgotPassword = () => {
    alert("Please contact your administration.");
  };

  const handleInformationClick = () => {
    navigate("/information");
  };

  return (
    <div className="login-container">
      <h1>ElectroFact Portal</h1>
      <h3>By Fantasia Group</h3>
      <div className="login-form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button className="forgot-password" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
      </div>
      <footer className="login-footer">
        <button className="info-button" onClick={handleInformationClick}>
          Information
        </button>
        <span className="powered-by">Powered by Fantasia App Solutions</span>
      </footer>
    </div>
  );
};

export default Login;
