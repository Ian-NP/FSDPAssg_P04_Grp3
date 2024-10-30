import React from 'react';
import './ATMWithdrawal.css'; // For custom styles
import OCBClogo from './assets/OCBClogo.png';

const ATMWithdrawal = () => {
  return (
    <div className="atm-container">
      <header className="atm-header">
        <img src={OCBClogo} alt="OCBC Logo" className="ocbc-logo" />
        <div className="header-right">
          <span className="language">中文</span>
          <button className="exit-button">Exit</button>
        </div>
      </header>

      <main className="atm-main">
        <h2>Please select your account type</h2>
        <div className="account-buttons">
          <button className="account-button">Accounts with Statements/ Checking Account/ EasiCredit</button>
          <button className="account-button">Passbook Savings</button>
          <button className="account-button">Credit Card Cash Advance</button>
        </div>
      </main>
    </div>
  );
};

export default ATMWithdrawal;
