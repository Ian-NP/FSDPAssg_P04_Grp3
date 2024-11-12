import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import styles from '../styles/LandingPage.module.css';
import { useAccount } from '../contexts/AccountContext';
import BalanceEnquiry from '../assets/balanceEnquiry.svg';
import ScanPay from "../assets/ScanPay.svg";
import axios from 'axios';

const LandingPage = () => {
    const {accountDetails, setAccountDetails, withdrawFromAccount} = useAccount();
    const navigate = useNavigate();
    
    const handleOnClick = async (amount) => {
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
                    console.log(response.data.success);
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

    const otherCashAmount = () => {
        // Navigate to Withdrawal page
        navigate("/withdrawal");
    }

    const handleBalanceEnquiryClick = () => {
        navigate('/balanceEnquiry'); // Replace with the appropriate route or action
    };

    const handleMoreServicesClick = () => {
        navigate('/mainMenu'); // Replace with the appropriate route or action
    };

    return (
        <Layout>
            <div className={styles.landingPageContainer}>
                <div className={styles.landingPageLeftContainer}>
                    <div className={styles.landingPageHeader}>
                        <p>Hello {accountDetails.account_name}! 👋</p>
                        <p>What would you like to do today?</p>
                    </div>
                    <div className={styles.withdrawalContainer}>
                        <h3>Get Cash</h3>
                        <div className={styles.getCashContainer}>
                            <button 
                                className={styles.button}
                                onClick={() => handleOnClick(50)}
                            >
                                $50
                            </button>
                            <button 
                                className={styles.button}
                                onClick={() => handleOnClick(80)}
                            >
                                $80
                            </button>
                            <button 
                                className={styles.button}
                                onClick={() => handleOnClick(100)}
                            >
                                $100
                            </button>
                            <button 
                                className={styles.button}
                                onClick={() => handleOnClick(200)}
                            >
                                $200
                            </button>
                        </div>
                        <button 
                            className={styles.button}
                            onClick={otherCashAmount}
                        >
                            Other cash amount
                        </button>
                    </div>
                </div>
                <div className={styles.landingPageRightContainer}>
                    <h3>Other services</h3>
                    <div className={styles.otherServiceBtnContainer}>
                        <div className={styles.otherServiceBtn} onClick={handleBalanceEnquiryClick}>
                            <img src={BalanceEnquiry} alt="Balance Enquiry" />
                            <p>Ask about Balance</p>
                        </div>
                        <div className={styles.otherServiceBtn}>
                            <img src={ScanPay} alt="Transfer Funds" />
                            <p>QR code to withdraw</p>
                        </div>
                    </div>
                    <button 
                        className={styles.moreServicesButton}
                        onClick={handleMoreServicesClick}
                    >
                        More services &gt;
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default LandingPage;
