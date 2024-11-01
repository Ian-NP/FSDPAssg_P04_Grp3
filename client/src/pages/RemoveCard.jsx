import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../styles/RemoveCard.module.css';
import removeCard from '../assets/removeCard.png';

const RemoveCard = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    
    const timer = setTimeout(() => {
      navigate('/CollectCash'); 
    }, 5000); 

    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles['preparing-cash-container']}>
      <img src={removeCard} alt="Remove Card" className={styles['card-image']} />
      <h2 className={styles['main-text']}>We are preparing your cash</h2>
      <p className={styles['sub-text']}>Meanwhile, please collect your card.</p>
    </div>
  );
};

export default RemoveCard;
