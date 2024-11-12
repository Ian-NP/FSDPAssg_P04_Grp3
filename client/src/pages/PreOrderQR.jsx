import React from 'react';


const PreOrderQR = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [transaction_id, setTransaction_id] = useState('');
  
    const handleGenerateQRCode = async () => {
      try {
        const response = await fetch(`/generate-qr?transactionId=${transaction_id}`);
        const data = await response.json();
  
        if (response.ok) {
          setQrCodeUrl(data.qrCodeUrl); // Set the QR code image URL
        } else {
          alert(data.message); // Handle error (e.g., transaction not found)
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        alert('Failed to generate QR code');
      }
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Enter Transaction ID"
          value={transaction_id}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <button onClick={handleGenerateQRCode}>Generate QR Code</button>
  
        {qrCodeUrl && (
          <div>
            <h3>Scan this QR Code:</h3>
            <img src={qrCodeUrl} alt="Transaction QR Code" />
          </div>
        )}
      </div>
    );
  };
  
export default PreOrderQR;