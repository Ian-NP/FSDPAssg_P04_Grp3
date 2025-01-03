import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import styles from "../styles/RegisterFace.module.css";
import axios from 'axios';

const RegisterFace = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [multipleFaceDetected, setMultipleFaceDetected] = useState(false);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };

    loadModels();
  }, []);

  // Capture video from the user's webcam
  const startVideo = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;

    videoRef.current.addEventListener("play", () => {
      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      canvasRef.current.appendChild(canvas);
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length === 1) {
          const canvasContext = canvas.getContext('2d');
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          faceapi.draw.drawDetections(canvas, detections);
          faceapi.draw.drawFaceLandmarks(canvas, detections);
        }
      }, 100);
    });
  };

  const handleRegisterFace = async () => {
    const detections = await faceapi
      .detectAllFaces(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptors();
  
    if (detections.length === 1) {
      const faceDescriptor = detections[0].descriptor;
      const faceDescriptorData = Array.from(faceDescriptor).map((val) => val.toFixed(6)); // Ensure it's an array
  
      console.log("Sending request with data:", { faceDescriptor: faceDescriptorData });
  
      try {
        const response = await axios.post('http://localhost:3000/api/registerFace', {
          faceDescriptor: faceDescriptorData, // Send as an array
        });
        setIsRegistered(true);
        alert(response.data.message);
      } catch (error) {
        console.error("Error registering face:", error);
        alert("Error registering face.");
      }
  
      console.log("Face Descriptor:", faceDescriptorData);
    } else if (detections.length > 1) {
      setMultipleFaceDetected(true);
    } else {
      alert("No face detected. Please try again.");
    }
  }; 

  useEffect(() => {
    startVideo();
  }, []);

  return (
    <div className={styles.registerFaceContainer}>
      <h1 className={styles.title}>Register Your Face</h1>

      <div className={styles.videoContainer}>
        <video ref={videoRef} width="640" height="480" autoPlay muted className={styles.video} />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <button
        onClick={handleRegisterFace}
        className={`${styles.registerButton} ${multipleFaceDetected ? styles.disabledButton : ''}`}
        disabled={multipleFaceDetected}
      >
        {multipleFaceDetected ? "Multiple Faces Detected" : "Register Face"}
      </button>

      {isRegistered && <p className={styles.successMessage}>Face registered successfully!</p>}
    </div>
  );
};

export default RegisterFace;
