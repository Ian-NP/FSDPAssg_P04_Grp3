// transactionRoutes.js
const express = require('express');
const router = express.Router();
const { database, ref, push, set, get, update, remove } = require('../firebase.js');

// Create a transaction
//router.post('/transactions', (req, res) => {
//  const transaction = req.body;
//  const newTransactionRef = push(ref(database, 'transactions'));

//  set(newTransactionRef, transaction)
 //     .then(() => res.status(201).send({ id: newTransactionRef.key, ...transaction }))
 //     .catch((error) => res.status(500).send(error));
//});

// Create a transaction
router.post('/transactions', async (req, res) => {
  const transaction = req.body;

  try {
    // Retrieve all existing transactions to count them
    const snapshot = await get(ref(database, 'transactions'));
    const transactionCount = snapshot.size || 0;

    // Generate a custom key
    const customKey = `transaction_id_${transactionCount + 1}`;

    // Set the transaction with the custom key
    await set(ref(database, `transactions/${customKey}`), transaction);

    res.status(201).send({ id: customKey, ...transaction });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read all transactions 
router.get('/transactions', (req, res) => {
  get(ref(database, 'transactions'))
      .then((snapshot) => {
          if (snapshot.exists()) {
              const transactions = [];
              snapshot.forEach(childSnapshot => {
                  transactions.push({ id: childSnapshot.key, ...childSnapshot.val() });
              });
              res.status(200).send(transactions);
          } else {
              res.status(404).send({ message: "No transactions found" });
          }
      })
      .catch((error) => res.status(500).send(error));
});

// Update a transaction
router.put('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  update(ref(database, `transactions/${id}`), updatedData)
      .then(() => res.status(200).send({ id, ...updatedData }))
      .catch((error) => res.status(500).send(error));
});

// Delete a transaction
router.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;

  remove(ref(database, `transactions/${id}`))
      .then(() => {
        res.status(200).send({message: 'Transaction has been deleted.'});
      })
      .catch((error) => {
        res.status(500).send({error: 'An error occurred while deleting the transaction.'})
      });
});

module.exports = router;