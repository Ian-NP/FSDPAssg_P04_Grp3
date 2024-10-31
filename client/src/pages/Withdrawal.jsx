import React, { useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css"; 
import styles from '../styles/Withdrawal.module.css';

const Withdrawal = () => {
  const [amount, setAmount] = useState("0.00");

  const handleClear = () => {
    setAmount("0.00");
  };

  const handleConfirm = () => {
    console.log("Confirm button clicked with amount:", amount);
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
            className={styles['amount-input']}
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
            size="large" 
            disabled={isAmountZero} 
          />
          <Button 
            label="Confirm" 
            onClick={handleConfirm} 
            size="large" 
            disabled={isAmountZero} 
          />
        </div>
      </main>
    </div>
  );
};

export default Withdrawal;