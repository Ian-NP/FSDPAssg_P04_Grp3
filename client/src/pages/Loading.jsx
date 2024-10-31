import React from 'react';
import Lottie from "lottie-react";
import LoadingAnimation from '../assets/loadingAnimation.json'; // Ensure correct path and filename
import styles from '../styles/Loading.module.css';

const Loading = ({ isLoading }) => {
    return (
        <div className={styles.loadingContainer}>
            <Lottie
                animationData={LoadingAnimation} // Use the correct variable name
                loop={true} // Set to true if you want the animation to loop
                style={{ width: 500, height: 500 }} // Adjust as needed
            />
        </div>
    );
};

export default Loading;
