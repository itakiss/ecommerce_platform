import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-button confirm" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
