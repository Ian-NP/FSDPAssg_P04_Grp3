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
 * @param {string} transactionType - The type of transaction (e.g., withdrawal, deposit)
 */
const sendEmailReceipt = async (userName, userEmail, transactionId, amount, transactionDate, transactionType) => {
    let subject = `Receipt for ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}: #${transactionId}`;
    let text = `Dear ${userName},\n\nThank you for using our service. Here are the details of your recent ${transactionType}:\n\n` +
               `Transaction ID: #${transactionId}\n` + // This will now just be the number
               `Amount: $${amount}\n` +
               `Date: ${new Date(transactionDate).toLocaleString()}\n\n` +
               `If you have any questions, feel free to reach out to our support team.\n\n` +
               `Best regards,\nYour ATM Team`;

    if (transactionType === 'withdrawal') {
        text += `\n\nNote: Ensure you keep your cash safe after the transaction.`;
    } else if (transactionType === 'deposit') {
        text += `\n\nNote: Please check your balance after the deposit for confirmation.`;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: subject,
        text: text
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
