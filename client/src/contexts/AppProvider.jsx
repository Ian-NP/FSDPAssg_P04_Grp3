// contexts/AppProvider.jsx
import React from 'react';
import { AccountProvider } from './AccountContext';
import { ATMProvider } from './AtmContext';

const AppProvider = ({ children }) => {
  return (
    <ATMProvider>
      <AccountProvider>
        {children}
      </AccountProvider>
    </ATMProvider>
  );
};

export default AppProvider;
