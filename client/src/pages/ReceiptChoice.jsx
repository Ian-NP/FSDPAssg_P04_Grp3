import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Loading from './Loading'; // Import the Loading component
import commonStyles from '../styles/Common.module.css';
import styles from '../styles/ReceiptChoice.module.css';

const ReceiptChoice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Track loading state

    // Destructure transaction data from location state
    const { transactionType, amount, email } = location.state || { transactionType: '', amount: 0, email: '' };

    console.log('Transaction Type:', transactionType); // Log to check if it's coming through
    console.log('Amount:', amount); // Log to check if it's coming through
    console.log('Email:', email); // Log to check if it's coming through

    const handleButtonClick = async (receiptType) => {
        if (receiptType === 'email') {
            const transactionData = {
                amount, // Use the dynamic amount from the state
                source_account_id: '4111 1111 1111 1111', // Update as necessary
                sendReceipt: 'email',
                transaction_type: transactionType, // Use the transaction type from the state
                email, // Include the email for sending the receipt
            };

            // Set loading to true when the request starts
            setLoading(true);

            try {
                const response = await fetch('http://localhost:3000/api/transactions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(transactionData),
                });

                const data = await response.json();
                setLoading(false); // Set loading to false when the request completes

                if (response.ok) {
                    navigate('/removeCard'); // Navigate to another page on success
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                setLoading(false); // Stop loading on error
                alert('An error occurred while sending the transaction.');
            }
        } else {
            navigate('/removeCard'); // Handle other receipt types or actions here
        }
    };

    if (loading) {
        return <Loading />; // Show loading page while loading is true
    }

    return (
        <div className={commonStyles['atm-container']}>
            <Header onExit={() => alert("Exiting page")} />
            <main className={styles['receipt-choice-main']}>
                <h2 className={styles['title']}>Would you like a receipt for your {transactionType} of ${amount}?</h2>
                <div className={styles['button-group-wrapper']}>
                    <div className={styles['button-group']}>
                        <Button label="No (Hide my balance)" onClick={() => handleButtonClick('hide')} size="large" />
                        <Button label="No (Show my balance)" onClick={() => handleButtonClick('show')} size="large" />
                        <Button label="Yes" onClick={() => handleButtonClick('yes')} size="large" />
                        <Button label="Yes (Email)" onClick={() => handleButtonClick('email')} size="large" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReceiptChoice;
