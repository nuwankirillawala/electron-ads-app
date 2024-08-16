import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, IconButton, Box, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AdWindow = ({ adData, userData }) => {
  const [ad, setAd] = useState(null);
  const [user, setUser] = useState({});
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to manage snackbar visibility

  useEffect(() => {
    const handleShowAd = (event, adData, userData) => {
      setAd(adData);
      setUser(userData);
      console.log("userData to handleShowAd", userData);
    };
    setAd(adData);
    setUser(userData);
    console.log("Ad window called");
    console.log("u", user);
    console.log("userData to AdWindow", userData);
    console.log("adData to AdWindow", adData);

    window.electron.on("show-ad", handleShowAd);

    return () => {
      window.electron.off("show-ad", handleShowAd);
    };
  }, [adData, userData]);

  useEffect(() => {
    console.log("User updated:", user);
  }, [user]);

  const handleReactionClick = async (reaction) => {
    console.log("handle reaction clicked", reaction);

    if (ad) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/popup/react",
          {
            reaction: reaction,
            id: ad._id,
            electron: true,
            token: user.token,
          }
        );
        console.log("React response", response);

        if (response.status == 200) {
          setSelectedReaction(reaction);
        } else {
          setSnackbarOpen(true); // Show snackbar on error
          console.error("Failed to send reaction");
        }
      } catch (error) {
        console.log("catch");

        setSnackbarOpen(true); // Show snackbar on error
        console.error("Error sending reaction:", error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close snackbar
  };

  const isVideo = (url) => {
    const videoExtensions = ["mp4", "webm", "ogg"];
    const urlWithoutQuery = url.split("?")[0];
    const extension = urlWithoutQuery.split(".").pop();
    return videoExtensions.includes(extension);
  };

  if (!ad) return null;

  return (
    <Box
      sx={{
        padding: 4,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconButton
        edge="end"
        color="inherit"
        onClick={() => window.close()}
        aria-label="close"
        sx={{ position: "absolute", right: 16, top: 16 }}
      >
        <CloseIcon />
      </IconButton>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        {ad.title}
      </Typography>
      {ad.image &&
        (isVideo(ad.image) ? (
          <video
            src={ad.image}
            controls
            autoPlay
            style={{
              maxWidth: "100%",
              height: "60vh",
              display: "block",
              marginBottom: 16,
              objectFit: "contain",
            }}
          />
        ) : (
          <img
            src={ad.image}
            alt="Ad"
            style={{
              maxWidth: "100%",
              // height: "300px",
              height: "60vh",
              display: "block",
              marginBottom: 16,
              objectFit: "contain",
            }}
          />
        ))}
      <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
        {ad.message}
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}
      >
        {/* Reaction Mapping
        1 - Like
        0 - Dislike 
        2 - Heart */}

        <IconButton
          color={selectedReaction === 1 ? "primary" : "default"}
          onClick={() => handleReactionClick(1)}
        >
          <ThumbUpIcon />
        </IconButton>
        <IconButton
          color={selectedReaction === 0 ? "warning" : "default"}
          onClick={() => handleReactionClick(0)}
        >
          <ThumbDownIcon />
        </IconButton>
        <IconButton
          color={selectedReaction === 2 ? "error" : "default"}
          onClick={() => handleReactionClick(2)}
        >
          <FavoriteIcon />
        </IconButton>
      </Box>

      {/* Snackbar for error notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to send reaction. Please try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdWindow;
