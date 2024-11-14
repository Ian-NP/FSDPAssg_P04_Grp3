import React, { useState } from 'react';
import styles from '../styles/PreOrderWithdrawalScreen.module.css';
import Layout from '../components/Layout';
import { useNavigate, useLocation } from 'react-router-dom';

const PreOrderWithdrawalScreen = () => {
    const [amount, setAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { accountBalance } = location.state || {}; // Receiving balance from previous screen
    const { accountName } = location.state || {}; // Receiving balance from previous screen
    const { accountNum } = location.state || {}; // Receiving balance from previous screen

    const handleCancel = () => {
        navigate('/PreOrderWithdrawal'); // Navigate back to PreOrderWithdrawal
    };

    const handleContinue = () => {
        // Check if the entered amount is less than or equal to the balance
        if (amount <= accountBalance) {
            // Check if the entered amount is divisible by 10 or 50
            if (amount % 10 === 0 || amount % 50 === 0) {
                // Passing amount and accountBalance to the confirmation page
                navigate('/PreOrderQR', {
                    state: {
                        amount,
                        accountDetails: { balance: accountBalance, accountName, accountNum }
                    }
                });
            } else {
                setErrorMessage('Amount must be divisible by 10 or 50.');
            }
        } else {
            setErrorMessage('Insufficient funds.');
        }
    };

    const handleInputChange = (e) => {
        const enteredValue = e.target.value.trim();
        if (!enteredValue) {
            setAmount('');
            setErrorMessage('');
            return;
        }

        const enteredAmount = parseFloat(enteredValue);
        if (!isNaN(enteredAmount)) {
            if (enteredAmount <= 20000) {
                setAmount(enteredAmount);
                setErrorMessage('');
            } else {
                alert("Amount exceeds daily limit of 20,000 SGD.");
                setAmount(20000);
            }
        }
    };

    return (
        <Layout>
            <section className={styles.withdrawalSection}>
                <h2>Pre-Order Withdrawal</h2>
                <div className={styles.amountInput}>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter amount"
                        value={amount === 0 ? '' : amount}
                        onFocus={() => {
                            if (amount === 0) setAmount('');
                        }}
                        onBlur={() => {
                            if (amount === '') setAmount(0);
                        }}
                        onInput={handleInputChange}
                    />
                    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
                </div>
            </section>

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