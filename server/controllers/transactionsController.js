const Account = require('../models/account');
const { sendEmailReceipt } = require('../emailService'); 
const { ref, get, set, update, remove } = require("firebase/database");
const { database } = require('../firebase.js');

// THIS CLASS IS ONLY NEEDED FOR ME (IAN)
class Transaction {
    constructor({
        id,
        amount,
        email,
        sendReceipt,
        source_account_id,
        transaction_date,
        transaction_type,
        category
    }) {
        this.id = id; // Unique transaction ID
        this.amount = amount; // Amount of the transaction
        this.email = email; // Email associated with the transaction
        this.sendReceipt = sendReceipt; // Indicates if a receipt should be sent
        this.source_account_id = source_account_id; // The account number of the source account
        this.transaction_date = transaction_date; // Date of the transaction in timestamp format
        this.transaction_type = transaction_type; // Type of transaction (e.g., withdrawal, deposit)
        this.category = category; // Category of the transaction (e.g., dining, shopping)
    }

    static convertTimestampToDateTime(timestamp) {
        const date = new Date(timestamp);
        return date.toISOString();
    }

    static validateTransaction(transaction) {
        const requiredFields = [
            'id', 'amount', 'email', 'source_account_id',
            'transaction_date', 'transaction_type', 'category'
        ];
        
        for (const field of requiredFields) {
            if (!transaction[field] && transaction[field] !== 0) {
                throw new Error(`${field} is required.`);
            }
        }
    }
}

const convertTimestampToDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString();
};

const createTransaction = async (req, res) => {
    const transaction = { ...req.body, transaction_date: Date.now() };
    const accountNum = transaction.source_account_id; 

    if (!accountNum) {
        return res.status(400).send({ success: false, message: 'Account number is required.' });
    }

    if (!transaction.transaction_type) {
        return res.status(400).send({ success: false, message: 'Transaction type is required.' });
    }

    try {
        const snapshot = await get(ref(database, 'transactions'));
        const transactionCount = snapshot.size || 0; // Get the count of existing transactions
        const customKey = transactionCount + 1; // Increment ID by one

        // Prepare the transaction data with the new ID
        await set(ref(database, `transactions/${customKey}`), {
            ...transaction,
            id: customKey // Store the ID as part of the transaction data
        });

        const accountDetails = await Account.getAccountByAccountNum(accountNum);
        if (!accountDetails) {
            return res.status(404).send({ success: false, message: 'Account not found.' });
        }

        const userEmail = accountDetails.email; 
        const userName = accountDetails.account_name; 

        // Check if we need to send an email receipt
        if (req.body.sendReceipt === 'email') {
            try {
                await sendEmailReceipt(userName, userEmail, customKey, transaction.amount, convertTimestampToDateTime(transaction.transaction_date), transaction.transaction_type);
            } catch (emailError) {
                console.error("Failed to send email receipt:", emailError);
                return res.status(500).send({
                    success: false,
                    message: "Failed to send email receipt.",
                    error: emailError.message
                });
            }
        }

        res.status(201).send({
            success: true,
            id: customKey, // Return the simple numeric ID
            ...transaction,
            transaction_date: convertTimestampToDateTime(transaction.transaction_date)
        });
    } catch (error) {
        console.error("An error occurred while creating the transaction:", error);
        res.status(500).send({
            success: false,
            message: "An error occurred while creating the transaction.",
            error: error.message
        });
    }
};




const getAllTransactions = async (req, res) => {
    try {
        const snapshot = await get(ref(database, 'transactions'));
        if (snapshot.exists()) {
            const transactions = [];
            snapshot.forEach(childSnapshot => {
                const transaction = childSnapshot.val();
                if (transaction.transaction_date) {
                    transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
                }
                transactions.push({ id: childSnapshot.key, ...transaction });
            });
            res.status(200).send(transactions);
        } else {
            res.status(404).send({ message: "No transactions found" });
        }
    } catch (error) {
        res.status(500).send(error);
    }
};

const getSpecificTransaction = async (req, res) => {
    const { transactionId } = req.params;
    try {
        const snapshot = await get(ref(database, `transactions/${transactionId}`));
        if (!snapshot.exists()) {
            return res.status(404).send({ message: "Transaction not found" });
        }
        const transaction = snapshot.val();
        transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
        res.status(200).send(transaction);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    if (updatedData.transaction_date) {
        updatedData.transaction_date = convertTimestampToDateTime(updatedData.transaction_date);
    }

    try {
        await update(ref(database, `transactions/${id}`), updatedData);
        res.status(200).send({ id, ...updatedData });
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        await remove(ref(database, `transactions/${id}`));
        res.status(200).send({ message: 'Transaction has been deleted.' });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while deleting the transaction.' });
    }
};

const getTransactionsByAccountNumForSixMonths = async (req, res) => {
    const { accountNum } = req.params;
    if (accountNum === undefined || accountNum === null) {
        accountNum = "4111 1111 1111 1111"
    }
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const sixMonthsAgoTimestamp = sixMonthsAgo.getTime();

    try {
        const snapshot = await get(ref(database, 'transactions'));
        if (snapshot.exists()) {
            const transactions = [];
            snapshot.forEach(childSnapshot => {
                const transaction = childSnapshot.val();
                const transactionId = parseInt(childSnapshot.key, 10);

                if (
                    transaction.source_account_id === accountNum &&
                    transaction.transaction_date >= sixMonthsAgoTimestamp &&
                    transaction.id <= 210
                ) {
                    transaction.transaction_date = Transaction.convertTimestampToDateTime(transaction.transaction_date);
                    transactions.push({ id: childSnapshot.key, ...transaction });
                }
            });

            if (transactions.length > 0) {
                res.status(200).send(transactions);
            } else {
                res.status(404).send({ message: "No transactions found for this account in the past 6 months with an ID <= 185." });
            }
        } else {
            res.status(404).send({ message: "No transactions found." });
        }
    } catch (error) {
        console.error("An error occurred while retrieving transactions:", error);
        res.status(500).send({
            success: false,
            message: "An error occurred while retrieving transactions.",
            error: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getSpecificTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionsByAccountNumForSixMonths
};