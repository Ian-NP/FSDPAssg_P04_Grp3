import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ref, onValue, off } from 'firebase/database'; // Firebase imports
import { database } from "../firebase/firebase";


const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [accountDetails, setAccountDetails] = useState(() => {
    // Check sessionStorage for existing account details on initial load
    const savedAccount = sessionStorage.getItem('accountDetails');
    return savedAccount ? JSON.parse(savedAccount) : {};
  });
  const [pinError, setPinError] = useState('');
  const [accountStatus, setAccountStatus] = useState(null); // Track the account status
  const [attemptsLeft, setAttemptsLeft] = useState(3); // Track remaining attempts

  // Function to validate PIN and fetch account details
  const login = async (accountId, pin) => {
    console.log('Input accountId:', accountId, 'Input pin:', pin);

    try {
        const response = await axios.post('http://localhost:3000/api/Accounts/login', { account_num: accountId, password: pin });
        console.log('Full response:', response);

        if (response.data.success) {
            console.log('Account data:', response.data.account);
            setAccountDetails(response.data.account);
            sessionStorage.setItem('accountDetails', JSON.stringify(response.data.account));
            setAttemptsLeft(4); // Reset attempts on successful login
            return true;
        } else {
            // Handle specific error messages based on API response
            if (response.data.error === 'ACCOUNT_LOCKED') {
                setPinError('Your account is locked. Please contact support.');
            } else if (response.data.error === 'ACCOUNT_FROZEN') { // Check for frozen account specifically
                setPinError('Your account is frozen. Please contact support.');
            } else if (response.data.error === 'INVALID_PIN') {
                setAttemptsLeft((prev) => prev - 1); // Decrease attempts left on wrong PIN
                if (attemptsLeft <= 1) {
                    setPinError('Account locked due to multiple incorrect attempts.');
                } else {
                    setPinError(`Invalid PIN. You have ${attemptsLeft - 1} attempts left.`);
                }
            } else {
                setPinError(response.data.error || 'An error occurred. Please try again later.');
            }
            return false;
        }
    } catch (error) {
        console.error('Error validating PIN:', error);
        
        // Specifically handle the 401 Unauthorized for invalid PIN
        if (error.response && error.response.status === 401) {
            setPinError('Invalid PIN. Please try again.');
        } else if (error.response && error.response.status === 403) {
            // Handle frozen account
            setPinError('Your account is frozen. Please contact support.');
        } else {
            // For any other server/network errors
            setPinError('An error occurred while connecting to the server. Please try again later.');
        }
        return false;
    }
};

  // Function to monitor account status (i.e. if it is frozen)
  useEffect(() => {
    if (accountDetails && accountDetails.account_num) {
      const accountRef = ref(database, `/account/${accountDetails.account_num}/account_status`);

      const handleStatusChange = (snapshot) => {
        const status = snapshot.val();
        console.log('Account status retrieved:', status);
        setAccountStatus(status);
        
        if (status === 'frozen') {
          console.log('Account is frozen, redirecting to login...');
          // Redirect to login page when account is frozen
          window.location.href = '/enter-pin'; // Or use navigate('/enter-pin') if using react-router
        }
      };

      // Start listening for changes in the account status
      onValue(accountRef, handleStatusChange);

      // Cleanup listener when component is unmounted or account_num changes
      return () => off(accountRef, 'value', handleStatusChange);
    }
  }, [accountDetails]);

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
    setAttemptsLeft(3); // Reset attempts when logging out
    sessionStorage.removeItem('accountDetails');
  };


  return (
    <AccountContext.Provider value={{
      pinError,
      login,
      LogOutAcc,
      accountDetails,
      setAccountDetails,
      withdrawFromAccount,
      depositAccount,
    }}>
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook to use the AccountContext
export const useAccount = () => {
  return useContext(AccountContext);
};
