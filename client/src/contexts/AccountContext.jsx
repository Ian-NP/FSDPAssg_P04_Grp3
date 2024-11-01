// contexts/AccountContext.jsx
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]); // List of accounts
  const [accountDetails, setAccountDetails] = useState({}); // To store details of the validated account
  const [pinError, setPinError] = useState('');

  // Function to validate PIN and fetch account details
  const login = async (accountId, pin) => {
    try {
      const response = await axios.post('http://localhost:3000/api/validate-pin', { accountId, pin }); // Your API endpoint here
      if (response.data.success) {
        setPinError(''); // Clear previous errors
        setAccountDetails(response.data.account); // Store the validated account details
        return response.data.account; // Return account data if PIN is valid
      } else {
        setPinError('Invalid PIN. Please try again.'); // Set error message
        return null; // Indicate failure
      }
    } catch (error) {
      console.error('Error validating PIN:', error);
      setPinError('An error occurred. Please try again later.'); // Handle errors
      return null; // Indicate failure
    }
  };

    // Function to reset account context state
    const LogOutAcc = () => {
      setAccounts([]);
      setAccountDetails(null);
      setPinError('');
    };

  return (
    <AccountContext.Provider value={{ accounts, pinError, login, LogOutAcc, setAccountDetails }}>
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook to use the AccountContext
export const useAccount = () => {
  return useContext(AccountContext);
};
