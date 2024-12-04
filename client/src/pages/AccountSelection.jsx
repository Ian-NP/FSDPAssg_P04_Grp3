import React from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css";
import styles from '../styles/AccountSelection.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const AccountSelection = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { amountToWithdraw } = location.state || {}; // Fallback if state is undefined

  const onProceed = () => {
    console.log('Proceeding to withdrawal');
    if (amountToWithdraw) {
      navigate('/withdrawal', { state: { amountToWithdraw } });
    } else{
      navigate('/withdrawal');
    }
  };

  return (
    <div className={commonStyles['atm-container']}>
      <Header />
      <main className={commonStyles['atm-main']}>
        <h2>Please select your account type</h2>
        <div className={styles['account-buttons-large']}>
          <Button label="Accounts with Statements/ Checking Account/ EasiCredit" onClick={onProceed} size="large" />
          <Button label="Passbook Savings" onClick={onProceed} size="large" />
          <Button label="Credit Card Cash Advance" onClick={onProceed} size="large" />
        </div>
      </main>
    </div>
  );
};

export default AccountSelection;