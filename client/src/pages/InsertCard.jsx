// pages/InsertCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import styles from "../styles/InsertCard.module.css"; // Import CSS module
import Lottie from 'lottie-react';
import InsertCardAnimation from '../assets/InsertCardAnimation.json'; // Import Lottie animation
import OCBClogo from '../assets/OCBClogo.png';

const InsertCard = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleCardInsert = () => {
    // Simulate card insertion logic here
    navigate("/enter-pin"); // Navigate to enter PIN screen
  };

  // Code to listen when enter key is pressed and call handleCardInsert
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleCardInsert();
    }
  });

  return (
    <div className={styles.insertCardContainer}>
      <div className={styles.title}>
        <h1>Welcome to </h1>
        <img src={OCBClogo} width={200}/>
      </div>
      <Lottie 
        animationData={InsertCardAnimation}
        style={{ width: 450, height: 450 }}
        speed={0.5} // Set speed to 50%
        loop={true}
      />
      <p>Please insert your card</p>
      
    </div>
  );
};

export default InsertCard; // Export the component
