/**
 * Component: AdWindow
 * Description: Displays an advertisement window with details such as title, image/video, message, and clickable links.
 *              Allows the user to react to the ad and provides a minimize and close button.
 *
 * Props:
 *  - adData (Object): Advertisement data containing title, image, message, and links.
 *  - userData (Object): User data including user token for API requests.
 *
 * Author: Nuwan Kirillawala @ Ceyapps Global
 */

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
import MinimizeIcon from "@mui/icons-material/Minimize";

const AdWindow = ({ adData, userData }) => {
  // State variables
  const [ad, setAd] = useState(null);
  const [user, setUser] = useState({});
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [reacted, setReacted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    /**
     * Effect: Sets initial ad and user data, and sets up an event listener for showing ads.
     * Cleanup: Removes the event listener on component unmount.
     */
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

  /**
   * Function: handleReactionClick
   * Description: Sends a reaction to the backend based on user selection.
   * @param {Number} reaction - The reaction type (0 for dislike, 1 for like, 2 for favorite).
   */
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

  /**
   * Function: handleCloseSnackbar
   * Description: Closes the snackbar notification.
   */
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  /**
   * Function: handleWindowClose
   * Description: Closes the window and sends a reaction if no reaction was previously sent.
   */
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

  /**
   * Function: handleWindowMinimize
   * Description: Minimizes the application window.
   */
  const handleWindowMinimize = () => {
    console.log("Minimizing");

    if (window.electron && window.electron.minimizeWindow) {
      window.electron.minimizeWindow();
    } else {
      console.error("window.electron.minimizeWindow is not defined");
    }
  };

  /**
   * Function: isVideo
   * Description: Checks if the provided URL points to a video file.
   * @param {String} url - The URL to check.
   * @returns {Boolean} - Returns true if the URL is a video.
   */
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

        {/* Minimize Button */}
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
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (window.electron && window.electron.openExternal) {
              window.electron.openExternal(ad.link1);
            } else {
              console.error("window.electron.openExternal is not defined");
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          {ad.link1}
        </Link>

        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (window.electron && window.electron.openExternal) {
              window.electron.openExternal(ad.link2);
            } else {
              console.error("window.electron.openExternal is not defined");
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          {ad.link2}
        </Link>
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
