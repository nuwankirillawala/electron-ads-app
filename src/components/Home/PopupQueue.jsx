/**
 * @file PopupQueue.jsx
 * @description A component that displays the queue of stored popups, allowing users to view
 *              popup details and expand them into new windows.
 * @version 1.0.0
 * @date 2024-10-20
 * @Author: Nuwan Kirillawala @ Ceyapps Global
 *
 * @component
 * @example
 * // Usage in another component
 * <PopupQueue queue={queue} />
 *
 * @param {Object} props - The properties object.
 * @param {Array} props.queue - Array of popup objects containing ad and user data to be displayed.
 *
 * @returns {JSX.Element} A component that renders the popup queue.
 */

import React from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew"; // Icon for expanding the popup

/**
 * PopupQueue Component
 * @param {Object} props - The properties object.
 * @param {Array} props.queue - Array of popup objects to be displayed.
 * @returns {JSX.Element} A component that renders the popup queue.
 */
const PopupQueue = ({ queue }) => {
  // ---------------------- Event Handlers ----------------------
  /**
   * handleExpandPopup - Expands the popup in a new window.
   * @param {Object} popup - The popup object containing ad and user data.
   */
  const handleExpandPopup = (popup) => {
    // Logic to expand the popup in a new window, using Electron's IPC
    window.electron.showAd(popup.ad, popup.user, "old");
  };

  // ---------------------- Render ----------------------
  return (
    <Box sx={{ padding: 2 }}>
      {/* Header */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Popup Queue
      </Typography>

      {/* If no popups are available */}
      {queue.length === 0 ? (
        <Typography variant="body2">No popups in the queue.</Typography>
      ) : (
        // Display each popup in the queue
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
