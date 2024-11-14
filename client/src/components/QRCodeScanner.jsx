// QRCodeScanner.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
      console.log('Scanned Data:', data); // Log the raw data
      try {
        const { amount, accountDetails } = JSON.parse(data);
        navigate('/PreOrderWithdrawalConfirmation', { state: { amount, accountDetails } });
      } catch (err) {
        setError(new Error('Invalid QR code data format'));
      }
    }
  };  

  const handleError = (err) => {
    setError(err);
    console.error('Scanner error:', err);
  };
  
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Scan QR Code</h2>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <QrScanner
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%', height: '400px' }}  // Set a height for better visibility
      />
    </div>
  );
};

export default QRCodeScanner;