// transaction.js
const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const { validateTransactionData } = require('../middlewares/validateTransactions');

router.post('/transactions', validateTransactionData, transactionsController.createTransaction);
router.get('/transactions', transactionsController.getAllTransactions);
router.get('/transactions/:transactionId', transactionsController.getSpecificTransaction); // Define the route to get specific transactions
router.put('/transactions/:id', validateTransactionData, transactionsController.updateTransaction);
router.delete('/transactions/:id', transactionsController.deleteTransaction);

module.exports = router;