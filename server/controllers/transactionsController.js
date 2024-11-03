// transaction.js
const express = require('express');
const { getDatabase, update, ref, get, set, push, query, orderByChild, equalTo, remove } = require("firebase/database");
const { database } = require('../firebase.js');

// Helper function to convert milliseconds to readable datetime
const convertTimestampToDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString(); // You can customize the format if needed
};

// Create a transaction
//router.post('/transactions', (req, res) => {
//  const transaction = req.body;
//  const newTransactionRef = push(ref(database, 'transactions'));

//  set(newTransactionRef, transaction)
 //     .then(() => res.status(201).send({ id: newTransactionRef.key, ...transaction }))
 //     .catch((error) => res.status(500).send(error));
//});

// Create a transaction
exports.createTransaction = async (req, res) => {
  const transaction = { ...req.body, transaction_date: Date.now() };

  try {
      // Retrieve all existing transactions to count them
      const snapshot = await get(ref(database, 'transactions'));
      const transactionCount = snapshot.size || 0;

      // Generate a custom key
      const customKey = `transaction_id_${transactionCount + 1}`;

      // Set the transaction with the custom key
      await set(ref(database, `transactions/${customKey}`), transaction);

      // Respond with success status and transaction details
      res.status(201).send({
          success: true,
          id: customKey,
          ...transaction,
          transaction_date: convertTimestampToDateTime(transaction.transaction_date)
      });
  } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(500).send({
          success: false,
          message: "An error occurred while creating the transaction."
      });
  }
};

// Read all transactions 
exports.getAllTransactions = async (req, res) => {
  get(ref(database, 'transactions'))
      .then((snapshot) => {
          if (snapshot.exists()) {
              const transactions = [];
              snapshot.forEach(childSnapshot => {
                const transaction = childSnapshot.val();
                // Convert transaction_date if it exists
                if (transaction.transaction_date) {
                  transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
                }
                transactions.push({ id: childSnapshot.key, ...transaction });
            });
            res.status(200).send(transactions);
          } else {
            res.status(404).send({ message: "No transactions found" });
          }
      })
      .catch((error) => res.status(500).send(error));
};

// // Get specific transactions based on source and destination account IDs
// exports.getSpecificTransactions = async (req, res) => {
//   const { sourceAccountId1, destinationAccount1, sourceAccountId2, destinationAccount2 } = req.query;

//   try {
//     // Fetch all transactions from the database
//     const snapshot = await get(ref(database, 'transactions'));

//     if (!snapshot.exists()) {
//       return res.status(404).send({ message: "No transactions found" });
//     }

//     const transactions = [];
//     snapshot.forEach(childSnapshot => {
//       const transaction = childSnapshot.val();
//       const transactionId = childSnapshot.key;

//       // Check for the two specific transactions based on the provided parameters
//       if (
//         (transaction.source_account_id === parseInt(sourceAccountId1) && transaction.destination_account === parseInt(destinationAccount1)) ||
//         (transaction.source_account_id === parseInt(sourceAccountId2) && transaction.destination_account === parseInt(destinationAccount2))
//       ) {
//         // Convert transaction_date if it exists
//         if (transaction.transaction_date) {
//           transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
//         }
//         transactions.push({ id: transactionId, ...transaction });
//       }
//     });

//     // Check if both transactions were found
//     if (transactions.length === 2) {
//       res.status(200).send(transactions);
//     } else {
//       res.status(404).send({ message: "One or both transactions not found" });
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// };

// Get specific transactions based on transaction ID and linked destination accounts
exports.getSpecificTransaction = async (req, res) => {
  const { transactionId } = req.params;

  try {
    // Fetch all transactions from the database
    const snapshot = await get(ref(database, 'transactions'));

    if (!snapshot.exists()) {
      return res.status(404).send({ message: "No transactions found" });
    }

    let mainTransaction = null;
    const linkedTransactions = [];

    snapshot.forEach(childSnapshot => {
      const transaction = childSnapshot.val();
      const id = childSnapshot.key;

      // Check if the current transaction matches the requested transaction ID
      if (id === transactionId) {
        // Convert transaction_date if it exists
        if (transaction.transaction_date) {
          transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
        }
        mainTransaction = { id, ...transaction };
      }

      // Check for linked transaction based on destination accounts
      if (mainTransaction && (transaction.destination_account === mainTransaction.source_account_id || 
          transaction.source_account_id === mainTransaction.destination_account)) {
        // Convert transaction_date if it exists
        if (transaction.transaction_date) {
          transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
        }
        linkedTransactions.push({ id, ...transaction });
      }
    });

    // Check if the main transaction was found
    if (!mainTransaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    // Include the main transaction in the output
    linkedTransactions.push(mainTransaction);

    res.status(200).send(linkedTransactions);
  } catch (error) {
    res.status(500).send(error);
  }
};



// Update a transaction
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  // If updatedData has a transaction_date, ensure it's in datetime format
  if (updatedData.transaction_date) {
    updatedData.transaction_date = convertTimestampToDateTime(updatedData.transaction_date);
  }

  update(ref(database, `transactions/${id}`), updatedData)
      .then(() => res.status(200).send({ id, ...updatedData }))
      .catch((error) => res.status(500).send(error));
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  remove(ref(database, `transactions/${id}`))
      .then(() => {
        res.status(200).send({message: 'Transaction has been deleted.'});
      })
      .catch((error) => {
        res.status(500).send({error: 'An error occurred while deleting the transaction.'})
      });
};