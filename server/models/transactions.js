const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactionsController');
const { validateTransactionData } = require('../middlewares/validateTransactions');
const accountController = require('../controllers/accountController');


// Define each route
router.post('/', validateTransactionData, transactionsController.createTransaction);
router.get('/', transactionsController.getAllTransactions);
router.get('/:transactionId', transactionsController.getSpecificTransaction);
router.put('/:id', validateTransactionData, transactionsController.updateTransaction);
router.delete('/:id', transactionsController.deleteTransaction);
router.post('/freeze-account/:accountNum', accountController.freezeAccount); 


module.exports = router;
