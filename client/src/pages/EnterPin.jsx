import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from './Loading';
import ErrorMessage from '../components/ErrorMessage'; // Import the ErrorMessage component
import styles from '../styles/EnterPin.module.css';

const EnterPin = () => {
    const { login, pinError } = useAccount(); // Get pinError from context
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const firstInputRef = useRef(null);

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === 'Enter') {
                const isPinComplete = pin.every((digit) => digit !== '');
                if (isPinComplete) {
                    handleSubmit(e);
                } else {
                    console.warn('Please fill in all PIN fields.');
                }
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [pin]);

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^\d*$/.test(value) && value.length <= 1) {
            const newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (value && index < pin.length - 1) {
                const nextInput = document.querySelector(`input[name="pin-${index + 1}"]`);
                if (nextInput.value === '') {
                    nextInput.focus();
                    setTimeout(() => {
                        nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
                    }, 0);
                }
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'ArrowRight' && index < pin.length - 1) {
            const nextInput = document.querySelector(`input[name="pin-${index + 1}"]`);
            if (nextInput) {
                nextInput.focus();
                setTimeout(() => {
                    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
                }, 0);
            }
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            const prevInput = document.querySelector(`input[name="pin-${index - 1}"]`);
            if (prevInput) {
                prevInput.focus();
                setTimeout(() => {
                    prevInput.setSelectionRange(prevInput.value.length, prevInput.value.length);
                }, 0);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Fetching user data...");
        setIsLoading(true);
        const fullPin = pin.join(''); // Join the array to form the complete PIN
        const accountId = '4111 1111 1111 1111'; // Test account ID
        const accountData = await login(accountId, fullPin);

        if (accountData) {
            navigate('/landingPage');
        }

        setPin(['', '', '', '', '', '']); // Clear the PIN after submitting
        setIsLoading(false);
    };

    return (
        isLoading ? (
            <Loading />
        ) : (
            <Layout>
                <div className={styles.pinInputContent}>
                    <h2>Welcome</h2>
                    <p>Please enter your PIN</p>
                    <form onSubmit={handleSubmit} className={styles.pinForm}>
                        {pin.map((_, index) => (
                            <input
                                key={index}
                                type="password"
                                name={`pin-${index}`}
                                value={pin[index]}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                maxLength="1"
                                className={styles.pinBox}
                                ref={index === 0 ? firstInputRef : null}
                            />
                        ))}
                    </form>
                    <ErrorMessage message={pinError} isFrozen={pinError === 'Your account is frozen. Please contact support.'} /> {/* Show error message */}
                </div>
            </Layout>
        )
    );
};

export default EnterPin;
