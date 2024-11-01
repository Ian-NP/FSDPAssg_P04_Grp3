import React, { useEffect, useState } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from './Loading';
import styles from '../styles/MonitorSpendingQR.module.css';
import QRCode from "../assets/QRCode.svg";
import HomeIcon from "../assets/HomeIcon.svg";

const MonitorSpendingQR = () => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching account details
        setTimeout(() => {
            setIsLoading(false); // Set loading to false after "fetching"
        }, 1000); // Simulate a delay of 1 second
    }, []);

    if (isLoading) {
        return <Loading />; // Show loading spinner while fetching data
    }

    return (
        <Layout>
            <div className={styles.monitorSpendingQRContainer}>
                <div className={styles.informationContainer}>
                    <img src={QRCode} alt="QR Code" />
                    <h2>Please scan the QR code to see an in-depth analysis on your spendings</h2>
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

export default MonitorSpendingQR;