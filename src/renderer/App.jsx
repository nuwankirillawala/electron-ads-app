/**
 * Theta Documentation for React Component: App
 * ----------------------------------------------------------------------
 * @file App.jsx
 * @description The main application component that manages routes, user authentication, and socket connections for ad popups. It acts as the entry point for the QuantumHR Notification Portal.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @component
 * @example
 * <App />
 *
 * @returns {JSX.Element} The main application component that renders different views based on user authentication status and app state.
 */

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, CircularProgress, Box } from "@mui/material";
import Login from "../components/Login/Login";
import Information from "../components/Information/Information";
import AdWindow from "../components/AdWindow/AdWindow";
import Home from "../components/Home/Home";
import io from "socket.io-client";
// import sampleAd from "../../public/assets/images/sample-ad.jpg";

// Environment variables
const apiUrl = import.meta.env.VITE_API_URL;

// Create a socket instance
const socket = io(`${apiUrl}`);

/**
 * Component: App
 */
function App() {
  // ---------------------- State Variables ----------------------
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [ad, setAd] = useState();
  const navigate = useNavigate();

  // ---------------------- Effects ----------------------
  useEffect(() => {
    // Simulate loading state for 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.electron) {
      const handleAutoLogin = (event, user) => {
        setLoggedIn(true);
        setUser(user);
        setUsername(`${user.profile.firstName} ${user.profile.lastName}`);
        setLoading(false);
      };

      window.electron.on("auto-login", handleAutoLogin);

      return () => {
        window.electron.off("auto-login", handleAutoLogin);
      };
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      const handleAdData = (adData) => {
        console.log("Received ad data:", adData);
        if (window.electron) {
          window.electron.showAd(adData, user, "new");
        }
      };

      socket.on("showPopup", handleAdData);

      return () => {
        socket.off("showPopup", handleAdData);
      };
    }
  }, [loggedIn]);

  useEffect(() => {
    if (window.electron) {
      const handleNavigateToAdWindow = (event, adData, userData) => {
        setAd(adData);
        setUser(userData);
        navigate("/ad-window");
      };

      window.electron.on("navigate-to-ad-window", handleNavigateToAdWindow);

      return () => {
        window.electron.off("navigate-to-ad-window", handleNavigateToAdWindow);
      };
    }
  }, [navigate]);

  // ---------------------- Functions ----------------------
  /**
   * handleLogin - Handles user login and sets user state.
   * @param {Object} user - The user object containing login details.
   */
  const handleLogin = (user) => {
    setLoggedIn(true);
    setUser(user);
    setUsername(`${user.profile.firstName} ${user.profile.lastName}`);
    if (window.electron) {
      window.electron.saveUserData(user);
    }
  };

  /**
   * handleLogout - Logs the user out and clears user data.
   */
  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setLoggedIn(false);
        setUsername("");
        if (window.electron) {
          window.electron.clearUserData();
        }
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred while logging out");
    }
  };

  /**
   * showDummyAd - Displays a dummy ad for testing purposes.
   */
  const showDummyAd = () => {
    const dummyAd = {
      _id: "66ba3da6edfdd991ebb6a94d",
      title: "Test Popup Fact",
      message: "This is a dummy fact for testing.",
      // image: sampleAd,
      link: "https://www.example.com",
      windowSize: "normal",
    };

    if (window.electron) {
      window.electron.showAd(dummyAd);
    }
  };

  // ---------------------- Render ----------------------
  return (
    <Container component="main" maxWidth="false" sx={{ padding: 1 }}>
      <Routes>
        <Route
          path="/"
          element={
            loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress color="inherit" />
              </Box>
            ) : !loggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Home
                user={user}
                username={username}
                onLogout={handleLogout}
                onShowDummyAd={showDummyAd}
              />
            )
          }
        />
        <Route path="/information" element={<Information />} />
        <Route
          path="/ad-window"
          element={<AdWindow adData={ad} userData={user} />}
        />
      </Routes>
    </Container>
  );
}

export default App;
