import React, { useState } from 'react';
import styles from '../styles/PreOrderWithdrawalScreen.module.css';
import Layout from '../components/Layout';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const PreOrderWithdrawalScreen = () => {
    const [amount, setAmount] = useState(0);
    const [suggestions, setSuggestions] = useState([]); // State for ATM suggestions

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/'); // Change this if you want to navigate to a specific screen
    };

    const handleContinue = async () => {
        // Send the amount to your backend to save in Firebase
        try {
            const response = await fetch('http://localhost:3000/save-withdrawal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: amount }),
            });
    
            const result = await response.json();
            if (response.ok) {
                navigate('/PreOrderWithdrawalConfirmation');
            } else {
                alert('Error: ' + result);
            }
        } catch (error) {
            console.error('Error saving withdrawal:', error);
            alert('An error occurred while saving the withdrawal.');
        }
    };    

    return (
        <Layout>

            {/* Title and Amount Input */}
            <section className={styles.withdrawalSection}>
                <h2>Pre-Order Withdrawal</h2>
                <div className={styles.amountInput}>
                <input
                    type="text" // Switch to "text" for mobile handling
                    inputMode="decimal" // Allows decimal input on mobile numeric keyboards
                    placeholder="Enter amount"
                    value={amount}
                    onFocus={() => {
                        if (amount === 0) setAmount(''); // Clear initial 0 on focus
                    }}
                    onBlur={() => {
                        if (amount === '') setAmount(0); // Reset to 0 if the field is left empty
                    }}
                    onInput={(e) => {
                        const enteredValue = e.target.value;
                    
                        // If the input is cleared, set amount to an empty string
                        if (enteredValue === '') {
                            setAmount('');
                            return;
                        }
                    
                        const enteredAmount = parseFloat(enteredValue);
                        if (!isNaN(enteredAmount) && enteredAmount <= 20000) {
                            setAmount(enteredAmount);
                        } else if (enteredAmount > 20000) {
                            alert("Amount exceeds daily limit of 20,000 SGD");
                        }
                    }}
                />
                </div>
            </section>

            {/* Action Buttons */}
            <div className={styles.buttons}>
                <button onClick={handleCancel} className={styles.cancelButton}>
                    Cancel
                </button>
                <button onClick={handleContinue} className={styles.confirmButton}>
                    Confirm Pre-Order
                </button>
            </div>
        </Layout>
    );
};

export default PreOrderWithdrawalScreen;