import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        onLogin(username, password);
      } else if (response.status === 401) {
        setError("Invalid username or password. Please try again.");
      } else {
        setServerError(true);
      }
    } catch (error) {
      setServerError(true);
    }
  };

  const handleForgotPassword = () => {
    alert("Please contact your administration.");
  };

  const handleInformationClick = () => {
    navigate("/information");
  };

  const handleCloseErrorDialog = () => {
    setServerError(false);
  };

  const handleMinimize = () => {
    window.electron.ipcRenderer.send("minimize-window");
  };

  const handleClose = () => {
    window.electron.ipcRenderer.send("close-window");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 2,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          p: 1,
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
      <Typography variant="h4" align="center" gutterBottom>
        ElectroFact Portal
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        By Fantasia Group
      </Typography>
      <Box
        sx={{
          p: 3,
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: "white",
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        <Link
          component="button"
          variant="body2"
          onClick={handleForgotPassword}
          sx={{ display: "block", mt: 2, textAlign: "center", color: "purple" }}
        >
          Forgot Password?
        </Link>
      </Box>
      <Box mt={2}>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Powered by Fantasia App Solutions
        </Typography>
      </Box>

      <Dialog open={serverError} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Unable to connect to the server. Please check your internet
            connection.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
