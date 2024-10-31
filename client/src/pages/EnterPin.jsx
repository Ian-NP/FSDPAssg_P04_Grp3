import React, { useState } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const EnterPin = ({ accountId }) => {
    const { login, pinError } = useAccount();
    const { fetchAndSetUserData, error } = useUser(); // Get fetch function and error state
    const [pin, setPin] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Local loading state

    const navigate = useNavigate(); // Initialize useNavigate
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true); // Set loading to true at the beginning

      const accountData = await login(accountId, pin);
  
      if (accountData) {
        const isUserDataFetched = await fetchAndSetUserData(accountData.userId);
        if (isUserDataFetched) {
          console.log('User data fetched successfully, navigating to the next screen.');
          navigate('/main-menu'); // Navigate to the next screen
        } else {
          // Handle error in fetching user data
          console.error('Failed to fetch & set user data');
          alert('Error fetching user data. Please try again.'); // Display user feedback
        }
      } else {
        console.error('Invalid PIN entered');
        // alert('Invalid PIN. Please try again.'); // Display alert for invalid PIN
      }

      setPin(''); // Clear the PIN
  
      if (error) {
        alert(`Error: ${error}`); // Display error message from loading state
      }

      setIsLoading(false); // Set loading to false at the end
    };
  
    return (
      <>
        <Layout>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
              required
            />
            <button type="submit">Submit</button>
          </form>
          {pinError && <p>{pinError}</p>} {/* Display PIN error if any */}
          {error && <p>{error}</p>} {/* Display loading error if any */}
          {isLoading && <p>Loading...</p>} {/* Show loading message */}
        </Layout>
      </>
    );
  };

export default EnterPin; // Ensure you have this line