/**
 * @file PopupOptions.jsx
 * @description A component that displays and manages popup options, including the ability to run
 *              the application in the background and pause popups for a specific duration.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @component
 * @example
 * // Usage in another component
 * <PopupOptions
 *   runInBackground={runInBackground}
 *   setRunInBackground={setRunInBackground}
 *   pausePopups={pausePopups}
 *   setPausePopups={setPausePopups}
 * />
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.runInBackground - Flag to indicate if the application should run in the background.
 * @param {Function} props.setRunInBackground - Function to toggle running in the background.
 * @param {boolean} props.pausePopups - Flag to indicate if popups are currently paused.
 * @param {Function} props.setPausePopups - Function to toggle popup pausing.
 *
 * @returns {JSX.Element} A component that renders and manages popup options.
 */

import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import WebStoriesIcon from "@mui/icons-material/WebStories";

/**
 * PopupOptions Component
 * @param {Object} props - The properties object.
 * @param {boolean} props.runInBackground - Flag to indicate if the application should run in the background.
 * @param {Function} props.setRunInBackground - Function to toggle running in the background.
 * @param {boolean} props.pausePopups - Flag to indicate if popups are currently paused.
 * @param {Function} props.setPausePopups - Function to toggle popup pausing.
 * @returns {JSX.Element} A component that renders and manages popup options.
 */
const PopupOptions = ({
  runInBackground,
  setRunInBackground,
  pausePopups,
  setPausePopups,
}) => {
  // ---------------------- State Variables ----------------------
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("none");
  const [isMuted, setIsMuted] = useState(false);

  // ---------------------- Effects ----------------------
  useEffect(() => {
    // Sync the muted state with the Electron main process
    window.electron.updateMuteStatus(isMuted);
  }, [isMuted]);

  useEffect(() => {
    // Sync the run-in-background state with the Electron main process
    window.electron.updateRunInBackground(runInBackground);
  }, [runInBackground]);

  // ---------------------- Event Handlers ----------------------
  /**
   * Opens the dialog for selecting the pause duration.
   */
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  /**
   * Closes the dialog without making changes.
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  /**
   * Confirms the pause duration and notifies the Electron main process.
   */
  const handleDialogOk = () => {
    setDialogOpen(false);
    const pauseDuration = parseInt(selectedTime, 10);
    setPausePopups(selectedTime !== "none");
    setIsMuted(selectedTime !== "none");

    if (pauseDuration > 0) {
      // Notify the Electron main process to set up reminders
      window.electron.setPauseDuration(pauseDuration);

      setTimeout(() => {
        setPausePopups(false);
        setIsMuted(false);
      }, pauseDuration * 60 * 1000); // Convert minutes to milliseconds
    }
  };

  /**
   * Updates the selected pause duration.
   * @param {Object} event - The change event.
   */
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  // ---------------------- Render ----------------------
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
          {/* Title and Icon */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <WebStoriesIcon fontSize="large" color="primary" />
            <Typography variant="h6" align="center">
              Popup Options
            </Typography>
          </Box>

          {/* Options */}
          <Box>
            {/* Run in Background Toggle */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="body1">Run in background</Typography>
              <Switch
                checked={runInBackground}
                onChange={(e) => setRunInBackground(e.target.checked)}
              />
            </Box>

            {/* Pause Popups Button */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="body1">Pause Popups</Typography>
              <IconButton onClick={handleDialogOpen}>
                {isMuted ? (
                  <NotificationsOffIcon color="error" />
                ) : (
                  <NotificationsActiveIcon color="primary" />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Dialog for Pause Duration */}
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Pause Popups</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please select the duration for which you would like to pause the
                popups:
              </DialogContentText>
              <RadioGroup
                aria-label="pause duration"
                name="pause-duration"
                value={selectedTime}
                onChange={handleTimeChange}
              >
                <FormControlLabel
                  value="none"
                  control={<Radio />}
                  label="None"
                />
                <FormControlLabel
                  value="30"
                  control={<Radio />}
                  label="30 mins"
                />
                <FormControlLabel
                  value="60"
                  control={<Radio />}
                  label="1 hour"
                />
                <FormControlLabel
                  value="120"
                  control={<Radio />}
                  label="2 hours"
                />
                <FormControlLabel
                  value="240"
                  control={<Radio />}
                  label="4 hours"
                />
                <FormControlLabel
                  value="480"
                  control={<Radio />}
                  label="8 hours"
                />
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button onClick={handleDialogOk}>OK</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PopupOptions;
