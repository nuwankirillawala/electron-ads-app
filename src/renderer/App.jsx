import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Paper } from "@mui/material";
import Login from "../components/Login/Login";
import Information from "../components/Information/Information";
import AdWindow from "../components/AdWindow/AdWindow";
import io from "socket.io-client";

// Create a socket instance
const socket = io("http://localhost:5000");

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [ad, setAd] = useState();

  useEffect(() => {
    if (loggedIn) {
      const handleAdData = (adData) => {
        console.log("Received ad data:", adData);
        window.electron.showAd(adData); // Notify the main process to show the ad
      };

      socket.on("showPopup", handleAdData);

      return () => {
        socket.off("showPopup", handleAdData);
      };
    }
  }, [loggedIn]);

  useEffect(() => {
    const handleNavigateToAdWindow = (event, adData) => {
      setAd(adData);
      navigate("/ad-window");
      // Pass ad data to the AdWindow component via state or context if needed
    };

    window.electron.on("navigate-to-ad-window", handleNavigateToAdWindow);

    return () => {
      window.electron.off("navigate-to-ad-window", handleNavigateToAdWindow);
    };
  }, [navigate]);

  const handleLogin = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setLoggedIn(true);
      setUsername(email);
    } else {
      alert("Login failed");
    }
  };

  const handleLogout = async () => {
    const response = await fetch("http://localhost:5000/api/v1/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setLoggedIn(false);
      setUsername("");
    } else {
      alert("Logout failed");
    }
  };

  const showDummyAd = () => {
    const dummyAd = {
      title: "Dummy Ad",
      description: "This is a dummy ad for testing.",
      image: "https://via.placeholder.com/150",
      link: "https://www.example.com",
    };
    console.log("called show dummy add");
    window.electron.showAd(dummyAd); // Notify the main process to show the dummy ad
  };

  return (
    <Container component="main" maxWidth="md" sx={{ padding: 4 }}>
      <Routes>
        <Route
          path="/"
          element={
            !loggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                  Welcome, {username}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={showDummyAd}
                  sx={{ marginTop: 2 }}
                >
                  Show Dummy Ad
                </Button>
              </Paper>
            )
          }
        />
        <Route path="/information" element={<Information />} />
        <Route path="/ad-window" element={<AdWindow adData={ad} />} />
      </Routes>
    </Container>
  );
}

export default App;
