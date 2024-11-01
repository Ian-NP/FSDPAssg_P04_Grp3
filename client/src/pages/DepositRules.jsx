import React from 'react';
import { useNavigate } from 'react-router-dom';
import depositRules from '../assets/depositrules.png';
import styles from '../styles/DepositRules.module.css';

const DepositRules = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/depositCash'); 
  };

  return (
    <div className={styles['deposit-rules-container']}>
      <img src={depositRules} alt="Deposit Rules" className={styles['rules-image']} />
      <button onClick={handleContinue} className={styles['continue-button']}>Continue</button>
    </div>
  );
};

export default DepositRules;