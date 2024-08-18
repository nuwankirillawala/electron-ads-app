import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Paper,
  Box,
  IconButton,
  Grid,
  Avatar,
  Switch,
  MenuItem,
  Select,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Home = ({ user, username, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState({
    city: null,
    region: null,
    country: null,
  });
  const [runInBackground, setRunInBackground] = useState(false);
  const [pausePopups, setPausePopups] = useState(false);
  const [workingCountry, setWorkingCountry] = useState(
    user.profile.workingCountry || ""
  );

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch the user's IP address and get location.
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        const userIp = response.data.ip;
        return axios.get(
          `https://ipinfo.io/${userIp}?token=${process.env.REACT_APP_IP_TOKEN}`
        );
      })
      .then((response) => {
        const { city, region, country } = response.data;
        setLocation({ city, region, country });
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });

    return () => clearInterval(timer);
  }, []);

  const handleMinimize = () => {
    if (window.electron && window.electron.minimizeWindow) {
      window.electron.minimizeWindow();
    } else {
      console.error("Electron IPC context not available");
    }
  };

  const handleClose = () => {
    if (window.electron && window.electron.closeWindow) {
      window.electron.minimizeWindow();
    } else {
      console.error("Electron IPC context not available");
    }
  };

  const handleWorkingCountryChange = (event) => {
    setWorkingCountry(event.target.value);
    // Logic to update the working country
  };

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "*::-webkit-scrollbar": {
            width: "8px",
          },
          "*::-webkit-scrollbar-track": {
            backgroundColor: "#0B1117",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#283D94",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#042174",
          },
        }}
      />
      <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
        {/* Title Bar */}
        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#333",
            color: "#fff",
            width: "100%",
          }}
        >
          <Typography variant="h6" sx={{ marginLeft: 2 }}>
            Acorn Travels - QHR Popup Portal
          </Typography>
          <Box>
            <IconButton onClick={handleMinimize} sx={{ color: "#fff" }}>
              <MinimizeIcon />
            </IconButton>
            <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Date and Time Section */}
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={6}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
              <CalendarTodayIcon fontSize="large" color="primary" />
              <Typography variant="h6">Date</Typography>
              <Typography variant="body2" color="textSecondary">
                {formattedDate}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>
              <AccessTimeIcon fontSize="large" color="primary" />
              <Typography variant="h6">Time</Typography>
              <Typography variant="body2" color="textSecondary">
                {formattedTime}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Profile Section */}
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <Avatar
                sx={{ width: 80, height: 80, margin: "0 auto" }}
                src={user.profile.profilePicUrl}
              >
                {!user.profile.profilePicUrl && (username ? username[0] : "U")}
              </Avatar>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <Typography variant="h6">
                {username ? username : "User"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user ? user.email : "user@example.com"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Department: {user.profile.department || "N/A"}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <LocationOnIcon fontSize="large" color="primary" />
              <Typography variant="h6">Location</Typography>
              <Typography variant="body2" color="textSecondary">
                Country: {user.profile.country || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Working Country: {user.profile.workingCountry || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Current Location:{" "}
                {location.city && location.region && location.country
                  ? `${location.city}, ${location.region}, ${location.country}`
                  : "Unable to determine"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Buttons and Options Section */}
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={6}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <Typography variant="h6">Popups</Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Box sx={{ textAlign: "left", mr: 2 }}>
                  <Typography variant="body2">Run in background</Typography>
                  <Switch
                    checked={runInBackground}
                    onChange={(e) => setRunInBackground(e.target.checked)}
                  />
                </Box>
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="body2">Pause Popups</Typography>
                  <Switch
                    checked={pausePopups}
                    onChange={(e) => setPausePopups(e.target.checked)}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <Typography variant="h6">Working Country</Typography>
              <Select
                value={workingCountry}
                onChange={handleWorkingCountryChange}
                fullWidth
                sx={{ mt: 2 }}
              >
                {/* Add your available country options here */}
                <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                <MenuItem value="India">India</MenuItem>
                <MenuItem value="United States">United States</MenuItem>
                {/* Add more options as needed */}
              </Select>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => {
                  // Logic to update working country
                  console.log("Working country changed to:", workingCountry);
                }}
              >
                Change
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Space for Future Components */}
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {/* Add future components here */}
        </Grid>

        {/* Logout Button */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            borderTop: 1,
            borderColor: "grey.300",
            mt: "auto",
          }}
        >
          <Button variant="contained" color="primary" onClick={onLogout}>
            Logout
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Home;
