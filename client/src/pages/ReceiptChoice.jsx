import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from '../styles/Common.module.css';
import styles from '../styles/ReceiptChoice.module.css';

const ReceiptChoice = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/removeCard');
  };

  return (
    <div className={commonStyles['atm-container']}>
      <Header onExit={() => alert("Exiting page")} />
      <main className={styles['receipt-choice-main']}>
        <h2 className={styles['title']}>Would you like a receipt?</h2>
        <div className={styles['button-group-wrapper']}>
          <div className={styles['button-group']}>
            <Button label="No (Hide my balance)" onClick={handleButtonClick} size="large" />
            <Button label="No (Show my balance)" onClick={handleButtonClick} size="large" />
            <Button label="Yes" onClick={handleButtonClick} size="large" />
            <Button label="Yes (Email)" onClick={handleButtonClick} size="large" />
            <Button label="Yes (SMS)" onClick={handleButtonClick} size="large" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceiptChoice;
