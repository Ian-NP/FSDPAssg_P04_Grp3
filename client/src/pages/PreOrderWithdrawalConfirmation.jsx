import React, { useState, useEffect } from 'react';
import styles from '../styles/PreOrderWithdrawalConfirmation.module.css';
import Layout from '../components/Layout';
import SlideButton from '../components/SlideButton';
import { useNavigate } from 'react-router-dom';

const PreOrderWithdrawalConfirmation = () => {
    const [amount, setAmount] = useState(null); // State for fetched amount
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/'); // Change this if you want to navigate to a specific screen
    };

    const handleContinue = () => {
        navigate('/PreOrderQR');
    };

    const handleSlideComplete = () => {
        console.log('QR Code Generated'); // You can add your QR code generation logic here
        handleContinue();
    };

    useEffect(() => {
        fetch('http://localhost:3000/get-withdrawal')
            .then((response) => response.json())
            .then((data) => setAmount(data.amount))
            .catch((error) => {
                console.error('Error fetching amount:', error);
            });
    }, []);

    return (
        <Layout>
            <div className={styles.container}>
                <section className={styles.infoSection}>
                    <div className={styles.row}>
                        <span className={styles.label}>Amount:</span>
                        <span className={styles.value}>
                            {amount !== null ? `${amount} SGD` : 'Loading...'}
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