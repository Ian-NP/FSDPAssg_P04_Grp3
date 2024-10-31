import React from 'react';
import OCBClogo from './assets/OCBClogo.png';
import exit from './assets/exit.png';
import './styles/Header.css';

const Header = ({ onExit }) => {
  return (
    <header className="atm-header">
      <img src={OCBClogo} alt="OCBC Logo" className="ocbc-logo" />
      <div className="header-right">
        <span className="language">中文</span>
        <div className="header-divider"></div>
        <button className="exit-container" onClick={onExit}>
          <img src={exit} alt="Exit" className="exit-icon" />
          <span className="exit-text">Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
