import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accountDetails, setAccountDetails] = useState(() => {
    // Check sessionStorage for existing account details on initial load
    const savedAccount = sessionStorage.getItem('accountDetails');
    return savedAccount ? JSON.parse(savedAccount) : {};
  });
  const [pinError, setPinError] = useState('');

  // Function to validate PIN and fetch account details
  const login = async (accountId, pin) => {
    console.log('Input accountId:', accountId, 'Input pin:', pin);
  
    try {
      const response = await axios.post('http://localhost:3000/api/Accounts/login', { account_num: accountId, password: pin });
      console.log('Full response:', response);
      if (response.data.success) {
        console.log('Account data:', response.data.account);
        setAccountDetails(response.data.account);
        // Store in sessionStorage
        sessionStorage.setItem('accountDetails', JSON.stringify(response.data.account));
        return true;
      } else {
        setPinError('Invalid PIN. Please try again.');
      }
    } catch (error) {
      console.error('Error validating PIN:', error);
      setPinError('An error occurred. Please try again later.');
      return false;
    }
  };

  const withdrawFromAccount = async (amount) => {
    console.log('Input account number:', accountDetails.account_num, 'Input amount:', amount);
    accountDetails.balance -= amount;
  
    try {
      const response = await axios.put(`http://localhost:3000/api/Accounts/updateBalance/${accountDetails.account_num}`, { newBalance: accountDetails.balance });
      console.log('Full response:', response);
      if (response.data.success) {
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
        return true;
      } else {
        console.error('Error updating balance:', response);
        accountDetails.balance += amount; // Revert balance on error
        setPinError('An error occurred. Please try again later.');
        return false;
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      accountDetails.balance += amount; // Revert balance on error
      setPinError('An error occurred. Please try again later.');
      return false;
    }
  };

  const depositAccount = async (amount) => {
    console.log('Input account number:', accountDetails.account_num, 'Input amount:', amount);
    accountDetails.balance += amount; // Update balance for deposit
  
    try {
      const response = await axios.put(`http://localhost:3000/api/Accounts/updateBalance/${accountDetails.account_num}`, { newBalance: accountDetails.balance });
      console.log('Full response:', response);
      if (response.data.success) {
        sessionStorage.setItem('accountDetails', JSON.stringify(accountDetails));
        return true;
      } else {
        console.error('Error updating balance:', response);
        accountDetails.balance -= amount; // Revert balance on error
        setPinError('An error occurred. Please try again later.');
        return false;
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      accountDetails.balance -= amount; // Revert balance on error
      setPinError('An error occurred. Please try again later.');
      return false;
    }
  };

  useEffect(() => {
    console.log('Updated accountDetails:', accountDetails);
  }, [accountDetails]);

  // Function to reset account context state
  const LogOutAcc = () => {
    setAccountDetails(null);
    setPinError('');
    // Clear sessionStorage
    sessionStorage.removeItem('accountDetails');
  };

  return (
    <AccountContext.Provider value={{ pinError, login, LogOutAcc, accountDetails, setAccountDetails, withdrawFromAccount, depositAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook to use the AccountContext
export const useAccount = () => {
  return useContext(AccountContext);
};
