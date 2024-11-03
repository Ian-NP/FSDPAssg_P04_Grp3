// contexts/AppProvider.jsx
import React from 'react';
import { AccountProvider } from './AccountContext';

const AppProvider = ({ children }) => {
  return (
    <AccountProvider>
      {children}
  </AccountProvider>
  );
};

export default AppProvider;
