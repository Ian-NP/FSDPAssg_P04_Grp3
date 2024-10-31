// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InsertCard from './pages/InsertCard';
import EnterPin from './pages/EnterPin';
import AccountSelection from './pages/AccountSelection';
import Withdrawal from './pages/Withdrawal';
import './styles/App.css';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<InsertCard />} />
        <Route path="/enter-pin" element={<EnterPin />} />
        <Route path="/accountSelection" element={<AccountSelection />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
      </Routes>
    </>
  );
};

export default App;
