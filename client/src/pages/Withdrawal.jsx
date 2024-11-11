import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from "../styles/Common.module.css"; 
import styles from '../styles/Withdrawal.module.css';
import { useAccount } from '../contexts/AccountContext';
import axios from 'axios';

const Withdrawal = () => {
  const [amount, setAmount] = useState("0.00");
  const { accountDetails, withdrawFromAccount } = useAccount();
  const navigate = useNavigate(); 

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
                transaction_type: "withdrawal"
            };

            // Make POST request to log the transaction
            try {
                const response = await axios.post('http://localhost:3000/api/transactions', transactionData);
                if (response.data.success) {
                    console.log("Transaction created successfully:", response.data);
                    // Navigate to ReceiptChoice and pass transaction data
                    navigate("/receiptChoice", { 
                        state: { 
                            transactionType: "withdrawal", 
                            amount: parseInt(amount), 
                            email: accountDetails.email // Pass the user's email
                        } 
                    }); 
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
    </div>
  );
};

export default Withdrawal;
