// pages/InsertCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const InsertCard = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleCardInsert = () => {
    // Simulate card insertion logic here
    navigate("/enter-pin"); // Navigate to enter PIN screen
  };

  return (
    <div>
      <h1>Insert Your Card</h1>
      <button onClick={handleCardInsert}>Insert Card</button>
    </div>
  );
};

export default InsertCard; // Export the component
