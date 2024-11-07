// testEmail.js
require('dotenv').config(); // Load environment variables
const nodemailer = require('nodemailer');

console.log("Email User:", process.env.EMAIL_USER); // Log your email user
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded"); // Check if pass is loaded


// Configure the Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your email password or App Password
    }
});

async function testEmail() {
    const testMailOptions = {
        from: process.env.EMAIL_USER,
        to: 'shiyingtam06@gmail.com', // Replace with a test recipient
        subject: 'Test Email',
        text: 'This is a test email to check SMTP configuration.'
    };

    try {
        await transporter.sendMail(testMailOptions);
        console.log("Test email sent successfully.");
    } catch (error) {
        console.error("Failed to send test email:", error);
    }
}

testEmail();
