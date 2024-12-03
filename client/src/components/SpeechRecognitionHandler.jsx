import React, { useState } from 'react';
import axios from "axios"; 
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import styles from "../styles/SpeechRecognitionHandler.module.css";
import { useAccount } from '../contexts/AccountContext';
import microphone from '../assets/microphone.svg';
import stopRecording from '../assets/stopRecording.svg';
import volumeAnimation from "../assets/volumeAnimation.json";

const SpeechRecognitionHandler = () => {
const [isListening, setIsListening] = useState(false);
const [loading, setLoading] = useState(false); // To manage loading state
const { transcript, resetTranscript } = useSpeechRecognition();

const navigate = useNavigate(); // Initialize useNavigate

if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support speech recognition.</p>;
}

const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
};

const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);

    setTimeout(async() => {
        if (transcript === "") {
            resetTranscript(); // Reset the transcript after stopping
            return;
        }

        try {
            setLoading(true); // Start loading state
            console.log("Sending transcript to backend:", transcript);
            const response = await axios.post("http://localhost:3000/api/voiceCommandGeneration", { userResponse: transcript });
            const { action, amount, status } = response.data; // Extract action and amount
            if (status) {
                console.log("Command from backend:", action);
                console.log("Amount from backend:", amount);
                handleCommand(action, amount); // Process the command
            }
        } catch (error) {
            console.error("Error processing command:", error);
            alert("Failed to process your command. Please try again later.");
        } finally {
            resetTranscript(); // Clear the transcript
            setLoading(false); // End loading state
        }
        resetTranscript(); // Reset the transcript after stopping
        console.log("Manually cleared transcript after timeout.");
    }, 200); // Delay ensures SpeechRecognition is fully stopped
};

const cancelListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    console.log("Canceled listening. Transcript cleared.");
    setTimeout(() => {
        resetTranscript(); // Reset the transcript after stopping
    }, 100);
};

const handleCommand = (action, amount) => {
    if (action === "Withdraw Funds") {
      console.log(`Navigate to withdrawal page with amount: ${amount}`);
      navigate("/AccountSelection", { state: { amountToWithdraw: amount } });
    } else if (action === "Check Balance") {
      console.log("Navigate to balance enquiry page.");
      navigate("/balanceEnquiry");
    } else if (action === "Monitor Spendings") {
      console.log("Navigate to spending analysis page.");
      navigate("/monitorSpendingQR");
    } else {
      console.warn("Unrecognized command from backend.");
      alert("Unrecognized command. Please try again.");
    }
  };

return (
    <div style={{ position: 'relative', marginLeft: "1rem", marginRight: "1rem" }}>
        <button onClick={startListening} className={styles.microphoneBtn}>
            <img src={microphone} alt="Microphone" />
        </button>
        {isListening && (
            <div className={styles['modal-overlay']}>
                <div className={styles.modal}>
                <p>Listening... Speak your command.</p>
                <Lottie
                    animationData={volumeAnimation}
                    style={{ width: 200, height: 200 }}
                    speed={0.05} // Set speed to 50%
                    loop={true}
                />
                <button onClick={stopListening} className={styles.stopBtn}>
                    <img src={stopRecording} alt="Stop Icon" className={styles.stopIcon} />
                </button>
                <button onClick={cancelListening} className={styles.cancelBtn}>
                    Cancel
                </button>
                </div>
            </div>
        )}
    </div>
);
};

export default SpeechRecognitionHandler;