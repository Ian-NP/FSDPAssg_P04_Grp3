// transaction.js
const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const transactionsController = require('../controllers/transactionsController');
const { validateTransactionData } = require('../middlewares/validateTransactions');
=======
const { getDatabase, update, ref, get, set, push, query, orderByChild, equalTo, remove } = require("firebase/database");
const { database } = require('../firebase.js');
>>>>>>> 0acf7dd04ca5b53e38f374f418fa1a9ca47467e9

router.post('/transactions', validateTransactionData, transactionsController.createTransaction);
router.get('/transactions', transactionsController.getAllTransactions);
router.get('/transactions/:transactionId', transactionsController.getSpecificTransaction); // Define the route to get specific transactions
router.put('/transactions/:id', validateTransactionData, transactionsController.updateTransaction);
router.delete('/transactions/:id', transactionsController.deleteTransaction);

module.exports = router;