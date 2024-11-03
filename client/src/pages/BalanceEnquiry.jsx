import React, { useEffect, useState } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from './Loading';
import styles from '../styles/BalanceEnquiry.module.css';
import HomeIcon from "../assets/HomeIcon.svg";

const BalanceEnquiry = () => {
    const { accountDetails, setAccountDetails } = useAccount(); // Get account details from context
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // State to hold account balance
    const [accountBalance, setAccountBalance] = useState('N/A');

    useEffect(() => {
        // Simulate fetching account details
        setTimeout(() => {
            setAccountBalance(accountDetails.balance); // Set balance from mock account details
            setIsLoading(false); // Set loading to false after "fetching"
        }, 1000); // Simulate a delay of 1 second
    }, [setAccountDetails]);

    if (isLoading) {
        return <Loading />; // Show loading spinner while fetching data
    }

    return (
        <Layout>
            <div className={styles.accBalanceContainer}>
                <div className={styles.informationContainer}>
                    <h2>Your Account Balance</h2>
                    <div className={styles.balanceDisplay}>
                        <p className={styles.balanceAmount}>${accountBalance}</p>
                        <p className={styles.balanceNote}>Available funds in your account.</p>
                    </div>
                </div>
                <div className={styles.navigationBtns}>
                    <button onClick={() => navigate('/mainMenu')} className={styles.navButton}>
                        <img src={HomeIcon} width={30} alt="Home Icon" />
                        <p>Main Menu</p>
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default BalanceEnquiry;
