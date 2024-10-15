import React, { useState } from "react";
import axios from "axios";
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
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";

import logo from "/assets/images/logo.png";
import dashboard from "/assets/images/mocks/dashboard_mock.png";
import qhr_logo from "/assets/images/qhr_logo.svg";

const Login = ({ onLogin }) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        "https://hr-app-api-n2c1.onrender.com/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      console.log("response ", response);

      if (response.status === 200) {
        const token = response.data.data;

        const user = {
          email: email,
          password: password,
          token: token,
          profile: response.data.user,
        };
        onLogin(user);
      } else if (response.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
        setServerError(true);
      }
    } catch (error) {
      setServerError(true);
    }
  };

  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  const handleCloseErrorDialog = () => {
    setServerError(false);
    setForgotPassword(false);
  };

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
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Left Side */}
      <Box
        sx={{
          flex: 0.9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "80%",
            backgroundImage: `url(${dashboard})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginLeft: -20,
            paddingTop: 10,
          }}
        >
          <img
            src={dashboard}
            alt="dashboard"
            style={{ marginBottom: "1rem" }}
          />
        </Box>
      </Box>

      {/* Center Line */}
      <Box
        sx={{
          width: "0.25%",
          height: "90%",
          backgroundColor: theme.palette.background.lightBlueLavender,
          mr: "20px",
        }}
      />

      {/* Right Side */}
      <Box
        sx={{
          flex: 1.1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            p: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              p: 0.5,
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

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ width: "100px", marginBottom: "1rem" }}
            />
            <Typography
              variant="h4"
              align="left"
              sx={{ marginBottom: "0.5rem" }}
            >
              Welcome 👋
            </Typography>
            <Typography variant="body2" align="left" sx={{ color: "gray" }}>
              Please login here
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1,
              maxWidth: 400,
              width: "100%",
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                  setError(false);
                }}
                error={emailError}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                  setError(false);
                }}
                error={passwordError}
                sx={{ mb: 1 }}
              />
              {error && (
                <Typography color="error" sx={{ mb: 1 }}>
                  {error}
                </Typography>
              )}
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
                sx={{
                  display: "block",
                  mt: 2,
                  textAlign: "center",
                  color: "purple",
                }}
              >
                Forgot Password?
              </Link>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </form>
          </Box>
          <Box mt={2}>
            <Box
              component="img"
              src={qhr_logo}
              alt="Quantum HR Logo"
              sx={{ width: 24, height: 24, mr: 1 }}
            />
          </Box>

          {/* Server Error Dialog Box */}
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

          {/* Forgot Password Dialog Box */}
          <Dialog open={forgotPassword} onClose={handleCloseErrorDialog}>
            <DialogTitle>Ooops. Forgot Password?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please contact your administration.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseErrorDialog} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
