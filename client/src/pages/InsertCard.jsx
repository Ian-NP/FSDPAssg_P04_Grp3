import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/InsertCard.module.css";
import Lottie from 'lottie-react';
import InsertCardAnimation from '../assets/InsertCardAnimation.json';
import OCBClogo from '../assets/OCBClogo.png';
import { ATMProvider, useATM } from '../contexts/AtmContext';


const NoteOrb = ({ denomination }) => {
  const { cashLevels, maxCapacity } = useATM();

  // Get the current cash level for this denomination
  const availableNotes = cashLevels[denomination];
  const totalCapacity = maxCapacity[denomination]; // Max capacity for this denomination

  // Calculate the percentage of available notes
  const percentage = (availableNotes / totalCapacity) * 100;

  // Determine if the amount label should have the water level background color
  const isamountLabelInWater = percentage > 30; // Adjust this threshold as needed
  const isnoteLabelInWater = percentage > 53; // Adjust this threshold as needed

  // Set a contrasting color for the text if background is the water color
  const amountlabelStyle = isamountLabelInWater
    ? { color: '#fff', } // Red background with white text
    : { color: '#000' }; // Transparent background with black text

  const notelabelStyle = isnoteLabelInWater
    ? { color: '#fff', } // Red background with white text
    : { color: '#000' }; // Transparent background with black text

  return (
    <div className={styles.orbContainer}>
      {/* Water level with dynamic height */}
      <div className={styles.waterLevel} style={{ height: `${percentage > 100 ? 100 : percentage}%` }} />
      <div className={styles.noteLabel} style={notelabelStyle}>{denomination === 10 ? "$10" : "$50"}</div>
      <div className={styles.amountLabel} style={amountlabelStyle}>
        {availableNotes} Notes
      </div>
    </div>
  );
};


const InsertCard = () => {
  const navigate = useNavigate();
  const { cashLevels } = useATM();

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

  // Convert cashLevels to integers for accurate calculations
  console.log(cashLevels);

  return (
    <div className={styles.insertCardContainer}>
      <div className={styles.title}>
        <h1>Welcome to </h1>
        <img src={OCBClogo} width={200} alt="OCBC logo" />
      </div>

      {/* Lottie animation */}
      <Lottie 
        animationData={InsertCardAnimation}
        style={{ width: 450, height: 450 }}
        speed={0.5} // Set speed to 50%
        loop={true}
      />
      <p>Please insert your card</p>

      <button onClick={() => navigate('/QRCodeScanner')}>Scan QR Code</button>

      {/* Display cash levels */}
      <div className={styles.cashAvailabilityContainer}>
        <h2>Amount of Cash Available</h2>
        <div className={styles.cashLevelsContainer}>
          <NoteOrb denomination={10} />
          <NoteOrb denomination={50} />
        </div>
      </div>

    </div>
  );
};

export default InsertCard;
