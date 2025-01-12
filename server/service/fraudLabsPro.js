// fraudLabsPro.js
const axios = require('axios');
const { sendSuspiciousTransactionEmail } = require('../emailService');  // Ensure you have an email service
require('dotenv').config();  // Load environment variables

const API_KEY = process.env.FRAUDLABS_PRO_API_KEY;
const API_URL = 'https://api.fraudlabspro.com/v2/order/screen';

// Fraud detection function
async function checkForFraud(transaction) {
  const transactionData = {
    key: API_KEY,
    amount: transaction.amount,
    currency: 'SGD',
    ip: transaction.ipAddress,
    transactionDate: transaction.transaction_date,
    email: transaction.email,
  };

  try {
    const response = await axios.post(API_URL, transactionData);
    console.log("FraudLabs Pro Response:", response.data);  // Log the entire response

    if (response.data.status === 'SUCCESS') {
      const fraudScore = response.data.fraudlabspro_score;
      console.log("Fraud score:", fraudScore);

      // Check the fraud score threshold for suspicious transactions
      if (fraudScore <= 2) {  // Flag as fraudulent if score is <= 2
        console.log('Suspicious transaction detected!');
        return true;  // Flag as fraud
      } else {
        console.log('Transaction is legitimate.');
        return false;  // Legitimate transaction
      }
    } else {
      console.error('FraudLabs Pro API Error:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('Error sending data to FraudLabs Pro:', error.response ? error.response.data : error.message);
    return false;
  }
}


module.exports = { checkForFraud };
