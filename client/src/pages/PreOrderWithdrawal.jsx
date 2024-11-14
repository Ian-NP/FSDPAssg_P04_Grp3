import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/PreOrderWithdrawal.module.css';
import Layout from '../components/Layout';

import PayNowGraphic from '../assets/PayNow.svg';
import ScanPayGraphic from '../assets/ScanPay.svg';
import PreOrderWithdrawalGraphic from '../assets/PreOrderWithdrawal.svg';

import HomeGraphic from '../assets/Home.svg';
import PlanGraphic from '../assets/Plan.svg';
import PayTransferGraphic from '../assets/PayTransfer.svg';
import RewardGraphic from '../assets/Reward.svg';
import MoreGraphic from '../assets/More.svg';

import { useNavigate } from 'react-router-dom';

const PreOrderWithdrawal = () => {
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [accountBalance, setAccountBalance] = useState(null);
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const accountNum = '4111 1111 1111 1111'; // Example account number
    const password = '112233'

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.post("http://192.168.1.9:3000/api/accounts/login", {
                    account_num: accountNum,
                    password: password,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                // Handle successful login response
                if (response.data.success) {
                    const account = response.data.account;
                    console.log(account)
                    setAccountBalance(account.balance);
                    setAccountName(account.account_name);
                    setAccountType(account.account_type);
                }
            } catch (error) {
                setError("Error logging in");
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [accountNum]);

    const onProceed = () => {
        navigate('/PreOrderWithdrawalScreen', { state: { accountBalance, accountName, accountNum } });
    };

    return (
        <Layout>
            <div className={styles.container}>
                {/* Welcome Message */}
                <section className={styles.welcomeSection}>
                    <h2>Welcome</h2>
                    <p>We are here to meet your banking needs - for now, and beyond</p>
                </section>

                {/* Action Buttons */}
                <section className={styles.actionButtons}>
                    <button className={styles.actionButton}>
                        <img src={PayNowGraphic} alt="PayNow Icon" className={styles.icon} />
                        PayNow
                    </button>
                    <button className={styles.actionButton}>
                        <img src={ScanPayGraphic} alt="ScanPay Icon" className={styles.icon} />
                        Scan & Pay
                    </button>
                    <button className={styles.actionButton} onClick={onProceed}>
                        <img src={PreOrderWithdrawalGraphic} alt="PreOrderWithdrawal Icon" className={styles.icon} />
                        Pre-Order Withdrawal
                    </button>
                </section>

                {/* Account Information */}
                <section className={styles.accountSection}>
                    <div className={styles.accountCard}>
                        <div className={styles.accountHeader}>
                            <div className={styles.accountDetails}>
                                <h3>{accountName}</h3>
                            </div>
                        </div>
                        <div className={styles.balance}>
                            <span>Available balance</span>
                            <span className={styles.balanceAmount}>
                                {loading ? 'Loading...' : `${accountBalance} SGD`}
                            </span>
                        </div>
                        <div className={styles.cardInfo}>
                            <span>Debit card no.</span>
                            <div className={styles.accountDetails}>
                                <p>{accountNum}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Transactions */}
                <section className={styles.recentTransactions}>
                    <h4>Most recent transactions</h4>
                    {/* You can populate transactions here */}
                </section>

                {/* Bottom Navigation */}
                <nav className={styles.bottomNav}>
                    <button className={styles.navButton}>
                        <img src={HomeGraphic} alt="Home Icon" className={styles.icon} />
                        Home
                    </button>
                    <button className={styles.navButton}>
                        <img src={PlanGraphic} alt="Plan Icon" className={styles.icon} />
                        Plan
                    </button>
                    <button className={styles.navButton}>
                        <img src={PayTransferGraphic} alt="PayTransfer Icon" className={styles.icon} />
                        Pay & Transfer
                    </button>
                    <button className={styles.navButton}>
                        <img src={RewardGraphic} alt="Reward Icon" className={styles.icon} />
                        Rewards
                    </button>
                    <button className={styles.navButton}>
                        <img src={MoreGraphic} alt="More Icon" className={styles.icon} />
                        More
                    </button>
                </nav>
            </div>
        </Layout>
    );
};

export default PreOrderWithdrawal;