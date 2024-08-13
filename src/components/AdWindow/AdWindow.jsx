import React, { useEffect, useState } from "react";
import { Typography, Button, IconButton, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import FavoriteIcon from "@mui/icons-material/Favorite";

const AdWindow = ({ adData }) => {
  const [ad, setAd] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState(null);

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
  }, []);

  const handleReactionClick = async (reactionType) => {
    if (ad) {
      setSelectedReaction(reactionType);
      try {
        const response = await fetch("http://localhost:5000/api/v1/reaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reactionType,
            adTitle: ad.title, // or use ad.id if available
          }),
        });

        if (response.ok) {
          setSelectedReaction(reactionType);
        } else {
          console.error("Failed to send reaction");
        }
      } catch (error) {
        console.error("Error sending reaction:", error);
      }
    }
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
        <IconButton
          color={selectedReaction === "like" ? "primary" : "default"}
          onClick={() => handleReactionClick("like")}
        >
          <ThumbUpIcon />
        </IconButton>
        <IconButton
          color={selectedReaction === "dislike" ? "warning" : "default"}
          onClick={() => handleReactionClick("dislike")}
        >
          <ThumbDownIcon />
        </IconButton>
        <IconButton
          color={selectedReaction === "heart" ? "error" : "default"}
          onClick={() => handleReactionClick("heart")}
        >
          <FavoriteIcon />
        </IconButton>
      </Box>
      {/* <Button
        variant="outlined"
        color="secondary"
        onClick={() => window.close()}
        sx={{ marginTop: 4 }}
      >
        Close
      </Button> */}
    </Box>
  );
};

export default AdWindow;
