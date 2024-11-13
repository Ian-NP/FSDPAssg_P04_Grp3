import React, { useState } from 'react';
import styles from '../styles/PreOrderWithdrawalScreen.module.css';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const PreOrderWithdrawalScreen = () => {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    

    const handleInputChange = (e) => {
        const enteredValue = e.target.value.trim();
        if (!enteredValue) {
            setAmount('');
            return;
        }

        const enteredAmount = parseFloat(enteredValue);
        if (!isNaN(enteredAmount)) {
            if (enteredAmount <= 20000) {
                setAmount(enteredAmount);
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