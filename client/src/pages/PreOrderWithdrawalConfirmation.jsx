import React, { useState, useEffect } from 'react';
import styles from '../styles/PreOrderWithdrawalConfirmation.module.css';
import Layout from '../components/Layout';
import SlideButton from '../components/SlideButton';
import { useNavigate } from 'react-router-dom';

const PreOrderWithdrawalConfirmation = () => {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/'); // Update this path if needed
    };

    const handleContinue = () => {
        navigate('/PreOrderQR');
    };

    const handleSlideComplete = () => {
        console.log('QR Code Generated'); // Add QR code generation logic if needed
        handleContinue();
    };

    return (
        <Layout>
            <div className={styles.container}>
                <section className={styles.infoSection}>
                    <div className={styles.row}>
                        <span className={styles.label}>Amount:</span>
                        <span className={styles.value}>
                            {loading ? 'Loading...' : error ? error : `${amount} SGD`}
                        </span>
                    </div>
                </section>
                
                <section className={styles.accountInfo}>
                    <span className={styles.fromLabel}>From</span>
                    <h3>FRANK Account</h3>
                    <p>717-473835-009</p>
                </section>

                <footer className={styles.footer}>
                    <p>Please check that all details are correct before proceeding</p>
                    <SlideButton onSlideComplete={handleSlideComplete} />
                </footer>
            </div>
        </Layout>
    );
};

export default PreOrderWithdrawalConfirmation;