import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom'; 
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css"; 
import styles from '../styles/Withdrawal.module.css';
import axios from 'axios';
import OutOfCash from './OutOfCash'; // Import OutOfCash modal component

const PreOrderWithdrawalScreen = () => {
  const [amount, setAmount] = useState("0.00");
  // Access the state passed via navigation
  const { state } = useLocation();
  const { accountDetails } = state || {}; // Destructure the state safely
  const [showOutOfCashModal, setShowOutOfCashModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate(); 

  const baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;
    console.log(baseURL)

  const handleClear = () => {
    setAmount("0.00");
  };

  console.log(accountDetails);
  const accountBalance = accountDetails?.balance;
  const accountName = accountDetails?.account_name;
  const accountNum = accountDetails?.account_num;

  const handleConfirm = async () => {
    if (amount % 10 !== 0 && amount % 50 !== 0) {
      alert("Please enter amount in multiples of $10 or $50");
      return;
    } else if (amount > accountBalance) {
      alert("Insufficient balance. Please enter a valid amount.");
      return;
    } else {
      console.log("Amount is valid");
      navigate('/preOrderWithdrawalConfirmation', { state: { amount, accountDetails } });
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const isAmountZero = amount === "0.00" || amount === "";

  return (
    <div className={commonStyles['atm-container']}>
      <Header />
      <main className={styles['withdrawal-main']}>
        <h2>Please enter amount in multiples of $10 or $50</h2>
        <div className={styles['input-container']}>
          <span className={styles['currency-symbol']}>$</span>
          <input
            type="text"
            className={`${styles['amount-input']} ${styles['center-align']}`}
            value={amount}
            onChange={handleAmountChange}
            onFocus={() => amount === "0.00" && setAmount("")}
            onBlur={() => amount === "" && setAmount("0.00")}
          />
        </div>
        <div className={styles['button-container']}>
          <Button 
            label="Clear" 
            onClick={handleClear} 
            size="medium" 
            disabled={isAmountZero} 
          />
          <Button 
            label="Confirm" 
            onClick={handleConfirm} 
            size="medium" 
            disabled={isAmountZero} 
          />
        </div>
      </main>

      {/* Render the OutOfCash modal if needed */}
      {showOutOfCashModal && <OutOfCash onClose={() => setShowOutOfCashModal(false)} />}
    </div>
  );
};

export default PreOrderWithdrawalScreen;