import React, { useState, useEffect } from 'react';
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
    const [isMobile, setIsMobile] = useState(false);

    const onProceed = () => {
        navigate('/PreOrderWithdrawalScreen');
    };

    // Function to check if the viewport width is mobile-sized (up to 430px)
    const checkMobileView = () => {
        const isMobileView = window.matchMedia('(max-width: 430px)').matches;
        setIsMobile(isMobileView);
        console.log(`Viewport check: ${isMobileView ? 'Mobile view' : 'Desktop view'}`);
    };

    useEffect(() => {
        checkMobileView(); // Initial check on load
        window.addEventListener('resize', checkMobileView); // Listen for resizing

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    // Only render the component if on a mobile-sized screen
    if (!isMobile) return null;
    
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
                    PayNow</button>
                    <button className={styles.actionButton}>
                    <img src={ScanPayGraphic} alt="ScanPay Icon" className={styles.icon} />
                    Scan & Pay</button>
                    <button className={styles.actionButton} onClick={onProceed}>
                    <img src={PreOrderWithdrawalGraphic} alt="PreOrderWithdrawal Icon" className={styles.icon} />
                    Pre-Order Withdrawal</button>
                </section>

                {/* Account Information */}
                <section className={styles.accountSection}>
                    <div className={styles.accountCard}>
                        <div className={styles.accountHeader}>
                            <span className={styles.accountType}>FRA</span>
                            <div className={styles.accountDetails}>
                                <h3>FRANK Account</h3>
                                <p>717-473835-009</p>
                            </div>
                        </div>
                        <div className={styles.balance}>
                            <span>Available balance</span>
                            <span className={styles.balanceAmount}>150.82 SGD</span>
                        </div>
                        <div className={styles.cardInfo}>
                            <span>Debit card no.</span>
                            <span>4142 8573 5838 9583</span>
                        </div>
                    </div>
                </section>

                {/* Recent Transactions */}
                <section className={styles.recentTransactions}>
                    <h4>Most recent transactions</h4>
                    {/* Transactions list can go here */}
                </section>

                {/* Bottom Navigation */}
                <nav className={styles.bottomNav}>
                    <button className={styles.navButton}>
                    <img src={HomeGraphic} alt="Home Icon" className={styles.icon} />
                    Home</button>
                    <button className={styles.navButton}>
                    <img src={PlanGraphic} alt="Plan Icon" className={styles.icon} />
                    Plan</button>
                    <button className={styles.navButton}>
                    <img src={PayTransferGraphic} alt="PayTransfer Icon" className={styles.icon} />
                    Pay & Transfer</button>
                    <button className={styles.navButton}>
                    <img src={RewardGraphic} alt="Reward Icon" className={styles.icon} />
                    Rewards</button>
                    <button className={styles.navButton}>
                    <img src={MoreGraphic} alt="More Icon" className={styles.icon} />
                    More</button>
                </nav>
            </div>
        </Layout>
    );
};

export default PreOrderWithdrawal;
