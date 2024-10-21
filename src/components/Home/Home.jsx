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
  AppBar,
  Toolbar,
  Badge,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";

import { useTheme, styled } from "@mui/material/styles";
import { width } from "@mui/system";

import { primary } from "../../theme/palette";

import PopupOptions from "./PopupOptions";
import ProfileDetails from "./ProfileDetails";
import PopupQueue from "./PopupQueue";

import acorn_logo_tp from "/assets/images/acorn_logo_tp.png";

const apiToken = import.meta.env.VITE_APP_IP_TOKEN;
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
  const [popupQueue, setPopupQueue] = useState([]);

  const theme = useTheme();
  const isProVersion = false;

  useEffect(() => {
    // Get the queue of popups
    const fetchInitialQueue = async () => {
      const queue = await window.electron.getPopupQueue();
      setPopupQueue(queue);
    };

    fetchInitialQueue();

    // Listener for popup queue updates
    const updateQueue = (event, updatedQueue) => {
      setPopupQueue(updatedQueue);
    };

    window.electron.on("popup-queue-updated", updateQueue);

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch the user's IP address and get location.
    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        const userIp = response.data.ip;
        return axios.get(`https://ipinfo.io/${userIp}?token=${apiToken}`);
      })
      .then((response) => {
        const { city, region, country } = response.data;
        setLocation({ city, region, country });
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });

    return () => {
      clearInterval(timer);
      window.electron.off("popup-queue-updated", updateQueue);
    };
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
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  return (
    <>
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
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ##################################### APPBAR ##################################### */}
        {/* Title Bar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: (theme) => theme.palette.background.paper,
            color: (theme) => theme.palette.text.primary,
            boxShadow: "none",
            backdropFilter: "blur(10px)",
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{ color: (theme) => theme.palette.primary.main }}
              >
                QuantumHR Notification Portal
              </Typography>
            </Box>
            <Box>
              <Tooltip
                title={
                  <React.Fragment>
                    <Typography variant="body2" color="inherit">
                      Information:
                    </Typography>
                    <Typography variant="caption" color="inherit">
                      - Product: QuantumHR Notify
                    </Typography>
                    <br />
                    <Typography variant="caption" color="inherit">
                      - Version: 1.0.0
                    </Typography>
                    <br />
                    <Typography variant="caption" color="inherit">
                      - Developed by: Ceyapps Global & NuraIT
                    </Typography>
                    <br />
                    <Typography variant="caption" color="inherit">
                      - For more info, Please contact the HR department
                    </Typography>
                  </React.Fragment>
                }
                arrow
              >
                <IconButton
                  onClick={() => {
                    console.log("Info button clicked");
                    // Add any logic needed for the info button here
                  }}
                  sx={{ color: (theme) => theme.palette.primary.main }}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ##################################### PROFILE ##################################### */}

        <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
          {/* Profile Section */}
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
                {/* <Typography variant="body2" color="textSecondary">
                  Country: {user.profile.country || "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Working Country: {user.profile.workingCountry || "N/A"}
                </Typography> */}
                <Typography variant="body2" color="textSecondary">
                  Current Timezone:{" "}
                  {timeZone ? timeZone : "Unable to determine"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ##################################### POPUP OPTIONS ##################################### */}

          {/* Buttons and Options Section */}
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <PopupOptions
              runInBackground={runInBackground}
              setRunInBackground={setRunInBackground}
              pausePopups={pausePopups}
              setPausePopups={setPausePopups}
            />

            {/* ##################################### FEATURE SECTIONS ##################################### */}

            {/* <Grid item xs={6}>
              <Paper
                elevation={3}
                sx={{ position: "relative", padding: 3, textAlign: "center" }}
              > */}
            {/* Gray overlay for non-pro version */}
            {/* {!isProVersion && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0, 0, 0, 0.5)", // Gray overlay with 50% opacity
                      zIndex: 1,
                      pointerEvents: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "18px",
                    }}
                  >
                    Beta Permission Required
                  </Box>
                )} */}
            {/* Content underneath the overlay */}
            {/* <Typography variant="h6">Change Working Country</Typography>
                <Select
                  value={workingCountry}
                  onChange={handleWorkingCountryChange}
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={!isProVersion} // Disable select for non-pro version
                >
                  <MenuItem value="Sri Lanka">Sri Lanka</MenuItem>
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="United States">United States</MenuItem>
                </Select>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    console.log("Working country changed to:", workingCountry);
                  }}
                  disabled={!isProVersion} // Disable button for non-pro version
                >
                  Change
                </Button>
              </Paper>
            </Grid> */}
          </Grid>

          {/* Space for Future Components */}
          <Grid container spacing={2} sx={{ padding: 2 }}>
            <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
              {/* Other sections... */}

              <PopupQueue queue={popupQueue} />

              {/* Space for Future Components */}
              <Grid container spacing={2} sx={{ padding: 2 }}>
                {/* Add future components here */}
              </Grid>
            </Box>
          </Grid>
        </Box>

        {/* ##################################### FOOTER ##################################### */}

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
            backgroundColor: primary.contrastText,
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
