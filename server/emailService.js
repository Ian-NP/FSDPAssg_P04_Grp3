// emailService.js
require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');

// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use environment variable for email
        pass: process.env.EMAIL_PASS  // Use environment variable for password
    }
});

/**
 * Send an email receipt
 * @param {string} userEmail - The recipient's email address
 * @param {string} transactionId - The ID of the transaction
 * @param {number} amount - The amount of the transaction
 * @param {Date} transactionDate - The date of the transaction
 */
const sendEmailReceipt = async (userEmail, transactionId, amount, transactionDate) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Use environment variable for sender email
        to: userEmail,
        subject: 'Your ATM Receipt',
        text: `Transaction ID: ${transactionId}\nAmount: ${amount}\nDate: ${transactionDate}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", userEmail);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
};

module.exports = { sendEmailReceipt };
