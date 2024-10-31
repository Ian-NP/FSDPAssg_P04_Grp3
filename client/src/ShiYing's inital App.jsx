import React, { useState } from 'react';
import AccountSelection from './AccountSelection';
import Withdrawal from './pages/Withdrawal';
import './styles/App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('accountSelection');

  const handlePageChange = () => {
    setCurrentPage('withdrawal');
  };

  return (
    <div className="app-container">
      {currentPage === 'accountSelection' ? (
        <AccountSelection onProceed={handlePageChange} />
      ) : (
        <Withdrawal />
      )}
    </div>
  );
};

export default App;
