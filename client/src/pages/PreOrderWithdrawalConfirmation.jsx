import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/PreOrderWithdrawalConfirmation.module.css';
import Layout from '../components/Layout';
import SlideButton from '../components/SlideButton';
import axios from 'axios';

const PreOrderWithdrawalConfirmation = () => {
    const { state } = useLocation();
    const { amount, accountDetails } = state || {};
    const navigate = useNavigate();
    
    const [balanceCheck, setBalanceCheck] = useState(null);
    const [success, setSuccess] = useState(false);

    const isBalanceSufficient = accountDetails?.balance >= amount;

    useEffect(() => {
        if (accountDetails?.balance) {
            setBalanceCheck(isBalanceSufficient ? 'sufficient' : 'insufficient');
        }
    }, [accountDetails, amount]);

    // *IMPORTANT*
    // IAN HERE, I COMMENTED THIS PART OUT BECAUSE THIS SHOULD BE HANDLED BY AFTER SCANNING THE QR CODE AT THE ATM
    // const handleContinue = async () => {
    //     // Define transaction data to send to the backend
    //     const transactionData = {
    //         accountId: accountDetails?.id, // Ensure account ID is available in accountDetails
    //         amount: parseInt(amount),
    //         transactionType: "withdrawal"
    //     };

    //     // Make POST request to log the transaction
    //     try {
    //         const response = await axios.post('http://localhost:3000/api/transactions', transactionData);

    //         if (response.data.success) {
    //             console.log("Transaction created successfully:", response.data);
    //             setSuccess(true);

    //             // Navigate to the ReceiptChoice page with transaction details
    //             navigate("/receiptChoice", { 
    //                 state: { 
    //                     transactionType: "withdrawal", 
    //                     amount: parseInt(amount), 
    //                     email: accountDetails.email 
    //                 } 
    //             });
    //         } else {
    //             alert("An error occurred while recording the transaction. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error("Error creating transaction:", error);
    //         alert("An error occurred while recording the transaction. Please try again.");
    //     }
    // };

    const handleSlideComplete = () => {
        console.log('QR Code Generated');
        handleContinue();
    };

    return (
        <Layout>
            <p>{amount}</p>
            <div className={styles.container}>
                <section className={styles.infoSection}>
                    <div className={styles.row}>
                        <span className={styles.label}>Amount to withdraw:</span>
                        <span className={styles.value}>
                            {amount ? `${amount} SGD` : 'Loading...'}
                        </span>
                    </div>
                </section>
                
                {accountDetails && (
                    <section className={styles.accountInfo}>
                        <span className={styles.fromLabel}>From</span>
                        <h3>{accountDetails.accountName || 'Account Name'}</h3>
                        <p>{accountDetails.accountNum || 'Account Number'}</p>
                    </section>
                )}

                {balanceCheck === 'insufficient' && (
                    <div className={styles.errorMessage}>
                        <p>Your balance is insufficient to complete this withdrawal.</p>
                    </div>
                )}

                <footer className={styles.footer}>
                    <p>Please check that all details are correct before proceeding</p>
                    <SlideButton onSlideComplete={handleSlideComplete} disabled={balanceCheck === 'insufficient'} />
                </footer>
            </div>
        </Layout>
    );
};

export default PreOrderWithdrawalConfirmation;