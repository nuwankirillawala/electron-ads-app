import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Switch,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import WebStoriesIcon from "@mui/icons-material/WebStories";

const PopupOptions = ({
  runInBackground,
  setRunInBackground,
  pausePopups,
  setPausePopups,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("none");
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Send the isMuted value to the main process whenever it changes
    window.electron.updateMuteStatus(isMuted);
  }, [isMuted]);

  useEffect(() => {
    // Send the initial state to Electron
    window.electron.updateRunInBackground(runInBackground);
  }, [runInBackground]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOk = () => {
    setDialogOpen(false);
    const pauseDuration = parseInt(selectedTime, 10);
    setPausePopups(selectedTime !== "none");
    setIsMuted(selectedTime !== "none");

    if (pauseDuration > 0) {
      setTimeout(() => {
        setPausePopups(false);
        setIsMuted(false);
      }, pauseDuration * 60 * 1000); // Convert minutes to milliseconds
    }
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  return (
    <Grid item xs={6}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography align="center">
          <WebStoriesIcon fontSize="large" color="primary" />
        </Typography>
        <Typography variant="h6" align="center">
          Popup Options
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              Run in background
            </Typography>
            <Switch
              checked={runInBackground}
              onChange={(e) => setRunInBackground(e.target.checked)}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="body2" sx={{ flex: 1 }}>
              Pause Popups
            </Typography>
            <IconButton onClick={handleDialogOpen}>
              {isMuted ? (
                <NotificationsOffIcon color="error" />
              ) : (
                <NotificationsActiveIcon color="primary" />
              )}
            </IconButton>
          </Box>
        </Box>

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
              <FormControlLabel value="none" control={<Radio />} label="None" />
              <FormControlLabel
                value="30"
                control={<Radio />}
                label="30 mins"
              />
              <FormControlLabel value="60" control={<Radio />} label="1 hour" />
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
  );
};

export default PopupOptions;
