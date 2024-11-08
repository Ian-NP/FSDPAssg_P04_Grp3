const bcryptjs = require('bcryptjs');
const Account = require("../models/account");
const { database } = require('../firebase');
const { updateBalance: updateAccountBalance } = require('../models/account');
const { sendActiveSessionAlert } = require('../emailService');

// Validation function for request body
const validateRequestBody = (body, requiredFields) => {
    for (const field of requiredFields) {
        if (!body[field] || typeof body[field] !== 'string' || body[field].trim() === '') {
            return `Field "${field}" is required.`;
        }
    }
    return null; // No validation errors
};

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.getAllAccounts();
        res.json(accounts);
    } catch (error) {
        console.error("Error retrieving accounts:", error);
        res.status(500).json({ message: "Error retrieving accounts" });
    }
};

const getAccountById = async (req, res) => {
    const { id } = req.params;

    try {
        const account = await Account.getAccountById(id);
        if (account) {
            return res.json(account);
        }
        return res.status(404).json({ message: "Account not found" });
    } catch (error) {
        console.error("Error retrieving account:", error);
        res.status(500).json({ message: "Error retrieving account" });
    }
};

const getAccountByAccountNum = async (req, res) => {
    const { accountNum } = req.params;

    try {
        const account = await Account.getAccountByAccountNum(accountNum);
        return res.status(200).json(account);
    } catch (error) {
        console.error("Error retrieving account:", error);
        return res.status(404).json({ message: error.message });
    }
};

const loginAccount = async (req, res) => {
    const { account_num, password } = req.body;

    const validationError = validateRequestBody(req.body, ['account_num', 'password']);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const account = await Account.login(account_num, password);
        
        // If login is successful, send an active session alert email
        if (account) {
            await sendActiveSessionAlert(account.account_name, account.email); // Send the email alert
            return res.status(200).json({
                success: true,
                account,
            });
        }

        return res.status(401).json({ message: 'Invalid credentials.' });

    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(401).json({ message: error.message });
    }
};


const createAccount = async (req, res) => {
    const { account_name, email, phoneNo, account_num, account_status, account_type, balance, category, password } = req.body;

    // Validate required fields
    const validationError = validateRequestBody(req.body, ['account_name', 'email', 'phoneNo', 'account_num', 'password']);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        // Call the createAccount method from the model directly
        const account = await Account.createAccount({
            account_name,
            email,
            phoneNo,
            account_num,
            account_status, // This will be validated in the model
            account_type,   // This will be validated in the model
            balance: parseFloat(balance) || 0, // Ensure balance is a number
            category: parseInt(category) || 0, // Ensure category is a number
            password // The plain password will be hashed in the model
        });

        return res.status(201).json({ 
            message: "Account created successfully",
            accountId: account.id,
        });
    } catch (error) {
        console.error("Error creating account:", error.message);
        return res.status(500).json({ message: "Error creating account", error: error.message });
    }
};

const updateBalance = async (req, res) => {
    const { newBalance } = req.body;
    const { accountNum } = req.params;

    if (newBalance === undefined) {
        return res.status(400).json({ message: "New balance is required." });
    }

    try {
        const result = await updateAccountBalance(accountNum, newBalance);
        if (result) {
            return res.status(200).json({ success: true, message: "Balance updated successfully." });
        } else {
            return res.status(404).json({ success: false, message: "No account found with the specified account number." });
        }
    } catch (error) {
        console.error("Error updating balance:", error);
        return res.status(500).json({ message: "Error updating balance.", error: error.message });
    }
};

const deleteAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Account.deleteAccount(id);
        if (result) {
            return res.status(204).send(); // No content
        } else {
            return res.status(404).json({ message: "Account not found." });
        }
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: "Error deleting account" });
    }
};



module.exports = {
    getAllAccounts,
    getAccountById,
    getAccountByAccountNum,
    loginAccount,
    createAccount,
    updateBalance,
    deleteAccount,
};
