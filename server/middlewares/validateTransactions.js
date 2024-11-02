// validateTransactions.js
exports.validateTransactionData = (req, res, next) => {
    const { amount, transaction_type } = req.body;
    
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).send({ error: 'Amount should be a positive number.' });
    }
    
    if (!transaction_type || (transaction_type !== 'deposit' && transaction_type !== 'withdrawal')) {
      return res.status(400).send({ error: 'Transaction type must be either "deposit" or "withdrawal".' });
    }
  
    next();
};
  