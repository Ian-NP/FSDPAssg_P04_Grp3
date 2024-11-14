// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AccountProvider } from './contexts/AccountContext'; // Import AccountProvider
import InsertCard from './pages/InsertCard';
import EnterPin from './pages/EnterPin';
import GlobalStatusMonitor from './components/GlobalStatusMonitor'; // Import the GlobalStatusMonitor
import MainMenu from './pages/MainMenu';
import AccountSelection from './pages/AccountSelection';
import Withdrawal from './pages/Withdrawal';
import Loading from './pages/Loading';
import ReceiptChoice from './pages/ReceiptChoice';
import BalanceEnquiry from './pages/BalanceEnquiry';
import MonitorSpendingQR from './pages/MonitorSpendingQR';
import RemoveCard from './pages/RemoveCard';
import CollectCash from './pages/CollectCash';
import TransactionComplete from './pages/TransactionComplete';
import AccountSelectionDeposit from './pages/AccountSelectionDeposit';
import DepositRules from './pages/DepositRules';
import DepositCash from './pages/DepositCash';
import TransactionSummary from './pages/TransactionSummary';
import FreezeAccount from './pages/FreezeAccount';
import Exit from './pages/Exit';
import PreOrderWithdrawal from './pages/PreOrderWithdrawal';
import PreOrderWithdrawalScreen from './pages/PreOrderWithdrawalScreen';
import PreOrderWithdrawalConfirmation from './pages/PreOrderWithdrawalConfirmation';
import ATMDashboard from './pages/ATMDashboard';
import LandingPage from './pages/LandingPage';
import PreOrderQR from './pages/PreOrderQR';
import './styles/App.css';
import QRCodeScanner from './components/QRCodeScanner';

const App = () => {
  const accountNum = '4111 1111 1111 1111'; // Example account number (replace with dynamic value from session or context)

  return (
    <AccountProvider>
      {/* Always monitor the account status */}
      <GlobalStatusMonitor accountNum={accountNum} />

      <Routes>
        <Route path="/" element={<InsertCard />} />
        <Route path="/enter-pin" element={<EnterPin />} />
        <Route path="/landingPage" element={<LandingPage />} />
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
        <Route path="/preOrderWithdrawalScreen" element={<PreOrderWithdrawalScreen />} />
        <Route path="/preOrderWithdrawalConfirmation" element={<PreOrderWithdrawalConfirmation />} />
        <Route path="/freeze-account/:accountNum" element={<FreezeAccount />} />
        <Route path="/atm-dashboard" element={<ATMDashboard />} />
        <Route path="/preOrderQR" element={<PreOrderQR />} />
        <Route path="/qrCodeScanner" element={<QRCodeScanner />} />
      </Routes>
    </AccountProvider>
  );
};

export default App;
