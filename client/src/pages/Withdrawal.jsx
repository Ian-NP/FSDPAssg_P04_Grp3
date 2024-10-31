import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css"; // Import Common.css
import styles from '../styles/Withdrawal.module.css'; // Change to .module.css

const Withdrawal = () => {
  const [amount, setAmount] = useState("0.00");
  const inputRef = useRef(null); 

  const handleClear = () => {
    setAmount("0.00");
  };

  const handleConfirm = () => {
    console.log("Confirm button clicked with amount:", amount);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.selectionEnd = amount.length;
    }
  }, [amount]);

  const handleFocus = () => {
    if (amount === "0.00") {
      setAmount(""); 
    }
  };

  const handleBlur = () => {
    if (amount === "") {
      setAmount("0.00"); 
    }
  };

  return (
    <div className={commonStyles['atm-container']}>
      <Header />
      <main className={commonStyles['atm-main']}>
        <h2>Please enter amount in multiples of $10 or $50</h2>
        <div className={styles['input-container']}>
          <span className={styles['currency-symbol']}>$</span>
          <input
            type="text"
            ref={inputRef} 
            className={styles['amount-input']} 
            value={amount}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className={commonStyles['button-container']}>
          <Button label="Clear" onClick={handleClear} />
          <Button label="Confirm" onClick={handleConfirm} />
        </div>
      </main>
    </div>
  );
};

export default Withdrawal;
