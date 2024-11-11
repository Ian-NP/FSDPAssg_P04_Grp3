// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InsertCard from './pages/InsertCard';
import EnterPin from './pages/EnterPin';
import MainMenu from './pages/MainMenu';
import AccountSelection from './pages/AccountSelection';
import Withdrawal from './pages/Withdrawal';
import Loading from "./pages/Loading";
import ReceiptChoice from './pages/ReceiptChoice';
import BalanceEnquiry from "./pages/BalanceEnquiry";
import MonitorSpendingQR from "./pages/MonitorSpendingQR";
import RemoveCard from './pages/RemoveCard';
import CollectCash from './pages/CollectCash';
import TransactionComplete from './pages/TransactionComplete';
import AccountSelectionDeposit from './pages/AccountSelectionDeposit';
import DepositRules from './pages/DepositRules';
import DepositCash from './pages/DepositCash';
import TransactionSummary from './pages/TransactionSummary';
import FreezeAccount from './pages/FreezeAccount';
import Exit from "./pages/Exit";
import PreOrderWithdrawal from "./pages/PreOrderWithdrawal";
import './styles/App.css';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<InsertCard />} />
        <Route path="/enter-pin" element={<EnterPin />} />
        <Route path="/mainMenu" element={<MainMenu />} />
        <Route path="/balanceEnquiry" element={<BalanceEnquiry />} />
        <Route path="/monitorSpendingQR" element={<MonitorSpendingQR />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/exit" element={<Exit />} />
        <Route path="/accountSelection" element={<AccountSelection />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/receiptChoice" element={<ReceiptChoice />} />
        <Route path="/removeCard" element={<RemoveCard />} />
        <Route path="/collectCash" element={<CollectCash />} /> 
        <Route path="/transactionComplete" element={<TransactionComplete />} /> 
        <Route path="/accountSelectionDeposit" element={<AccountSelectionDeposit />} />
        <Route path="/depositRules" element={<DepositRules />} /> 
        <Route path="/depositCash" element={<DepositCash />} /> 
        <Route path="/transactionSummary" element={<TransactionSummary />} /> 
        <Route path="/preOrderWithdrawal" element={<PreOrderWithdrawal />} />
        <Route path="/freeze-account/:accountNum" element={<FreezeAccount />} />
      </Routes>
    </>
  );
};

export default App;
