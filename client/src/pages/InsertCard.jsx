import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/InsertCard.module.css";
import Lottie from 'lottie-react';
import InsertCardAnimation from '../assets/InsertCardAnimation.json';
import facialRecognitionAnimation from "../assets/facialRecognitionAnimation.json";
import recognisingFaceAnimation from "../assets/recognisingFaceAnimation.json";
import OCBClogo from '../assets/OCBClogo.png';
import { ATMProvider, useATM } from '../contexts/AtmContext';
import * as faceapi from 'face-api.js';  // Import face-api.js
import axios from 'axios';

const NoteOrb = ({ denomination }) => {
  const { cashLevels, maxCapacity } = useATM();

  const availableNotes = cashLevels[denomination];
  const totalCapacity = maxCapacity[denomination]; // Max capacity for this denomination

  const percentage = (availableNotes / totalCapacity) * 100;

  const isamountLabelInWater = percentage > 30;
  const isnoteLabelInWater = percentage > 53;

  const amountlabelStyle = isamountLabelInWater
    ? { color: '#fff' }
    : { color: '#000' };

  const notelabelStyle = isnoteLabelInWater
    ? { color: '#fff' }
    : { color: '#000' };

  return (
    <div className={styles.orbContainer}>
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

  const dialogRef = useRef(null);
  const videoRef = useRef(null); 
  const canvasRef = useRef(null); 

  const [stream, setStream] = useState(null); // Track video stream

  useLayoutEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      console.log("Loading face-api.js models...");
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      console.log("Models loaded!");
    };

    loadModels();

    localStorage.setItem('accounts', null);

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        handleCardInsert();
      }
    };

    const handleClickOutside = (event) => {
      if (event.target.className === dialogRef.current.className) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      document.removeEventListener("click", handleClickOutside);

      // Cleanup face-api.js and video stream when the component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop the video stream
      }
      clearInterval(detectionInterval); // Clear face detection interval
    };
  }, []); 

  let detectionInterval;

  const handleCardInsert = () => {
    navigate("/enter-pin");
  };

  const handleSuccessfulFaceMatch = () => {
    navigate("/accountMenu");
  };

  const openModal = () => {
    dialogRef.current.showModal();
    startFacialRecognition();
  };

  const startFacialRecognition = () => {
    let requestSent = false;
    let detectionInterval = null; // Store the interval reference to clear it when done
    let stream = null; // Store the video stream to stop it later
  
    const streamVideo = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(stream); // Set the video stream in the component's state
      videoRef.current.srcObject = stream;
  
      videoRef.current.addEventListener("play", () => {
        if (canvasRef.current && videoRef.current) {
          const canvas = faceapi.createCanvasFromMedia(videoRef.current);
          canvasRef.current.appendChild(canvas);
          const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
          faceapi.matchDimensions(canvas, displaySize);
  
          detectionInterval = setInterval(async () => {
            if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
              const detections = await faceapi
                .detectAllFaces(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptors();
  
              if (detections.length === 1) {
                console.log("Face detected!");
                const faceDescriptor = detections[0].descriptor;
  
                if (!requestSent) {
                  try {
                    const response = await axios.get('http://localhost:3000/api/getFaceDescriptors');
                    const storedFaceIds = response.data.faceIds;
                    console.log("Stored face IDs:", storedFaceIds);
  
                    const matchedFaceId = Object.keys(storedFaceIds).find(faceId => {
                      const storedDescriptor = storedFaceIds[faceId];
                      const distance = faceapi.euclideanDistance(faceDescriptor, storedDescriptor);
                      return distance < 0.6;
                    });
  
                    if (matchedFaceId) {
                      console.log("Face matched!");
                      const response = await axios.get(`http://localhost:3000/api/accounts/userId/${matchedFaceId}`);
                      const accounts = response.data.accounts;
                      localStorage.setItem('accounts', JSON.stringify(accounts));
                      handleSuccessfulFaceMatch();
                      
                      // Stop the camera after successful face recognition
                      stopCamera();
                    } else {
                      console.log("Face did not match.");
                    }
  
                    requestSent = true;
                  } catch (error) {
                    console.error("Error fetching stored face IDs:", error);
                    requestSent = true;
                  }
                }
              } else if (detections.length > 1) {
                console.log("Multiple faces detected! Failing authentication.");
                requestSent = true;
              }
            }
          }, 100);
        }
      });
    };
  
    streamVideo();
  
    // Stop the camera and clear the detection interval
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop each track (video/audio)
      }
      if (detectionInterval) {
        clearInterval(detectionInterval); // Clear the face detection interval
      }
    };
  };  

  const closeModal = () => {
    dialogRef.current.close();
  };

  return (
    <div className={styles.insertCardContainer}>
      <div className={styles.title}>
        <h1>Welcome to </h1>
        <img src={OCBClogo} width={200} alt="OCBC logo" />
      </div>

      <div className={styles.authenticationMethods}>
        <div className={styles.cardMethod} onClick={handleCardInsert}>
          <Lottie 
            animationData={InsertCardAnimation}
            style={{ width: 350, height: 350, clipPath: 'inset(10% 10% 10% 10%)', transformOrigin: 'center center', transform: 'scale(1.2)' }}
            speed={0.5} 
            loop={true}
          />
          <p>Option 1: <br></br>Please insert your card</p>
        </div>
        <div className={styles.facialMethod} onClick={openModal}>
          <Lottie 
            animationData={facialRecognitionAnimation}
            style={{ width: 350, height: 350, clipPath: 'inset(30% 30% 30% 30%)', transformOrigin: 'center center', transform: 'scale(1.4)' }}
            speed={0.5} 
            loop={true}
          />
          <p>Option 2: <br></br>Access via Facial Recognition</p>
        </div>
      </div>

      <button className={styles.scanQRCodeButton} onClick={() => navigate('/QRCodeScanner')}>
        Scan QR Code
      </button>

      <div className={styles.cashAvailabilityContainer}>
        <h2>Amount of Cash Available</h2>
        <div className={styles.cashLevelsContainer}>
          <NoteOrb denomination={10} />
          <NoteOrb denomination={50} />
        </div>
      </div>

      <dialog ref={dialogRef} className={styles.dialogModal}>
        <video ref={videoRef} width="300" height="300" autoPlay muted className={styles.videoFeed} />
        <div className={styles.modalContent}>
          <Lottie
            animationData={recognisingFaceAnimation}
            style={{ width: 200, height: 200 }}
            loop={true}
          />
          <p className={styles.modalText}>Scanning your face for authentication...</p>
        </div>
        <div ref={canvasRef} />
      </dialog>
    </div>
  );
};

export default InsertCard;
