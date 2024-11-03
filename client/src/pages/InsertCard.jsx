import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/InsertCard.module.css";
import Lottie from 'lottie-react';
import InsertCardAnimation from '../assets/InsertCardAnimation.json';
import OCBClogo from '../assets/OCBClogo.png';

const InsertCard = () => {
  const navigate = useNavigate();

  // useEffect to set up event listener for "Enter" key press
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleCardInsert();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleCardInsert = () => {
    // Simulate card insertion logic here
    navigate("/enter-pin");
  };

  return (
    <div className={styles.insertCardContainer}>
      <div className={styles.title}>
        <h1>Welcome to </h1>
        <img src={OCBClogo} width={200} alt="OCBC logo" />
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

export default InsertCard;
