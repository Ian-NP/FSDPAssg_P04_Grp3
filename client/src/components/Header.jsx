import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'; // Import Speech Recognition
import OCBClogo from '../assets/OCBClogo.png';
import exit from '../assets/exit.png';
import SpeechRecognitionHandler from './SpeechRecognitionHandler'; // Import the SpeechRecognitionHandler component
import styles from '../styles/Header.module.css';
import { useAccount } from '../contexts/AccountContext'; // Import useAccount

const Header = () => {
  const {LogOutAcc} = useAccount();
  const navigate = useNavigate(); // Initialize useNavigate  

  const handleExit = () => {
    LogOutAcc(); // Call the LogOutAcc function from the AccountContext
    navigate('/exit'); // Navigate to the /exit route
  };

  return (
    <header className={styles['atm-header']}>
      <img src={OCBClogo} alt="OCBC Logo" className={styles['ocbc-logo']} />
      <div className={styles['header-right']}>
        <SpeechRecognitionHandler />
        <span className={styles['language']}><b>中文</b></span>
        <div className={styles['header-divider']}></div>
        <button className={styles['exit-container']} onClick={handleExit}>
          <img src={exit} alt="Exit" className={styles['exit-icon']} />
          <span className={styles['exit-text']}>Exit</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
