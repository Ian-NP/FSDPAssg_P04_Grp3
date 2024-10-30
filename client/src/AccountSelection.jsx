import React from 'react';
import Header from './Header';
import Button from './Button';
import './styles/Common.css';
import './styles/AccountSelection.css';

const AccountSelection = ({ onProceed }) => {
  return (
    <div className="atm-container">
      <Header />
      <main className="atm-main">
        <h2>Please select your account type</h2>
        <div className="account-buttons">
          <Button label="Accounts with Statements/ Checking Account/ EasiCredit" onClick={onProceed} size="large" />
          <Button label="Passbook Savings" size="large" />
          <Button label="Credit Card Cash Advance" size="large" />
        </div>
      </main>
    </div>
  );
};

export default AccountSelection;