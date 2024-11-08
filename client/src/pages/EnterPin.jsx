import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from '../contexts/AccountContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Loading from './Loading';
import styles from '../styles/EnterPin.module.css';

const EnterPin = ({ accountId }) => {
    const { login, pinError } = useAccount();
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
        setIsLoading(true);
        const fullPin = pin.join('');
        const accountData = await login(accountId, fullPin);
    
        if (accountData) {
            console.log('Account Data:', accountData);
            if (accountData.account_status === 'frozen') {
                console.error('Account is frozen. Cannot log in.');
                alert('Your account is frozen. Please contact support.');
                setIsLoading(false);
                return; // Exit the function to prevent further execution
            }
            navigate('/mainMenu'); // Move to the main menu if account is not frozen
        } else {
            console.error('Invalid PIN entered');
        }
    
        setPin(['', '', '', '', '', '']);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isLoading && firstInputRef.current) {
            firstInputRef.current.focus();
        }
    }, [isLoading]);

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
                    {pinError && <p>{pinError}</p>}
                </div>
            </Layout>
        )
    );
};

export default EnterPin;
