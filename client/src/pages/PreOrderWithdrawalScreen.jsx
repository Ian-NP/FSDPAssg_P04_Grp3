import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css"; 
import styles from '../styles/Withdrawal.module.css';
import { useAccount } from '../contexts/AccountContext';
import { useATM } from '../contexts/AtmContext';
import axios from 'axios';
import OutOfCash from './OutOfCash'; // Import OutOfCash modal component

const PreOrderWithdrawalScreen = () => {
  const [amount, setAmount] = useState("0.00");
  const [showOutOfCashModal, setShowOutOfCashModal] = useState(false); // State to control modal visibility
  const { accountDetails, withdrawFromAccount } = useAccount();
  const { cashLevels, withdrawCash } = useATM();
  const navigate = useNavigate(); 

  const baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;
    console.log(baseURL)

  const handleClear = () => {
    setAmount("0.00");
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
    } else {
      console.log("Amount is valid");
  
      // Calculate the number of $50 and $10 notes required
      let remainingAmount = parseInt(amount);
      const required50Notes = Math.floor(remainingAmount / 50);
      remainingAmount -= required50Notes * 50;
      const required10Notes = remainingAmount / 10;
  
      // Check if the ATM has enough $50 and $10 notes
      if (cashLevels[50] >= required50Notes && cashLevels[10] >= required10Notes) {
        // Proceed with the withdrawal
        const success = await withdrawFromAccount(amount); // Wait for the withdrawal to complete
  
        if (success) {
          // Prepare transaction data
          const transactionData = {
            amount: parseInt(amount),
            description: "",
            destination_account: null,
            source_account_id: accountDetails.account_num,
            status: "Completed",
            transaction_date: Date.now(), // Current datetime in milliseconds
            transaction_type: "withdrawal",
            cateogry: "cash",
          };
  
          // Make POST request to log the transaction
          try {
            const response = await axios.post(`${baseURL}/api/transactions`, transactionData);
  
            if (response.data.success) {
              console.log("Transaction created successfully:", response.data);
  
              // After successful transaction, update the ATM cash level
              const atmUpdateResponse = withdrawCash(parseInt(amount));
  
              if (atmUpdateResponse) {
                console.log("ATM cash level updated successfully");
  
                // Passing the data to PreOrderQR screen
                navigate("/PreOrderQR", {
                    state: {
                    amount: parseInt(amount),
                    accountDetails: {
                        accountName: accountDetails.account_name,
                        accountNum: accountDetails.account_num
                    }
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
          alert("An error occurred during the withdrawal. Please try again."); // Error handling
        }
      } else {
        // Show the out of cash modal if not enough notes are available
        setShowOutOfCashModal(true); // Show the modal
      }
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