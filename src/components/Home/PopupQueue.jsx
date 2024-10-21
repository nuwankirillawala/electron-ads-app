import React from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"; // Import the icon for expanding the popup

const PopupQueue = ({ queue }) => {
  const handleExpandPopup = (popup) => {
    // Logic to expand the popup in a new window, e.g., using Electron's IPC
    window.electron.showAd(popup.ad, popup.user, "old");
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Popup Queue
      </Typography>
      {queue.length === 0 ? (
        <Typography variant="body2">No popups in the queue.</Typography>
      ) : (
        queue.map((popup, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              margin: 1,
              padding: 2,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Title and Time Row */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {popup.ad.title}
              </Typography>
              <Typography variant="caption">{popup.ad.scheduleTime}</Typography>
            </Box>

            {/* Body Section */}
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              {popup.ad.message}
            </Typography>

            {/* Expand Icon Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "auto",
              }}
            >
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleExpandPopup(popup)}
                aria-label="Expand popup"
              >
                <OpenInNewIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default PopupQueue;
