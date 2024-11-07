const Account = require('../models/account');
const { sendEmailReceipt } = require('../emailService'); 
const { ref, get, set, update, remove } = require("firebase/database");
const { database } = require('../firebase.js');

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
        const transactionCount = snapshot.size || 0;
        const customKey = `transaction_id_${transactionCount + 1}`;

        await set(ref(database, `transactions/${customKey}`), transaction);

        const accountDetails = await Account.getAccountByAccountNum(accountNum);
        if (!accountDetails) {
            return res.status(404).send({ success: false, message: 'Account not found.' });
        }

        const userEmail = accountDetails.email; 

        // Check if we need to send an email receipt
        if (req.body.sendReceipt === 'email') {
            try {
                await sendEmailReceipt(userEmail, customKey, transaction.amount, convertTimestampToDateTime(transaction.transaction_date));
            } catch (emailError) {
                return res.status(500).send({
                    success: false,
                    message: "Failed to send email receipt.",
                    error: emailError.message
                });
            }
        }

        res.status(201).send({
            success: true,
            id: customKey,
            ...transaction,
            transaction_date: convertTimestampToDateTime(transaction.transaction_date)
        });
    } catch (error) {
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

module.exports = {
    createTransaction,
    getAllTransactions,
    getSpecificTransaction,
    updateTransaction,
    deleteTransaction,
};
