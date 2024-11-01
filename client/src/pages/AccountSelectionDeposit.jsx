import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css";
import styles from '../styles/AccountSelectionDeposit.module.css';
import { useNavigate } from 'react-router-dom';

const AccountSelectionDeposit = () => {
  const navigate = useNavigate();

  const onProceed = () => {
    console.log('Proceeding to withdrawal');
    navigate('/withdrawal');
  };

  return (
    <div className={commonStyles['atm-container']}>
      <Header />
      <main className={commonStyles['atm-main']}>
        <h2>Please select your account type</h2>
        <div className={styles['account-buttons-large']}>
          <Button label="Accounts with Statements/ Checking Account/ EasiCredit" onClick={onProceed} size="large" />
          <Button label="Passbook Savings" size="large" />
          <Button label="Account not tagged to your account" size="large" />
        </div>
      </main>
    </div>
  );
};

export default AccountSelectionDeposit;