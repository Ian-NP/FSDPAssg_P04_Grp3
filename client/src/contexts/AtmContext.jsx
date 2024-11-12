import React, { createContext, useState, useContext } from 'react';

// Create the ATM context
const ATMContext = createContext();

// Create a provider component
export const ATMProvider = ({ children }) => {
    // State to track the count of $10 and $50 notes
    const [cashLevels, setCashLevels] = useState({
        10: 100, // Initial count for $10 notes
        50: 50,  // Initial count for $50 notes
    });

    // Function to calculate the total cash level
    const getTotalCash = () => {
        return (cashLevels[10] * 10) + (cashLevels[50] * 50);
    };

    // Function to check if the cash level for any note is low (e.g., below a certain threshold)
    const isCashLevelLow = (denomination, threshold = 10) => {
        return cashLevels[denomination] < threshold;
    };

    // Function to withdraw cash and update the cash levels
    const withdrawCash = (amount) => {
        // Check if the withdrawal amount can be satisfied with the available notes
        let remainingAmount = amount;
        let notesToWithdraw = { 10: 0, 50: 0 };

        // Try to use $50 notes first
        if (remainingAmount >= 50 && cashLevels[50] > 0) {
            const count50 = Math.min(Math.floor(remainingAmount / 50), cashLevels[50]);
            notesToWithdraw[50] = count50;
            remainingAmount -= count50 * 50;
        }

        // Then use $10 notes if needed
        if (remainingAmount >= 10 && cashLevels[10] > 0) {
            const count10 = Math.min(Math.floor(remainingAmount / 10), cashLevels[10]);
            notesToWithdraw[10] = count10;
            remainingAmount -= count10 * 10;
        }

        // If we were able to fully withdraw the amount
        if (remainingAmount === 0) {
            setCashLevels(prevCashLevels => ({
                10: prevCashLevels[10] - notesToWithdraw[10],
                50: prevCashLevels[50] - notesToWithdraw[50],
            }));
            return true; // Indicate success
        } else {
            console.warn('Insufficient cash or unable to fulfill the request with available notes');
            return false; // Indicate failure
        }
    };

    // Function to add cash to the ATM
    const addCash = (denomination, count) => {
        setCashLevels(prevCashLevels => ({
            ...prevCashLevels,
            [denomination]: prevCashLevels[denomination] + count,
        }));
    };

    // Provide the state and functions to children components
    return (
        <ATMContext.Provider value={{ cashLevels, getTotalCash, isCashLevelLow, withdrawCash, addCash }}>
            {children}
        </ATMContext.Provider>
    );
};

// Custom hook for using the ATM context
export const useATM = () => {
    return useContext(ATMContext);
};
