import React from 'react';
import './ConfirmDialog.css';

function ConfirmDialog({ isOpen, onConfirm, onCancel, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-title">{title}</div>
        <div className="confirm-content">{children}</div>
        <div className="confirm-buttons">
          <button onClick={onCancel} className="confirm-button cancel">Cancel</button>
          <button onClick={onConfirm} className="confirm-button confirm">OK</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
