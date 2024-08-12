import React from "react";
import {
  Typography,
  Button,
  Paper,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";

const Home = ({ user, onLogout, onShowDummyAd }) => {
  const handleMinimize = () => {
    if (window.electron && window.electron.minimizeWindow) {
      window.electron.minimizeWindow();
    } else {
      console.error("Electron IPC context not available");
    }
  };

  const handleClose = () => {
    if (window.electron && window.electron.closeWindow) {
      window.electron.closeWindow();
    } else {
      console.error("Electron IPC context not available");
    }
  };

  return (
    <Box sx={{ height: "90vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: "flex-end",
          width: "100%",
          backgroundColor: "grey.200",
        }}
      >
        <IconButton onClick={handleMinimize}>
          <MinimizeIcon />
        </IconButton>
        <IconButton onClick={handleMinimize}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <Grid container spacing={2} sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Welcome{user && user.firstName ? `, ${user.firstName}` : ""}
            </Typography>

            <Button variant="contained" color="primary" onClick={onShowDummyAd}>
              Show Dummy Ad
            </Button>
          </Paper>
        </Grid>
        {/* More Grid items for other cards can be uncommented and used here */}
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
  );
};

export default Home;
