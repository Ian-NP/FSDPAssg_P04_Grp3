import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Loading from './Loading';
import commonStyles from '../styles/Common.module.css';
import styles from '../styles/TransactionSummary.module.css';
import { useAccount } from '../contexts/AccountContext';
import axios from 'axios';

const TransactionSummary = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { accountDetails, depositAccount } = useAccount();

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    const handleCancel = () => {
        navigate('/exit');
    };

    const handleConfirm = async () => {
        const amount = 187; // Hardcoded amount for now, will be dynamic in the future
        console.log("Confirm button clicked with amount:", amount);
        
        // Check if the amount is valid (e.g., greater than 0)
        if (amount <= 0) {
            alert("Please enter a valid amount greater than $0.");
            return;
        } 
    
        // Proceed to deposit the amount
        try {
            const success = await depositAccount(amount); // Ensure depositAccount returns a boolean
            if (success) {
                console.log("Deposit successful");
                
                // Prepare transaction data for logging
                const transactionData = {
                    amount: parseInt(amount), // Convert amount to an integer
                    description: "",
                    destination_account: accountDetails.account_num,
                    source_account_id: accountDetails.account_num,
                    status: "Completed",
                    transaction_date: Date.now(), // Use current datetime as epoch
                    transaction_type: "deposit" // Change this based on your logic
                };
    
                // Make POST request to log the transaction
                try {
                    const response = await axios.post('http://localhost:3000/api/transactions', transactionData);
                    if (response.data.success) {
                        console.log("Transaction created successfully:", response.data);
                        // Navigate to ReceiptChoice and pass transaction data
                        navigate('/receiptChoice', { state: { transactionType: "deposit", amount } }); 
                    } else {
                        alert("An error occurred while recording the transaction. Please try again.");
                    }
                } catch (error) {
                    console.error("Error creating transaction:", error);
                    alert("An error occurred while recording the transaction. Please try again.");
                }
            } else {
                alert("An error occurred during the deposit. Please try again.");
            }
        } catch (error) {
            console.error("Error during deposit:", error);
            alert("An error occurred during the deposit. Please try again.");
        }
    };
    


    return (
        <div className={commonStyles['atm-container']}>
            <Header />
            <main className={styles['transaction-summary-main']}>
                <h2 className={styles['title']}>Please confirm your deposit</h2>
                <div className={styles['summary-container']}>
                    <div className={styles['account-info']}>
                        <p>Deposit to:</p>
                        <p>Account Number: <strong>xxxxxxxxxxxxxxxx</strong></p>
                        <p>Account Name: <strong>xxxxxxxxxxxxxxxx</strong></p>
                    </div>
                    <table className={styles['summary-table']}>
                        <tbody>
                            <tr>
                                <td>0 pc(s) of $1000</td>
                                <td>$0</td>
                            </tr>
                            <tr>
                                <td>1 pc(s) of $100</td>
                                <td>$100</td>
                            </tr>
                            <tr>
                                <td>1 pc(s) of $50</td>
                                <td>$50</td>
                            </tr>
                            <tr>
                                <td>3 pc(s) of $10</td>
                                <td>$30</td>
                            </tr>
                            <tr>
                                <td>1 pc(s) of $5</td>
                                <td>$5</td>
                            </tr>
                            <tr>
                                <td>1 pc(s) of $2</td>
                                <td>$2</td>
                            </tr>
                            <tr className={styles['total-row']}>
                                <td>Total</td>
                                <td>$187</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles['button-group']}>
                    <Button label="Cancel" onClick={handleCancel} size="medium" />
                    <Button label="Confirm" onClick={handleConfirm} size="medium" />
                </div>
            </main>
        </div>
    );
};

export default TransactionSummary;
