import React, { useEffect, useState } from "react";
import { Typography, IconButton, Box, Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AdWindow = ({ adData }) => {
  const [ad, setAd] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to manage snackbar visibility

  useEffect(() => {
    const handleShowAd = (event, adData) => {
      setAd(adData);
    };
    setAd(adData);
    console.log("Ad window called");

    window.electron.on("show-ad", handleShowAd);

    return () => {
      window.electron.off("show-ad", handleShowAd);
    };
  }, [adData]);

  const handleReactionClick = async (reaction) => {
    if (ad) {
      try {
        const response = await fetch(
          "https://hr-app-api-n2c1.onrender.com/api/v1/popup/react",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reaction,
              id: ad._id,
            }),
          }
        );

        if (response.ok) {
          setSelectedReaction(reaction);
        } else {
          setSnackbarOpen(true); // Show snackbar on error
          console.error("Failed to send reaction");
        }
      } catch (error) {
        setSnackbarOpen(true); // Show snackbar on error
        console.error("Error sending reaction:", error);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close snackbar
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
      {ad.image && (
        <img
          src={ad.image}
          alt="Ad"
          style={{
            maxWidth: "100%",
            height: "300px",
            display: "block",
            marginBottom: 16,
            objectFit: "contain",
          }}
        />
      )}
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
