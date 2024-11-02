import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/CollectCash.module.css';
import collectCash from '../assets/collectCash.png';

const CollectCash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/transactionComplete'); 
    }, 5000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles['collect-cash-container']}>
      <img src={collectCash} alt="Collect Cash" className={styles['cash-image']} />
      <p className={styles['collect-text']}>Please collect your cash</p>
    </div>
  );
};

export default CollectCash;
