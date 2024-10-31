import React from 'react';
import styles from '../styles/Button.module.css';

const Button = ({ label, onClick, size = 'medium' }) => {
  return (
    <button className={`${styles['atm-button']} ${styles[size]}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
