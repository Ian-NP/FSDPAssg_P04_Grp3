import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css"; 
import styles from '../styles/Withdrawal.module.css';
import { useAccount } from '../contexts/AccountContext';
import { useATM } from '../contexts/AtmContext';
import axios from 'axios';
import OutOfCash from './OutOfCash';
import { trackWithdrawalPatterns, 
  getMostFrequentAmountFromStorage} 
from '../../../server/withdraw';

const Withdrawal = () => {
  const [amount, setAmount] = useState("0.00");
  const [showOutOfCashModal, setShowOutOfCashModal] = useState(false);
  const { accountDetails, withdrawFromAccount } = useAccount();
  const [mostFrequentAmount, setMostFrequentAmount] = useState(null);
  const [showWithdrawButton, setShowWithdrawButton] = useState(false);
  const { cashLevels, withdrawCash } = useATM();
  const navigate = useNavigate(); 
  const threshold = 4;

  useEffect(() => {
    // Retrieve the mostFrequentAmount from localStorage upon component mount
    const storedData = JSON.parse(localStorage.getItem('mostFrequentAmount')) || { amount: null, count: 0 };
    console.log("Retrieved mostFrequentAmount from localStorage:", storedData.amount, "with count:", storedData.count);
  
    // Check if the stored count meets the threshold
    if (storedData.amount && storedData.count >= threshold) {
      setMostFrequentAmount(storedData.amount);
      setShowWithdrawButton(true);
    } else {
      setShowWithdrawButton(false);
    }
  }, []); // Empty dependency array to run only once on component mount

  // Function to update the UI when called by trackWithdrawalPatterns
  const updateUI = (amount, thresholdMet) => {
    console.log(`Update UI called with amount: $${amount}, thresholdMet: ${thresholdMet}`);

    let storedData = JSON.parse(localStorage.getItem('mostFrequentAmount')) || { amount: null, count: 0 };

    // Reset the stored data if the retrieved amount matches the current amount
    if (storedData.amount === amount) {
      storedData.count += 1; // Increment the count if the same amount is being tracked
    } else {
      storedData = { amount, count: 1 }; // Reset the count if a new amount is being tracked
    }

    // Check if the threshold is met, if so, set the `mostFrequentAmount`
    if (thresholdMet) {
      setMostFrequentAmount(amount);
      setShowWithdrawButton(true);

      // Reset the count to 0 in localStorage when the threshold is met
      localStorage.setItem('mostFrequentAmount', JSON.stringify({ amount, count: 0 }));
    } else {
      setShowWithdrawButton(false);
      // Update localStorage with the current amount and count
      localStorage.setItem('mostFrequentAmount', JSON.stringify(storedData));
    }
  };

  // Track withdrawal patterns and update the UI accordingly
  const handleWithdraw = () => {
    console.log("Handling withdraw for amount:", amount);
    resetWithdrawalCounts();
    trackWithdrawalPatterns(amount, updateUI);
  };

  const handleConfirm = async () => {
    console.log("Confirm button clicked with amount:", amount);

    // Validate the amount
    if (amount % 10 !== 0 && amount % 50 !== 0) {
      alert("Please enter amount in multiples of $10 or $50");
      return;
    } else if (amount > accountDetails.balance) {
      alert("Insufficient balance. Please enter a valid amount.");
      return;
    }

    // Calculate the number of $50 and $10 notes required
    let remainingAmount = parseInt(amount);
    const required50Notes = Math.floor(remainingAmount / 50);
    remainingAmount -= required50Notes * 50;
    const required10Notes = remainingAmount / 10;

    // Check if the ATM has enough $50 and $10 notes
    if (cashLevels[50] >= required50Notes && cashLevels[10] >= required10Notes) {
      const success = await withdrawFromAccount(amount);

      if (success) {
        const transactionData = {
          amount: parseInt(amount),
          description: "",
          destination_account: null,
          source_account_id: accountDetails.account_num,
          status: "Completed",
          transaction_date: Date.now(),
          transaction_type: "withdrawal",
        };

        trackWithdrawalPatterns(amount, updateUI);
  
        // Make POST request to log the transaction
        try {
          const response = await axios.post('http://localhost:3000/api/transactions', transactionData);
          if (response.data.success) {
            console.log("Transaction created successfully:", response.data);
            const atmUpdateResponse = withdrawCash(parseInt(amount));

            if (atmUpdateResponse) {
              console.log("ATM cash level updated successfully");
              navigate("/receiptChoice", { 
                state: { 
                  transactionType: "withdrawal", 
                  amount: parseInt(amount), 
                  email: accountDetails.email
                } 
              });

            } else {
              alert("An error occurred while updating the ATM cash level. Please try again.");
            }
          } else {
            alert("An error occurred while recording the transaction. Please try again.");
          }
        } catch (error) {
          console.error("Error creating transaction:", error);
          alert("An error occurred while recording the transaction. Please try again.");
        }
      } else {
        alert("An error occurred during the withdrawal. Please try again.");
      }
    } else {
      setShowOutOfCashModal(true);
    }
  };

  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setAmount(enteredAmount);
  
    // Retrieve current storage data
    let storedData = JSON.parse(localStorage.getItem('mostFrequentAmount')) || { amount: null, count: 0 };
  
    // Check if entered amount matches the stored amount
    if (storedData.amount === enteredAmount) {
      // Increment the count if it's the same amount
      storedData.count += 1;
    } else {
      // Reset with the new amount
      storedData = { amount: enteredAmount, count: 1 };
    }
  
    // Update localStorage with the current amount and count
    localStorage.setItem('mostFrequentAmount', JSON.stringify(storedData));
  
    // Update UI based on threshold
    if (storedData.count >= threshold) {
      setMostFrequentAmount(storedData.amount);
      setShowWithdrawButton(true);
    } else {
      setShowWithdrawButton(false);
    }
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
            onClick={() => setAmount("0.00")} 
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

      {/* Conditionally render the Withdraw button for the most frequent amount */}
      {mostFrequentAmount && showWithdrawButton && (
        <button onClick={() => setAmount(mostFrequentAmount)}>
          Withdraw ${mostFrequentAmount}
        </button>
      )}

      {/* Render the OutOfCash modal if needed */}
      {showOutOfCashModal && <OutOfCash onClose={() => setShowOutOfCashModal(false)} />}
    </div>
  );
};

export default Withdrawal;
