import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/PreOrderWithdrawalConfirmation.module.css';
import Layout from '../components/Layout';
import SlideButton from '../components/SlideButton';

const PreOrderWithdrawalConfirmation = () => {
    const { state } = useLocation(); // Get state passed from PreOrderWithdrawalScreen
    const { amount, accountDetails } = state || {};  // Extract amount and account details
    const navigate = useNavigate();
    
    const [balanceCheck, setBalanceCheck] = useState(null); // State to manage balance check
    
    // Check if account balance is sufficient
    const isBalanceSufficient = accountDetails?.balance >= amount;

    // Set the balance check result
    useEffect(() => {
        if (accountDetails?.balance) {
            setBalanceCheck(isBalanceSufficient ? 'sufficient' : 'insufficient');
        }
    }, [accountDetails, amount]);

    const handleContinue = () => {
        if (balanceCheck === 'sufficient') {
            navigate('/PreOrderQR');
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