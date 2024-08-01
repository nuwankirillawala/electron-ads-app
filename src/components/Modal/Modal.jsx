// src/components/Modal.js
import React from "react";
import "./Modal.css"; // Import the CSS file for styling

const Modal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Error</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
