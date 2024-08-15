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
import logo from "../../../public/assets/images/logo.png";
import dashboard from "../../../public/assets/images/mocks/dashboard_mock.png"; // Adjust path as needed

const Login = ({ onLogin }) => {
  const theme = useTheme();
  const [email, setEmail] = useState(""); // Use "email" to be consistent
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [serverError, setServerError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        {
          email,
          password,
        }
      );
      console.log("Login response: ", response);
      console.log("Login cookies: ", response.cookies);
      console.log("Login data: ", response.data);
      console.log("Login data cookie: ", response.data.data);
      console.log("Login status: ", response.status);
      console.log("Login data status: ", response.data.status);

      if (response.status == 200) {
        //  Setting the token to the request
        const token = response.data.data;
        // document.cookie = `jwt=${token}; path=/; secure; HttpOnly; SameSite=Strict`;

        // Calling for user details - Need to handle errrors
        // const userResponse = await axios.get(
        //   "http://localhost:5000/api/v1/auth/profile",
        //   {
        //     token: token,
        //     electron: true,
        //   }
        // );
        // console.log(userResponse);

        const user = {
          email: email,
          password: password,
          token: token,
          profile: response.data.user,
        };
        onLogin(user); // Pass email, password and token to the onLogin callback as user
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
    alert("Please contact your administration.");
  };

  const handleCloseErrorDialog = () => {
    setServerError(false);
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
      <Box
        sx={{
          flex: 0.9,
          // backgroundColor: theme.palette.background.lightBlueLavender,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            // backgroundImage: dashboard, // Add your left-side image here
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

      {/* Separation Line */}
      <Box
        sx={{
          width: "0.25%",
          height: "90%",
          backgroundColor: theme.palette.background.lightBlueLavender,
          mr: "20px",
        }}
      />
      <Box
        sx={{
          flex: 1.1,
          // backgroundColor: theme.palette.background.lightBlueLavender,
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
            // backgroundColor: "#f5f5f5",
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
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Powered by NuraIT x Ceyapps
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
      </Box>
    </Box>
  );
};

export default Login;
