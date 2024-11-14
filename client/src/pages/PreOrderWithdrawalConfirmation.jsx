import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/PreOrderWithdrawalConfirmation.module.css';
import Layout from '../components/Layout';
import SlideButton from '../components/SlideButton';
import axios from 'axios';
import { useAccount } from '../contexts/AccountContext';
import { useATM } from '../contexts/AtmContext';
import { trackWithdrawalPatterns, getMostFrequentAmountFromStorage} from '../../../server/withdraw'; 

const PreOrderWithdrawalConfirmation = () => {
    const { state } = useLocation();
    const { amount, accountInfo } = state || {};
    const navigate = useNavigate();
    const { cashLevels, withdrawCash } = useATM();
    const { accountDetails, withdrawFromAccount, setAccountDetails } = useAccount(); 
    
    const [balanceCheck, setBalanceCheck] = useState(null);
    const [success, setSuccess] = useState(false);

    setAccountDetails(accountInfo)
    const accountName = accountDetails?.account_name
    const accountNum = accountDetails?.account_num
    const isBalanceSufficient = accountDetails?.balance >= amount;

    useEffect(() => {
        if (accountDetails?.balance) {
            setBalanceCheck(isBalanceSufficient ? 'sufficient' : 'insufficient');
        }
    }, [accountDetails, amount]);

    const baseURL = `${window.location.protocol}//${window.location.hostname}:3000`;
    console.log(baseURL)

    // *IMPORTANT*
    // IAN HERE, I COMMENTED THIS PART OUT BECAUSE THIS SHOULD BE HANDLED BY AFTER SCANNING THE QR CODE AT THE ATM
    const handleContinue = async () => {
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

    const handleSlideComplete = () => {
        console.log('QR Code Generated');
        handleContinue();
    };

    return (
        <Layout>
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
                        <h3>{accountName || 'Account Name'}</h3>
                        <p>{accountNum || 'Account Number'}</p>
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