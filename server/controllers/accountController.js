const bcryptjs = require('bcryptjs');
const Account = require("../models/account");
const { database } = require('../firebase');
const { get, ref, update } = require("firebase/database");
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

const getAccountByAccountNum = async (accountNum) => {
    console.log(`Searching for account number: "${accountNum}"`); // Log the search
    const snapshot = await get(ref(database, 'account')); // Ensure you're querying the right path
    
    if (!snapshot.exists()) {
        throw new Error("No accounts found");
    }

    let account;
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        console.log(`Checking account: ${data.account_num}`); // Log each account number for debugging
        if (data.account_num === accountNum) {
            account = { id: childSnapshot.key, ...data }; // Include the document key
        }
    });

    if (!account) {
        console.log(`Account not found for: "${accountNum}"`); // Log if not found
        throw new Error("Account not found");
    }

    return account; // Return the found account
};


const loginAccount = async (req, res) => {
    const { account_num, password } = req.body;

    const validationError = validateRequestBody(req.body, ['account_num', 'password']);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const accountRef = ref(database, 'account');
        const snapshot = await get(accountRef);

        let account = null;
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            if (data.account_num === account_num) {
                account = { id: childSnapshot.key, ...data };
            }
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check if the account is frozen
        if (account.account_status === 'frozen') {
            return res.status(403).json({ message: 'Your account is frozen. Please contact support.' });
        }

        // Check if the password is correct
        const isPasswordValid = await bcryptjs.compare(password, account.password);

        if (isPasswordValid) {
            // Reset failed attempts to 0 upon successful login
            await update(ref(database, `account/${account.id}`), {
                failed_attempts: 0,
            });

            // Send the active session alert email here
            try {
                await sendActiveSessionAlert(account.account_name, account.email, account.account_num);
                console.log("Email sent successfully");
            } catch (emailError) {
                console.error("Error sending email:", emailError);
            }

            return res.status(200).json({
                success: true,
                account,
            });
        } else {
            // Increment failed attempts
            const failedAttempts = (account.failed_attempts || 0) + 1;

            if (failedAttempts >= 4) {
                // Freeze account after 4 failed attempts
                await update(ref(database, `account/${account.id}`), {
                    failed_attempts: failedAttempts,
                    account_status: 'frozen',
                });

                return res.status(403).json({ message: 'Your account is now frozen due to too many failed login attempts.' });
            } else {
                // Update failed attempts
                await update(ref(database, `account/${account.id}`), {
                    failed_attempts: failedAttempts,
                });

                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        }
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

const freezeAccount = async (req, res) => {
    const { accountNum } = req.params;

    console.log(`Request to freeze account: "${accountNum}"`); // Log the incoming account number

    try {
        // Retrieve the account from the database
        const account = await getAccountByAccountNum(accountNum);
        if (!account) {
            return res.status(404).json({ message: "Account not found." });
        }

        // Update the account status to frozen
        account.account_status = 'frozen';
        await updateAccountInDatabase(account); // Update the account in the database

        return res.status(200).json({ message: "Account has been frozen successfully." });
    } catch (error) {
        console.error("Error freezing account:", error);
        return res.status(500).json({ message: "Error freezing account.", error: error.message });
    }
};

// Function to update the account in your database
const updateAccountInDatabase = async (account) => {
    // This should contain the logic to update the account in your database
    await update(ref(database, `account/${account.id}`), { // Update to the right path
        account_status: account.account_status,
    });
};




module.exports = {
    getAllAccounts,
    getAccountById,
    getAccountByAccountNum,
    loginAccount,
    createAccount,
    updateBalance,
    deleteAccount,
    freezeAccount,
};
