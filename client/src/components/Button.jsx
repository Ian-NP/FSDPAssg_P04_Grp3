import React from 'react';
import '../styles/Button.css';

const Button = ({ label, onClick, size = 'medium' }) => {
  return (
    <button className={`atm-button ${size}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;