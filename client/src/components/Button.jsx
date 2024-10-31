import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ label, onClick, size = 'medium', disabled = false }) => {
  return (
    <button 
      className={`${styles['atm-button']} ${styles[size]}`} 
      onClick={onClick} 
      disabled={disabled} 
    >
      {label}
    </button>
  );
};

export default Button;