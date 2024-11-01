import React from 'react';
import { useNavigate } from 'react-router-dom';
import collectCash from '../assets/collectcash.png';
import styles from '../styles/DepositCash.module.css';

const DepositCash = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/transactionSummary'); 
  };

  return (
    <div className={styles['deposit-cash-container']}>
      <img src={collectCash} alt="Cash Deposit" className={styles['cash-image']} />
      <p className={styles['instruction-text']}>Please place your cash in the deposit slot and press Start</p>
      <button onClick={handleStart} className={styles['start-button']}>Start</button>
    </div>
  );
};

export default DepositCash;
