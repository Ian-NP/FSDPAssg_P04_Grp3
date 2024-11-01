import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from '../styles/Exit.module.css'; 
import OCBClogo from '../assets/OCBClogo.png';

const Exit = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Trigger the visibility after the component mounts
    setVisible(true);

    // Set a timer to navigate after 5 seconds
    const timer = setTimeout(() => {
      navigate('/'); // Navigate to the home page
    }, 5000);

    // Clear the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]); // Add navigate to the dependency array

  return (
    <div className={`${styles.exitContainer} ${visible ? styles.visible : ''}`}>
      <img src={OCBClogo} alt="OCBC Logo" width={250} />
      <h1>Thank You for Banking with us!</h1>
      <p>See you soon!</p>
    </div>
  );
};

export default Exit;
