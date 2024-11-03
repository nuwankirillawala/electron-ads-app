/**
 * Theta Documentation for React Component: Home
 * ----------------------------------------------------------------------
 * @file Home.jsx
 * @description A component that serves as the main dashboard for the QuantumHR Notification Portal, displaying user profile information, popup options, and a queue management system.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @component
 * @example
 * // Usage in another component
 * <Home user={user} username={username} onLogout={handleLogout} />
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.user - The logged-in user object.
 * @param {String} props.username - The username of the logged-in user.
 * @param {Function} props.onLogout - Function to handle user logout.
 *
 * @returns {JSX.Element} A component that renders the main dashboard of QuantumHR Notification Portal.
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  IconButton,
  Grid,
  Avatar,
  Tooltip,
  CssBaseline,
  GlobalStyles,
  AppBar,
  Toolbar,
  Badge,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTheme, styled } from "@mui/material/styles";
import PopupOptions from "./PopupOptions";
import ProfileDetails from "./ProfileDetails";
import PopupQueue from "./PopupQueue";
import acorn_logo_tp from "../../../public/assets/images/acorn_logo_tp.png";

// ---------------------- Constants ----------------------
const apiToken = import.meta.env.VITE_APP_IP_TOKEN;
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Home Component
 */
const Home = ({ user, username, onLogout }) => {
  // ---------------------- State Variables ----------------------
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState({
    city: null,
    region: null,
    country: null,
  });
  const [runInBackground, setRunInBackground] = useState(false);
  const [pausePopups, setPausePopups] = useState(false);
  const [popupQueue, setPopupQueue] = useState([]);
  const theme = useTheme();

  // ---------------------- Effects ----------------------
  useEffect(() => {
    // Fetch initial popup queue and listen for updates
    const fetchInitialQueue = async () => {
      const queue = await window.electron.getPopupQueue();
      setPopupQueue(queue);
    };

    fetchInitialQueue();

    const updateQueue = (event, updatedQueue) => {
      setPopupQueue(updatedQueue);
    };

    window.electron.on("popup-queue-updated", updateQueue);

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch the user's IP address and get location
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) =>
        axios.get(`https://ipinfo.io/${response.data.ip}?token=${apiToken}`)
      )
      .then((response) => {
        const { city, region, country } = response.data;
        setLocation({ city, region, country });
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });

    // Cleanup
    return () => {
      clearInterval(timer);
      window.electron.off("popup-queue-updated", updateQueue);
    };
  }, []);

  // ---------------------- Event Handlers ----------------------
  /**
   * Minimizes the application window.
   */
  const handleMinimize = () => {
    window.electron?.minimizeWindow?.();
  };

  /**
   * Closes the application window.
   */
  const handleClose = () => {
    window.electron?.closeWindow?.();
  };

  // ---------------------- Utility Functions ----------------------
  /**
   * Formats the current date for display.
   * @returns {String} The formatted date string.
   */
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /**
   * Formats the current time for display.
   * @returns {String} The formatted time string.
   */
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // ---------------------- Styled Components ----------------------
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: "24px",
      height: "24px",
      borderRadius: "12px",
      fontSize: "1.2rem",
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": { transform: "scale(.8)", opacity: 1 },
      "100%": { transform: "scale(2.4)", opacity: 0 },
    },
  }));

  // ---------------------- Render ----------------------
  return (
    <>
      {/* Global Styles */}
      <CssBaseline />
      <GlobalStyles
        styles={{
          "*::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.background.paper,
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      />

      {/* Main Container */}
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* AppBar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: "none",
            backdropFilter: "blur(10px)",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Company Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={acorn_logo_tp}
                alt="Company Logo"
                style={{ height: "70px", marginRight: "8px" }}
              />
            </Box>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
              QuantumHR Notification Portal
            </Typography>
            <Tooltip
              title={
                <>
                  <Typography variant="body2">Information:</Typography>
                  <Typography variant="caption">
                    - Product: QuantumHR Notify
                  </Typography>
                  <br />
                  <Typography variant="caption">- Version: 1.0.0</Typography>
                  <br />
                  <Typography variant="caption">
                    - Developed by: Ceyapps Global & NuraIT
                  </Typography>
                  <br />
                  <Typography variant="caption">
                    - For more info, Please contact the HR department
                  </Typography>
                </>
              }
              arrow
            >
              <IconButton sx={{ color: theme.palette.primary.main }}>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Profile Section */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={3}>
              <Paper
                elevation={3}
                sx={{
                  padding: 1,
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    src={user.profile.profilePicUrl}
                  >
                    {!user.profile.profilePicUrl &&
                      (username ? username[0] : "U")}
                  </Avatar>
                </StyledBadge>
              </Paper>
            </Grid>
            <ProfileDetails user={user} />
            <Grid item xs={4}>
              <Paper
                elevation={3}
                sx={{ padding: 3, textAlign: "center", height: "100%" }}
              >
                <LocationOnIcon fontSize="large" color="primary" />
                <Typography variant="body2" color="textSecondary">
                  Current Timezone:{" "}
                  {timeZone ? timeZone : "Unable to determine"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Popup Options & Queue */}
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <PopupOptions
              runInBackground={runInBackground}
              setRunInBackground={setRunInBackground}
              pausePopups={pausePopups}
              setPausePopups={setPausePopups}
            />
            <PopupQueue queue={popupQueue} />
          </Grid>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            height: "5px",
            borderTop: 1,
            borderColor: "grey.300",
            mt: "auto",
            position: "fixed",
            bottom: 0,
            backgroundColor: theme.palette.background.paper,
            left: 0,
            right: 0,
          }}
        >
          <Typography variant="body2" color="textSecondary" sx={{ ml: 2 }}>
            {formattedDate}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mr: 2 }}>
            {formattedTime}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Home;
