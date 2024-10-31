import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from '../styles/Common.module.css';
import styles from '../styles/ReceiptChoice.module.css';

const ReceiptChoice = ({ onSelectOption }) => {
  return (
    <div className={commonStyles['atm-container']}>
      <Header onExit={() => alert("Exiting page")} />
      <main className={styles['receipt-choice-main']}>
        <h2 className={styles['title']}>Would you like a receipt?</h2>
        <div className={styles['button-group']}>
          <Button label="No (Hide my balance)" onClick={() => onSelectOption('no-hide')} size="large" />
          <Button label="No (Show my balance)" onClick={() => onSelectOption('no-show')} size="large" />
          <Button label="Yes" onClick={() => onSelectOption('yes')} size="large" />
          <Button label="Yes (Email)" onClick={() => onSelectOption('yes-email')} size="large" />
          <Button label="Yes (SMS)" onClick={() => onSelectOption('yes-sms')} size="large" />
        </div>
      </main>
    </div>
  );
};

export default ReceiptChoice;