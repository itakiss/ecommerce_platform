import React from 'react';
import './LimitExceededModal.css';

const LimitExceededModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button className="ok-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default LimitExceededModal;
