import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleScan = (data) => {
    if (data) {
        // Log the raw data to check if it's a string or an object
        console.log('Raw Scanned Data:', data);

        // Check if data is an object with a "text" property
        const scannedText = typeof data === 'string' ? data : data?.text;

        if (!scannedText) {
            setError(new Error('QR code did not contain text data'));
            return;
        }

        try {
            // Parse the scanned text as JSON
            const parsedData = JSON.parse(scannedText.trim());
            console.log(parsedData);
            const { amount, accountDetails } = parsedData;

            // Check if all required fields are present
            if (!amount || !accountDetails) {
                throw new Error('Invalid QR code data format');
            }

            // Rename accountDetails to accountInfo when navigating
            navigate('/PreOrderWithdrawalConfirmation', { state: { amount, accountInfo: accountDetails } });
        } catch (err) {
            setError(new Error('Invalid QR code data format'));
            console.error('Error parsing QR code data:', err);
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
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};

export default QRCodeScanner;