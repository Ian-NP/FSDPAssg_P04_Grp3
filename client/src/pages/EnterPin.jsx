import React, { useState, useEffect } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import styles from '../styles/EnterPin.module.css';

const EnterPin = ({ accountId }) => {
    const { login, pinError } = useAccount();
    const { fetchAndSetUserData, error } = useUser();
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === 'Enter') {
                const isPinComplete = pin.every((digit) => digit !== ''); // Check if all inputs are filled
                if (isPinComplete) {
                    handleSubmit(e); // Call handleSubmit if the PIN is complete
                } else {
                    console.warn('Please fill in all PIN fields.'); // Optional: Log a warning
                }
            }
        };

        // Add event listener for keydown events
        document.addEventListener('keydown', handleGlobalKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [pin]); // Add pin as a dependency to ensure the latest state is used

    const handleChange = (e, index) => {
        const value = e.target.value;

        // Allow only numeric input
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newPin = [...pin];
            newPin[index] = value; // Update the specific digit
            setPin(newPin);

            // Move focus to the next input field if it's not the last one
            if (value && index < pin.length - 1) {
                const nextInput = document.querySelector(`input[name="pin-${index + 1}"]`);
                if (nextInput.value === '') {
                    nextInput.focus();
                    // Set cursor to the end of the value
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
                // Set cursor to the end of the value
                setTimeout(() => {
                    nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
                }, 0);
            }
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            const prevInput = document.querySelector(`input[name="pin-${index - 1}"]`);
            if (prevInput) {
                prevInput.focus();
                // Set cursor to the end of the value
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
        navigate('/main-menu'); // Navigate to the main menu while fetching data
        const fullPin = pin.join(''); // Join the array to form the complete PIN
        const accountData = await login(accountId, fullPin);

        if (accountData) {
            const isUserDataFetched = await fetchAndSetUserData(accountData.userId);
            if (isUserDataFetched) {
                navigate('/main-menu');
            } else {
                alert('Error fetching user data. Please try again.');
            }
        } else {
            console.error('Invalid PIN entered');
        }

        setPin(['', '', '', '', '', '']); // Clear the PIN
        setIsLoading(false);
    };

    return (
        <Layout>
            <div className={styles.pinInputContent}>
                <h2>Welcome</h2>
                <p>Please enter your PIN</p>
                <form onSubmit={handleSubmit} className={styles.pinForm}>
                    {pin.map((_, index) => (
                        <input
                            key={index}
                            type="password" // Change to password type to show asterisks
                            name={`pin-${index}`}
                            value={pin[index]}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder="" // Set placeholder to empty
                            maxLength="1" // Limit to one character
                            className={styles.pinBox}
                        />
                    ))}
                </form>
                {pinError && <p>{pinError}</p>}
                {error && <p>{error}</p>}
                {isLoading && <p>Loading...</p>}
            </div>
        </Layout>
    );
};

export default EnterPin;
