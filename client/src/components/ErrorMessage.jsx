// ErrorMessage.jsx
import React from 'react';

const ErrorMessage = ({ message, isFrozen }) => {
  if (!message) return null; // Don't render if no error message

  const errorStyle = isFrozen
    ? { color: 'black', padding: '10px' }  // Special style for frozen account
    : { color: 'black', padding: '10px' };  // Default error style

  return (
    <div style={errorStyle}>
      <strong>{isFrozen ? 'Account Frozen' : 'Error'}:</strong> {message}
    </div>
  );
};

export default ErrorMessage;
