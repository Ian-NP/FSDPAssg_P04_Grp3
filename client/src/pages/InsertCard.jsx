import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/InsertCard.module.css";
import Lottie from 'lottie-react';
import InsertCardAnimation from '../assets/InsertCardAnimation.json';
import facialRecognitionAnimation from "../assets/facialRecognitionAnimation.json";
import recognisingFaceAnimation from "../assets/recognisingFaceAnimation.json";
import OCBClogo from '../assets/OCBClogo.png';
import { ATMProvider, useATM } from '../contexts/AtmContext';
import * as faceapi from 'face-api.js';  // Import face-api.js


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

  // Modal reference
  const dialogRef = useRef(null);
  const videoRef = useRef(null); // Reference for the video element
  const canvasRef = useRef(null); // Reference for the canvas where face-api.js will draw detections
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status

  // useEffect to set up event listener for "Enter" key press
  useEffect(() => {
    // Load the face-api.js models
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Place models in the public/models directory
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };

    loadModels();

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleCardInsert();
      }
    };

    const handleClickOutside = (event) => {
      // Check if click is outside the modal content area
      if (event.target.className === dialogRef.current.className) {
        closeModal(); // Close modal if clicked outside
      }
      console.log("working");
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Empty dependency array ensures this runs once when the component mounts

  const handleCardInsert = () => {
    // Simulate card insertion logic here
    navigate("/enter-pin");
  };
  
  const openModal = () => {
    dialogRef.current.showModal(); // Open modal
    startFacialRecognition();
  };

  const startFacialRecognition = () => {
    const streamVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
  
      videoRef.current.addEventListener("play", () => {
        if (canvasRef.current && videoRef.current) {
          const canvas = faceapi.createCanvasFromMedia(videoRef.current);
          canvasRef.current.appendChild(canvas); // Append canvas once video starts
          const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
          faceapi.matchDimensions(canvas, displaySize);
  
          setInterval(async () => {
            const detections = await faceapi
              .detectAllFaces(videoRef.current)
              .withFaceLandmarks()
              .withFaceDescriptors();
  
            if (detections.length === 1) {
              const faceDescriptor = detections[0].descriptor;
              // Compare with stored face descriptor (You will need to fetch this from the backend)
              const distance = faceapi.euclideanDistance(faceDescriptor, storedFaceDescriptor);
              if (distance < 0.6) {
                setIsAuthenticated(true); // Successfully authenticated
                console.log("Face matched!");
              } else {
                console.log("Face did not match.");
                setIsAuthenticated(false);
              }
            } else if (detections.length > 1) {
              console.log("Multiple faces detected! Failing authentication.");
              setIsAuthenticated(false);
            }
          }, 100); // Adjust interval for smoother checks
        }
      });
    };
  
    streamVideo();
  };

  const closeModal = () => {
    dialogRef.current.close(); // Close modal
    setIsAuthenticated(false); // Reset authentication status
  };

  // Convert cashLevels to integers for accurate calculations
  console.log(cashLevels);

  return (
    <div className={styles.insertCardContainer}>
      <div className={styles.title}>
        <h1>Welcome to </h1>
        <img src={OCBClogo} width={200} alt="OCBC logo" />
      </div>

      <div className={styles.authenticationMethods}>
        <div className={styles.cardMethod} onClick={handleCardInsert}>
          {/* Lottie animation */}
          <Lottie 
            animationData={InsertCardAnimation}
            style={{ width: 350, height: 350, clipPath: 'inset(10% 10% 10% 10%)', transformOrigin: 'center center', transform: 'scale(1.2)' }}
            speed={0.5} // Set speed to 50%
            loop={true}
          />
          <p>Option 1: <br></br>Please insert your card</p>
        </div>
        {/* <div className={styles.verticalLine}></div> */}
        <div className={styles.facialMethod} onClick={openModal}>
          {/* Lottie animation */}
          <Lottie 
            animationData={facialRecognitionAnimation}
            style={{ width: 350, height: 350, clipPath: 'inset(30% 30% 30% 30%)', transformOrigin: 'center center', transform: 'scale(1.4)' }}
            speed={0.5} // Set speed to 50%
            loop={true}
          />
          <p>Option 2: <br></br>Access via Facial Recognition</p>
        </div>
      </div>

      <button className={styles.scanQRCodeButton} onClick={() => navigate('/QRCodeScanner')}>
        Scan QR Code
      </button>


      {/* Display cash levels */}
      <div className={styles.cashAvailabilityContainer}>
        <h2>Amount of Cash Available</h2>
        <div className={styles.cashLevelsContainer}>
          <NoteOrb denomination={10} />
          <NoteOrb denomination={50} />
        </div>
      </div>

      {/* Modal using <dialog> */}
      <dialog ref={dialogRef} className={styles.dialogModal}>
        {/* Video feed positioned at the top-right corner */}
        <video ref={videoRef} width="300" height="300" autoPlay muted className={styles.videoFeed} />

        {/* Modal content */}
        <div className={styles.modalContent}>
          <Lottie
            animationData={recognisingFaceAnimation}
            style={{ width: 200, height: 200 }}
            loop={true}
          />
          <p className={styles.modalText}>Scanning your face for authentication...</p>
        </div>
      </dialog>
    </div>
  );
};

export default InsertCard;
