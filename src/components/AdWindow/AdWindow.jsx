import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  IconButton,
  Box,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AdWindow = ({ adData, userData }) => {
  const [ad, setAd] = useState(null);
  const [user, setUser] = useState({});
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reacted, setReacted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleShowAd = (event, adData, userData) => {
      setAd(adData);
      setUser(userData);
    };
    setAd(adData);
    setUser(userData);

    window.electron.on("show-ad", handleShowAd);

    return () => {
      window.electron.off("show-ad", handleShowAd);
    };
  }, [adData, userData]);

  const handleReactionClick = async (reaction) => {
    if (ad) {
      try {
        const response = await axios.post(`${apiUrl}/api/v1/popup/react`, {
          reaction: reaction,
          id: ad._id,
          electron: true,
          token: user.token,
        });

        if (response.status === 200) {
          setSelectedReaction(reaction);
          setReacted(true);
        } else {
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleWindowClose = async () => {
    window.close();
    try {
      if (!reacted) {
        const response = await axios.post(`${apiUrl}/api/v1/popup/react`, {
          reaction: 9,
          id: ad._id,
          electron: true,
          token: user.token,
        });

        if (response.status === 200) {
          window.close();
        } else {
          console.error("Failed to send reaction with value 9");
        }
      } else {
        window.close();
      }
    } catch (error) {
      console.error("Error during reaction handling or window closing:", error);
    }
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
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          borderBottom: "1px solid #ddd",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", flexGrow: 1 }}
        >
          {ad.title}
        </Typography>
        <IconButton
          edge="end"
          sx={{ color: (theme) => theme.palette.error.dark }}
          onClick={() => handleWindowClose()}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Body */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        {ad.image &&
          (isVideo(ad.image) ? (
            <video
              src={ad.image}
              controls
              autoPlay
              muted
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
        {ad.link1 && (
          <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
            <Link href={ad.link1} target="_blank" rel="noopener noreferrer">
              {ad.link1}
            </Link>
          </Typography>
        )}
        {ad.link2 && (
          <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
            <Link href={ad.link2} target="_blank" rel="noopener noreferrer">
              {ad.link2}
            </Link>
          </Typography>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          padding: 2,
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
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
