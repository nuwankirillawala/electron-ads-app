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
  CssBaseline,
  GlobalStyles,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Home = ({ user, username, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState({
    city: null,
    region: null,
    country: null,
  });

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch the user's IP address first
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        const userIp = response.data.ip;
        // Use the IP address to get the user's location
        return axios.get(`https://ipinfo.io/${userIp}?token=49d8842c08b501`); // Replace with your IPInfo token
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
        {/* Header */}
        <Box
          sx={{
            p: 0.25,
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <IconButton onClick={handleMinimize}>
            <MinimizeIcon />
          </IconButton>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Body */}
        <Grid container spacing={2} sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* User Details Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <Avatar
                sx={{ width: 80, height: 80, margin: "0 auto" }}
                src={user.profile.profilePicUrl}
              >
                {!user.profile.profilePicUrl && (username ? username[0] : "U")}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {username ? username : "User"}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {user ? user.email : "user@example.com"}
              </Typography>
            </Paper>
          </Grid>

          {/* Date, Time, and Location Cards in Same Row */}
          <Grid item xs={12} md={6} lg={8} container spacing={2}>
            {/* Calendar Card */}
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
                <CalendarTodayIcon fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  Date
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formattedDate}
                </Typography>
              </Paper>
            </Grid>
            {/* Time Card */}
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
                <AccessTimeIcon fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  Time
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formattedTime}
                </Typography>
              </Paper>
            </Grid>
            {/* Location Card */}
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
                <LocationOnIcon fontSize="large" color="primary" />
                <Typography variant="h6" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {location.city && location.region && location.country
                    ? `${location.city}, ${location.region}, ${location.country}`
                    : "Unable to determine"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* News Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <NewspaperIcon fontSize="large" color="primary" />
              <Typography variant="h6" gutterBottom>
                Latest News
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Headlines go here. Keep up with the latest news.
              </Typography>
            </Paper>
          </Grid>

          {/* Tasks Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
              <AssignmentIcon fontSize="large" color="primary" />
              <Typography variant="h6" gutterBottom>
                Tasks
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your tasks for today.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            borderTop: 1,
            borderColor: "grey.300",
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
