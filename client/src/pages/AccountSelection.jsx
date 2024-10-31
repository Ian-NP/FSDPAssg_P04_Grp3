import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import "../styles/Common.css"; // Import Common.css
import styles from '../styles/AccountSelection.module.css'; // Change to .module.css
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AccountSelection = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const onProceed = () => {
    console.log('Proceeding to withdrawal');
    navigate('/withdrawal'); // Use navigate instead of Navigate
  };

  return (
    <div className={styles['atm-container']}>
      <Header />
      <main className={styles['atm-main']}>
        <h2>Please select your account type</h2>
        <div className={styles['account-buttons']}>
          <Button label="Accounts with Statements/ Checking Account/ EasiCredit" onClick={onProceed} size="large" />
          <Button label="Passbook Savings" size="large" />
          <Button label="Credit Card Cash Advance" size="large" />
        </div>
      </main>
    </div>
  );
};

export default AccountSelection;
