// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InsertCard from './pages/InsertCard';
import EnterPin from './pages/EnterPin';
import MainMenu from './pages/MainMenu';
import AccountSelection from './pages/AccountSelection';
import Withdrawal from './pages/Withdrawal';
import Loading from "./pages/Loading";
import './styles/App.css';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<InsertCard />} />
        <Route path="/enter-pin" element={<EnterPin />} />
        <Route path="/mainMenu" element={<MainMenu />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/accountSelection" element={<AccountSelection />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
      </Routes>
    </>
  );
};

export default App;
