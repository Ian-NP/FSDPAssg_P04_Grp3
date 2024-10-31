// contexts/AppProvider.jsx
import React from 'react';
import { UserProvider } from './UserContext';
import { AccountProvider } from './AccountContext';

const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <AccountProvider>
        {children}
      </AccountProvider>
    </UserProvider>
  );
};

export default AppProvider;
