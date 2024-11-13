import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router's navigate function
import { ref, onValue, off, query, orderByChild, equalTo } from 'firebase/database'; // Firebase imports
import { database } from '../firebase/firebase';  // Corrected import path

// This component monitors the account status globally across all pages
const GlobalStatusMonitor = ({ accountNum }) => {
  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    console.log(`AccountNum passed to GlobalStatusMonitor: ${accountNum}`); // Log the account number

    // Firebase reference to listen for changes in the account's status
    const accountRef = query(
      ref(database, 'account'),  // Start at the 'account' node
      orderByChild('account_num'),  // Order by 'account_num' field
      equalTo(accountNum)  // Look for the account_num that matches the given one
    );

    console.log(`Firebase reference path: /account?account_num=${accountNum}`);

    const handleStatusChange = (snapshot) => {
      // Log the snapshot value to check if data is being retrieved correctly
      console.log('Snapshot:', snapshot.val()); // Log the whole snapshot to debug

      if (snapshot.exists()) {
        // If the account exists, check the status
        const accountData = snapshot.val();
        // Firebase returns an object where the keys are generated
        const accountStatus = accountData[Object.keys(accountData)[0]].account_status;
        console.log('Account status retrieved:', accountStatus); // Debug log

        // Only redirect if the account is frozen
        if (accountStatus === 'frozen') {
          console.log('Account is frozen, clearing session storage and redirecting...');
          sessionStorage.removeItem('accountDetails');  // Clear session storage
          navigate('/enter-pin');  // Redirect to login page
        }
      } else {
        console.log('Account not found');
      }
    };

    onValue(accountRef, handleStatusChange); // Listen for changes in account status

    // Cleanup the listener when the component is unmounted or accountNum changes
    return () => {
      off(accountRef, 'value', handleStatusChange);
    };
  }, [accountNum, navigate]); // Re-run effect if accountNum or navigate changes

  return null; // This component doesn't render anything
};

export default GlobalStatusMonitor;
