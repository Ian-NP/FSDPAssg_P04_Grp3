import React, { useState, useEffect } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ accountId, userId }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Layout>
            <div className={styles.mainMenuContainer}>
                <div className={styles.mainMenuHeader}>
                    <p>Hello! 👋</p>
                    <p>What would you like to do today?</p>
                </div>
            </div>
        </Layout>
    );
};

export default MainMenu;