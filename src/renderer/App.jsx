import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, CircularProgress, Box } from "@mui/material";
import Login from "../components/Login/Login";
import Information from "../components/Information/Information";
import AdWindow from "../components/AdWindow/AdWindow";
import Home from "../components/Home/Home"; // Import the Home component
import io from "socket.io-client";
import sampleAd from "../../public/assets/images/sample-ad.jpg";

// Create a socket instance
const socket = io("http://localhost:5000");

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const [ad, setAd] = useState();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Set loading to false after 1 second

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
          window.electron.showAd(adData); // Notify the main process to show the ad
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
      const handleNavigateToAdWindow = (event, adData) => {
        setAd(adData);
        navigate("/ad-window");
        // Pass ad data to the AdWindow component via state or context if needed
      };

      window.electron.on("navigate-to-ad-window", handleNavigateToAdWindow);

      return () => {
        window.electron.off("navigate-to-ad-window", handleNavigateToAdWindow);
      };
    }
  }, [navigate]);

  const handleLogin = (user) => {
    setLoggedIn(true);
    setUser(user);
    setUsername(`${user.profile.firstName} ${user.profile.lastName}`);
    if (window.electron) {
      console.log("calling electron save user");

      window.electron.saveUserData(user); // Save user data on successful login
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
      if (window.electron) {
        window.electron.clearUserData(); // Clear user data on logout
      }
    } else {
      alert("Logout failed");
    }
  };

  const showDummyAd = () => {
    const dummyAd = {
      _id: "66ba3da6edfdd991ebb6a94d",
      title: "Test Popup Fact",
      message: "This is a dummy fact for testing.",
      image: sampleAd,
      // image: "https://via.placeholder.com/150",
      link: "https://www.example.com",
      windowSize: "normal",
    };
    console.log("called show dummy add");
    if (window.electron) {
      window.electron.showAd(dummyAd); // Notify the main process to show the dummy ad
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ padding: 4 }}>
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
          element={<AdWindow adData={ad} user={user} />}
        />
      </Routes>
    </Container>
  );
}

export default App;
