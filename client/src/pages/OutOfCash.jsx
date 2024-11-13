import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles/OutOfCash.module.css"; // Update styles
import { useATM } from '../contexts/AtmContext';
import ReactQR from 'react-qr-code';

const OutOfCash = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [nearestATM, setNearestATM] = useState(null);
    const navigate = useNavigate();
    const { fetchNearestATM } = useATM();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const atmDetails = await fetchNearestATM(1); // Fetch nearest ATM
                setNearestATM(atmDetails);
            } catch (error) {
                console.error('Error fetching nearest ATM:', error);
                setNearestATM(null); 
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    const handleReturnToHome = () => {
        navigate("/mainMenu");
        onClose();
    };

    const renderNearestAtmInfo = () => {
        if (loading) {
            return <p className={styles.loading}>Loading nearest ATM information...</p>;
        }

        if (nearestATM) {
            const { latitude, longitude, address, postalCode } = nearestATM;
            const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

            return (
                <div className={styles.nearestAtmInfo}>
                    <h3 className={styles.atmHeading}>Nearest ATM</h3>
                    <p><strong>Address:</strong><br></br> {address}, {postalCode}</p>
                    <p><strong>Distance:</strong> {nearestATM.distance.toFixed(2)} meters</p>

                    {/* Display the QR Code */}
                    <div className={styles.qrCodeContainer}>
                        <h4>Scan to open in Google Maps</h4>
                        <ReactQR value={googleMapsLink} size={256} />
                    </div>
                </div>
            );
        } else {
            return (
                <p>We couldn't retrieve the nearest ATM details. Please try again later.</p>
            );
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h1 className={styles.title}>Out of Cash</h1>
                <p className={styles.message}>Sorry, the ATM is <b>out of cash</b>. Please try again later.</p>
                
                {/* Render nearest ATM information */}
                {renderNearestAtmInfo()}

                <button className={styles.button} onClick={handleReturnToHome}>Return to Home</button>
            </div>
        </div>
    );
};

export default OutOfCash;
