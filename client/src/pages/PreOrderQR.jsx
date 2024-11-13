import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';  // Import QR code generator
import styles from '../styles/PreOrderQR.module.css';  // Create styles for this page

const PreOrderQR = () => {
    const { state } = useLocation();  // Retrieve the data passed from the previous page
    const { amount, accountDetails } = state || {};
    
    const [qrData, setQrData] = useState('');

    // Combine the withdrawal details and account info into a single string for the QR code
    useEffect(() => {
        if (amount && accountDetails) {
            const data = {
                amount: amount,
                accountName: accountDetails.accountName,
                accountNum: accountDetails.accountNum,
            };
            setQrData(JSON.stringify(data));  // Set the data as JSON string
        }
    }, [amount, accountDetails]);

    return (
        <div className={styles.container}>
            <h2>Withdrawal QR Code</h2>
            <p>Scan this QR code to confirm your withdrawal.</p>

            {qrData ? (
                <div className={styles.qrContainer}>
                    <QRCode value={qrData} size={256} />
                    <p>Withdrawal Amount: {amount} SGD</p>
                    <p>Account Name: {accountDetails?.accountName}</p>
                    <p>Account Number: {accountDetails?.accountNum}</p>
                </div>
            ) : (
                <p>Loading QR code...</p>
            )}
        </div>
    );
};

export default PreOrderQR;