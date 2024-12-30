import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import styles from "../styles/RegisterFace.module.css"; // Updated CSS file for better styling
import axios from 'axios';

const RegisterFace = () => {
  const videoRef = useRef(null); // Ref for video element
  const canvasRef = useRef(null); // Ref for canvas to display face-api.js detections
  const [userId, setUserId] = useState(""); // State for user ID input
  const [isRegistered, setIsRegistered] = useState(false); // State to show if the user has been registered
  
  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Place models in the public/models directory
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
          const faceDescriptor = detections[0].descriptor;

          // Clear previous drawings from canvas using getContext('2d')
          const canvasContext = canvas.getContext('2d');
          canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

          // Draw the detections
          faceapi.draw.drawDetections(canvas, detections);
          faceapi.draw.drawFaceLandmarks(canvas, detections);
        }
      }, 100); // Adjust interval for smoother checks
    });
  };

  const handleRegisterFace = async () => {
    if (!userId.trim()) {
        alert("Please enter a valid User ID");
        return;
    }

    const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();

    if (detections.length === 1) {
        const faceDescriptor = detections[0].descriptor;

        // Convert faceDescriptor array into a storable format (array of floats)
        const faceDescriptorData = faceDescriptor.map((val) => val.toFixed(6)); // Ensure it’s a number with a fixed number of decimals

        console.log("Sending request with data:", { userId, faceDescriptor: faceDescriptorData });

        // Send face descriptor to backend (Node.js server)
        try {
            const response = await axios.post('http://localhost:3000/api/accounts/registerFace', {
                userId,
                faceDescriptor: faceDescriptorData,
            });
            setIsRegistered(true);
            alert(response.data.message); // Alert based on backend response
        } catch (error) {
            console.error("Error registering face:", error);
            alert("Error registering face.");
        }

        console.log("Face Descriptor:", faceDescriptorData); // For debugging
    } else {
        alert("No face detected. Please try again.");
    }
};


  // Start video when component mounts
  useEffect(() => {
    startVideo();
  }, []);

  return (
    <div className={styles.registerFaceContainer}>
      <h1 className={styles.title}>Register Your Face</h1>

      <div className={styles.inputContainer}>
        <label htmlFor="userId" className={styles.label}>Enter Your User ID</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter a unique user ID"
          className={styles.input}
        />
      </div>

      <div className={styles.videoContainer}>
        <video ref={videoRef} width="640" height="480" autoPlay muted className={styles.video} />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      <button onClick={handleRegisterFace} className={styles.registerButton}>
        Register Face
      </button>

      {isRegistered && <p className={styles.successMessage}>Face registered successfully!</p>}
    </div>
  );
};

export default RegisterFace;
