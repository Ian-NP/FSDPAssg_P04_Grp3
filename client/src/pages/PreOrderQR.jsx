import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; 
import styles from '../styles/PreOrderQR.module.css';  
import Layout from '../components/Layout';

const PreOrderQR = () => {
    const { state } = useLocation();
    const { amount, accountDetails } = state || {};
    const navigate = useNavigate();

    const [qrData, setQrData] = useState('');

    useEffect(() => {
        console.log("State received:", state);

        if (!state) {
            console.error("No state data found. Redirecting to previous page.");
            navigate(-1); 
            return;
        }

        if (amount && accountDetails) {
            console.log("Amount:", amount);
            console.log(accountDetails);


            // Ensure data matches expected structure in QRCodeScanner
            const data = JSON.stringify({
                amount,
                accountDetails
            });

            console.log("Generated Data for QR Code:", data);
            setQrData(data);
        } else {
            console.warn("Amount or account details are missing.");
        }
    }, [amount, accountDetails, state, navigate]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <p>Scan the QR code at the ATM</p>
                    {qrData ? (
                        <QRCodeSVG value={qrData} size={256} />
                    ) : (
                        <p>Loading QR Code...</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default PreOrderQR;