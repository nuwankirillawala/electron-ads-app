import React, { useEffect, useCallback } from "react";

const AdContent = ({ ad, username, onClose }) => {
  const sendAdReadRequest = useCallback(async () => {
    try {
      await fetch("http://localhost:3000/ad-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, adId: ad.id }),
      });
    } catch (error) {
      console.error("Error sending ad-read request:", error);
    }
  }, [ad.id, username]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      event.preventDefault();
      await sendAdReadRequest();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sendAdReadRequest]);

  const handleCloseButtonClick = async () => {
    console.log("handle Close Called");
    await sendAdReadRequest();
    console.log("Await for send request");
    onClose();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{ad.title}</h1>
      <p style={styles.description}>{ad.description}</p>
      {ad.image && <img src={ad.image} alt="Ad Image" style={styles.image} />}
      <a
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        Learn more
      </a>
      <div style={styles.buttonContainer}>
        <button style={styles.closeButton} onClick={handleCloseButtonClick}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 20,
  },
  title: {
    color: "#333",
  },
  description: {
    color: "#555",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  buttonContainer: {
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  closeButtonHover: {
    backgroundColor: "#c82333",
  },
};

export default AdContent;
