import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Button from './Button';
import './styles/Common.css';
import './styles/Withdrawal.css';

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
    <div className="atm-container">
      <Header />
      <main className="atm-main">
        <h2>Please enter amount in multiples of $10 or $50</h2>
        <div className="input-container">
          <span className="currency-symbol">$</span>
          <input
            type="text"
            ref={inputRef} 
            className="amount-input center-align" 
            value={amount}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="button-container">
          <Button label="Clear" onClick={handleClear} />
          <Button label="Confirm" onClick={handleConfirm} />
        </div>
      </main>
    </div>
  );
};

export default Withdrawal;