// transactionsController.js
const Account = require('../models/account');
const { sendEmailReceipt } = require('../emailService'); 
const { ref, get, set } = require("firebase/database");
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


const createTransaction = async (req, res) => {
  const transaction = { ...req.body, transaction_date: Date.now() };
  const accountNum = transaction.source_account_id; 

  if (!accountNum) {
      return res.status(400).send({ success: false, message: 'Account number is required.' });
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


// Read all transactions 
const getAllTransactions = async (req, res) => {
  get(ref(database, 'transactions'))
      .then((snapshot) => {
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

// Get specific transaction
const getSpecificTransaction = async (req, res) => {
  const { transactionId } = req.params;
  try {
      const snapshot = await get(ref(database, 'transactions'));
      if (!snapshot.exists()) {
          return res.status(404).send({ message: "No transactions found" });
      }

      let mainTransaction = null;
      const linkedTransactions = [];

      snapshot.forEach(childSnapshot => {
          const transaction = childSnapshot.val();
          const id = childSnapshot.key;

          if (id === transactionId) {
              if (transaction.transaction_date) {
                  transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
              }
              mainTransaction = { id, ...transaction };
          }
          if (mainTransaction && (transaction.destination_account === mainTransaction.source_account_id || 
              transaction.source_account_id === mainTransaction.destination_account)) {
              if (transaction.transaction_date) {
                  transaction.transaction_date = convertTimestampToDateTime(transaction.transaction_date);
              }
              linkedTransactions.push({ id, ...transaction });
          }
      });

      if (!mainTransaction) {
          return res.status(404).send({ message: "Transaction not found" });
      }

      linkedTransactions.push(mainTransaction);
      res.status(200).send(linkedTransactions);
  } catch (error) {
      res.status(500).send(error);
  }
};


// Update a transaction
const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (updatedData.transaction_date) {
      updatedData.transaction_date = convertTimestampToDateTime(updatedData.transaction_date);
  }

  update(ref(database, `transactions/${id}`), updatedData)
      .then(() => res.status(200).send({ id, ...updatedData }))
      .catch((error) => res.status(500).send(error));
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  remove(ref(database, `transactions/${id}`))
      .then(() => {
          res.status(200).send({ message: 'Transaction has been deleted.' });
      })
      .catch((error) => {
          res.status(500).send({ error: 'An error occurred while deleting the transaction.' });
      });
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getSpecificTransaction,
    updateTransaction,
    deleteTransaction,
  };
  