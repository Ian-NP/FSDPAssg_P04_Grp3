import React, { useState, useRef } from 'react';
import styles from '../styles/SlideButton.module.css';

const SlideButton = ({ onSlideComplete }) => {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const sliderRef = useRef(null);

  // For touch devices, use event handlers for touch events
  const handleStart = (e) => {
    setIsSliding(true);
    // For touch events, you need to track the first touch point
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    setInitialPosition(clientX);
  };

  const handleMove = (e) => {
    if (!isSliding) return;
    
    // For touch events, use touches[0] instead of clientX
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    
    const sliderWidth = sliderRef.current.offsetWidth;
    const newSliderPosition = Math.min(clientX - sliderRef.current.offsetLeft, sliderWidth - 50); // 50 is handle width
    setSliderPosition(newSliderPosition);

    // Trigger the action if slider reaches the end
    if (newSliderPosition >= sliderWidth - 50) {
      setIsSliding(false);
      onSlideComplete();
    }
  };

  const handleEnd = () => {
    setIsSliding(false);
    if (sliderPosition < sliderRef.current.offsetWidth - 50) {
      setSliderPosition(0); // Reset if not fully slid
    }
  };

  // Initial position for touch devices to track movement properly
  const [initialPosition, setInitialPosition] = useState(0);

  // Event listeners for mouse and touch
  const handleMouseDown = (e) => handleStart(e);
  const handleTouchStart = (e) => handleStart(e);
  
  const handleMouseMove = (e) => handleMove(e);
  const handleTouchMove = (e) => handleMove(e);
  
  const handleMouseUp = () => handleEnd();
  const handleTouchEnd = () => handleEnd();

  return (
    <div 
      className={styles.sliderContainer} 
      ref={sliderRef} 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* The text remains fixed in the center */}
      <span className={styles.sliderText}>
        Slide to Confirm Withdrawal
      </span>
      
      <div
        className={styles.sliderHandle}
        style={{ left: `${sliderPosition}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    </div>
  );
};

export default SlideButton;