import React from 'react';
import OCBClogo from '../assets/OCBClogo.png';
import exit from '../assets/exit.png';
import styles from '../styles/Header.module.css';

const Header = ({ onExit }) => {
  return (
    <header className={styles['atm-header']}>
      <img src={OCBClogo} alt="OCBC Logo" className={styles['ocbc-logo']} />
      <div className={styles['header-right']}>
        <span className={styles['language']}>中文</span>
        <div className={styles['header-divider']}></div>
        <button className={styles['exit-container']} onClick={onExit}>
          <img src={exit} alt="Exit" className={styles['exit-icon']} />
          <span className={styles['exit-text']}>Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
