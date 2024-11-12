import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router's navigate function
import { ref, onValue, off } from 'firebase/database'; // Firebase Realtime Database imports
import { database } from '../firebase/firebase';  // Corrected import path


// This component monitors the account status globally across all pages
const GlobalStatusMonitor = ({ accountNum }) => {
  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    // Firebase reference to listen for changes in the account's status
    const accountRef = ref(database, `account/${accountNum}/account_status`);

    const handleStatusChange = (snapshot) => {
      const status = snapshot.val();
      console.log('Account status retrieved:', status); // Debug log

      // Only redirect if the account is frozen
      if (status === 'frozen') {
        console.log('Account is frozen, redirecting to login...');
        navigate('/enter-pin'); // Redirect to the login page if account is frozen
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
