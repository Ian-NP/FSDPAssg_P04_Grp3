import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the ATM context
const ATMContext = createContext();

// Create a provider component
export const ATMProvider = ({ children }) => {
  const [cashLevels, setCashLevels] = useState({
    10: 0, // Initial count for $10 notes
    50: 0, // Initial count for $50 notes
  });

  // Set the max capacity for each denomination (e.g., max notes in the ATM)
  const maxCapacity = {
    10: 1000, // Max capacity for $10 notes
    50: 500,  // Max capacity for $50 notes
  };

  // Fetch initial cash levels from the backend when the component mounts
  const fetchCashLevels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/atm/1'); // Updated API endpoint
      if (response.data) {
        setCashLevels({
          10: response.data.remaining_10,
          50: response.data.remaining_50,
        });
      }
    } catch (error) {
      console.error('Error fetching cash levels:', error);
    }
  };

  // Fetch the nearest ATM details
  const fetchNearestATM = async (atmId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/atm/${atmId}/nearestAtm`);
      console.log(response.data);
      return response.data; // Return the nearest ATM data
    } catch (error) {
      console.error('Error fetching nearest ATM:', error);
      throw new Error('Failed to fetch nearest ATM');
    }
  };

  // Function to update the backend with new cash levels after withdrawal
  const updateBackendCashLevels = async (newCashLevels) => {
    try {
      await axios.put('http://localhost:3000/api/atm/1', {
        remaining_10: newCashLevels[10],
        remaining_50: newCashLevels[50],
      });
    } catch (error) {
      console.error('Error updating cash levels:', error);
    }
  };

  // Function to calculate the total cash level
  const getTotalCash = () => {
    return (cashLevels[10] * 10) + (cashLevels[50] * 50);
  };

  // Function to check if the cash level for any note is low (e.g., below a certain threshold)
  const isCashLevelLow = (denomination, threshold = 10) => {
    return cashLevels[denomination] < threshold;
  };

  const withdrawCash = (amount) => {
    let remainingAmount = amount;
    let notesToWithdraw = { 10: 0, 50: 0 };
  
    console.log(`Initial amount to withdraw: $${amount}`);
    console.log(`Current available cash: $10 notes = ${cashLevels[10]}, $50 notes = ${cashLevels[50]}`);
  
    // Try to use $50 notes first
    if (remainingAmount >= 50 && cashLevels[50] > 0) {
      const count50 = Math.min(Math.floor(remainingAmount / 50), cashLevels[50]);
      notesToWithdraw[50] = count50;
      remainingAmount -= count50 * 50;
      console.log(`Withdrawing $50 notes: ${count50} notes, remaining amount to withdraw: $${remainingAmount}`);
    } else {
      console.log('No $50 notes available or the amount is less than $50');
    }
  
    // Then use $10 notes if needed
    if (remainingAmount >= 10 && cashLevels[10] > 0) {
      const count10 = Math.min(Math.floor(remainingAmount / 10), cashLevels[10]);
      notesToWithdraw[10] = count10;
      remainingAmount -= count10 * 10;
      console.log(`Withdrawing $10 notes: ${count10} notes, remaining amount to withdraw: $${remainingAmount}`);
    } else {
      console.log('No $10 notes available or the amount is less than $10');
    }
  
    // If we were able to fully withdraw the amount
    if (remainingAmount === 0) {
      const newCashLevels = {
        10: cashLevels[10] - notesToWithdraw[10],
        50: cashLevels[50] - notesToWithdraw[50],
      };
  
      console.log('Withdrawal successful!');
      console.log(`Updated cash levels: $10 notes = ${newCashLevels[10]}, $50 notes = ${newCashLevels[50]}`);
  
      // Update the state with new cash levels and backend
      setCashLevels(newCashLevels);
      updateBackendCashLevels(newCashLevels); // Update backend after successful withdrawal
      return true; // Indicate success
    } else {
      console.warn('Insufficient cash or unable to fulfill the request with available notes');
      return false; // Indicate failure
    }
  };

  // Function to add cash to the ATM
  const addCash = (denomination, count) => {
    const newCashLevels = {
      ...cashLevels,
      [denomination]: cashLevels[denomination] + count,
    };
    setCashLevels(newCashLevels);
    updateBackendCashLevels(newCashLevels); // Update backend after adding cash
  };

  // Fetch initial cash levels from the backend when the component mounts
  useEffect(() => {
    fetchCashLevels();
  }, []);

  // Provide the state, functions, and max_capacity to children components
  return (
    <ATMContext.Provider value={{ cashLevels, getTotalCash, isCashLevelLow, withdrawCash, addCash, fetchNearestATM, maxCapacity }}>
      {children}
    </ATMContext.Provider>
  );
};

// Custom hook for using the ATM context
export const useATM = () => {
  return useContext(ATMContext);
};
