import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import Loading from './Loading';
import commonStyles from '../styles/Common.module.css';
import styles from '../styles/TransactionSummary.module.css';

const TransactionSummary = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleConfirm = () => {
        navigate('/transactionComplete');
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
