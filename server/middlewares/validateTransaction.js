const validateTransactionData = (req, res, next) => {
    const { source_account_id, amount } = req.body;
    if (!source_account_id || !amount) {
        return res.status(400).send({ message: 'Source account ID and amount are required.' });
    }
    next(); // Call next middleware or route handler if validation passes
};

module.exports = { validateTransactionData };
