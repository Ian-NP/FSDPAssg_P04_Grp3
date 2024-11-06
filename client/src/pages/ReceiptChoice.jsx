import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import commonStyles from '../styles/Common.module.css';
import styles from '../styles/ReceiptChoice.module.css';

const ReceiptChoice = () => {
  const navigate = useNavigate();

  const handleButtonClick = async (receiptType) => {
    if (receiptType === 'email') {
      const transactionData = {
        amount: 10, // Replace with the actual transaction amount
        source_account_id: '4111 1111 1111 1111', // Replace with actual account number
        sendReceipt: 'email', // Indicate that we want to send the receipt via email
      };

      console.log("Sending transaction data:", transactionData); // Debugging log

      try {
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(transactionData),
        });

        const data = await response.json();
        console.log("Response from server:", data); // Debugging log

        if (data.success) {
          alert('Receipt sent to your email!');
          navigate('/nextPage'); // Adjust the navigation as necessary
        } else {
          alert(`Failed to send receipt: ${data.message}`);
        }
      } catch (error) {
        console.error('Error sending receipt:', error);
        alert('An error occurred while sending the receipt.');
      }
    } else {
      navigate('/removeCard'); // Adjust navigation for other options
    }
  };

  return (
    <div className={commonStyles['atm-container']}>
      <Header onExit={() => alert("Exiting page")} />
      <main className={styles['receipt-choice-main']}>
        <h2 className={styles['title']}>Would you like a receipt?</h2>
        <div className={styles['button-group-wrapper']}>
          <div className={styles['button-group']}>
            <Button label="No (Hide my balance)" onClick={() => handleButtonClick('hide')} size="large" />
            <Button label="No (Show my balance)" onClick={() => handleButtonClick('show')} size="large" />
            <Button label="Yes" onClick={() => handleButtonClick('yes')} size="large" />
            <Button label="Yes (Email)" onClick={() => handleButtonClick('email')} size="large" />
            <Button label="Yes (SMS)" onClick={() => handleButtonClick('sms')} size="large" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReceiptChoice;
