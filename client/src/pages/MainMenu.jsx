import React, { useState, useEffect } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import styles from '../styles/MainMenu.module.css';
import MainMenuOption from '../components/MainMenuOption';
import WithdrawGraphic from "../assets/withdraw.svg";
import DepositGraphic from "../assets/deposit.svg";
import MoneyTransferGraphic from "../assets/moneyTransfer.svg";
import PayBillsGraphic from "../assets/payBills.svg";
import BalanceEnquiryGraphic from "../assets/balanceEnquiry.svg";
import PrintStatement from "../assets/printStatement.svg";

const MainMenu = ({ accountId, userId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { user, setUser } = useUser();
    useEffect(() => {
        setUser({ name: 'Ian' }); // Example update
      }, []); // Dependency array includes only necessary dependencies

    

    return (
        <Layout>
            <div className={styles.mainMenuContainer}>
                <div className={styles.mainMenuHeader}>
                    <p>Hello {user.name}! 👋</p>
                    <p>What would you like to do today?</p>
                </div>
                <div className={styles.mainMenuOptionsContainer}>
                    <MainMenuOption title="Withdraw" img={WithdrawGraphic} link="/AccountSelection" />
                    <MainMenuOption title="Money Transfer" img={MoneyTransferGraphic} />
                    <MainMenuOption title="Deposit" img={DepositGraphic} />
                    <MainMenuOption title="Monitor Spending" img={BalanceEnquiryGraphic} link="/monitorSpendingQR" />
                    <MainMenuOption title="Balance Enquiry" img={PayBillsGraphic} link="/balanceEnquiry" />
                    <MainMenuOption title="Print Statement" img={PrintStatement} />
                </div>
            </div>
        </Layout>
    );
};

export default MainMenu;