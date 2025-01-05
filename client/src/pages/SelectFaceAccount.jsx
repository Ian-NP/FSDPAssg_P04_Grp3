import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../contexts/AccountContext';
import styles from '../styles/SelectFaceAccount.module.css';
import Layout from '../components/Layout';

const SelectFaceAccount = () => {
  const navigate = useNavigate();
  const { setAccountDetails } = useAccount();

  // Fetch accounts from local storage
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

  const handleAccountSelection = (account) => {
    setAccountDetails(account); // Save selected account details in context
    navigate(`/mainMenu`); // Navigate to details page
  };

  return (
    <Layout>
        <div className={styles.container}>
        <h1>Select an Account</h1>
        <div className={styles.accountList}>
            {accounts.length === 0 ? (
            <p>No accounts available</p>
            ) : (
            accounts.map((account) => (
                <div
                key={account.account_num}
                className={styles.accountCard}
                onClick={() => handleAccountSelection(account)}
                >
                <p className={styles.accountNumber}>
                    <strong>Account Number:</strong> {account.account_num}
                </p>
                <h2 className={styles.accountName}>{account.account_name}</h2>
                <p className={styles.accountType}>
                    <strong>Type:</strong> {account.account_type}
                </p>
                </div>
            ))
            )}
        </div>
        </div>
    </Layout>
  );
};

export default SelectFaceAccount;
