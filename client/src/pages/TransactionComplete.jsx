import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import tickImage from '../assets/tick.png'; 
import commonStyles from '../styles/Common.module.css';
import styles from '../styles/TransactionComplete.module.css';

const TransactionComplete = () => {
  const navigate = useNavigate();

  const handleNoClick = () => {
    navigate('/exit'); 
  };

  const handleYesClick = () => {
    navigate('/mainMenu'); 
  };

  return (
    <div className={commonStyles['atm-container']}>
      <Header />
      <main className={styles['transaction-complete-main']}>
        <img src={tickImage} alt="Transaction Complete" className={styles['tick-image']} />
        <h2>Your transaction has been completed</h2>
        <p>Is there anything else you would like to do?</p>
        <div className={styles['button-group']}>
          <Button label="No" onClick={handleNoClick} size="medium" />
          <Button label="Yes" onClick={handleYesClick} size="medium" />
        </div>
      </main>
    </div>
  );
};

export default TransactionComplete;
