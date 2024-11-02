const bcryptjs = require('bcryptjs');
const Account = require("../models/account");
const { database } = require('../firebase');
const { updateBalance: updateAccountBalance } 
= require('../models/account');


const getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.getAllAccounts();
    res.json(accounts);
  } 
  
  catch (error) {
    console.error("Error retrieving accounts:", error);
    res.status(500).send("Error retrieving accounts");
  }
};

const getAccountById = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Account.getAccountById(id);
    
    if (account) {
      res.json(account);
    }

    else {
      res.status(400).send("Account not found");
    }
  }

  catch (error) {
    console.error("Error retrieving accounts:", error);
    res.status(500).send("Error retrieving accounts");
  }
}

const createAccount = async (req, res) => {
  const { account_num, account_status, account_type, balance, category, password } = req.body;

  // Check if password is provided and is a non-empty string
  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    // Hash the password with bcrypt
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create the account object with the new account ID
    const newAccount = {
      account_num,
      account_status,
      account_type,
      balance,
      category,
      password : hashedPassword
    };

    // Store the account in the database
    const account = await Account.createAccount(newAccount);

    if (!account) {
      console.error("Failed to retrieve account data after creation.");
      return res.status(500).json({ message: "User creation failed. Account data is missing." });
    }

    res.status(201).json({ 
      message: "Account created successfully",
      
    });
  } 
  catch (error) {
    console.error("Error creating account:", error.message);
    return res.status(500).json({ message: "Error creating account", error: error.message });
  }
};


const updateBalance = async (req, res) => {
  const { oldBalance, newBalance } = req.body;

  // Validate input
  if (oldBalance === undefined || newBalance === undefined) {
      return res.status(400).json({ message: "Old balance and new balance are required." });
  }

  try {
      const result = await updateAccountBalance(oldBalance, newBalance); // Call the model function

      if (result) {
          return res.status(200).json({ message: "Balance updated successfully." });
      } else {
          return res.status(404).json({ message: "No account found with the specified old balance." });
      }
  } 
  
  catch (error) {
      console.error("Error in updateBalance controller:", error);
      return res.status(500).json({ message: "Error updating balance.", error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Account.deleteAccount(id);

      if (!result) {
        return res.status(204).send();
      }
      else {
        return res.status(404).json({ 
          message: "Account is deleted!" });
      }
    }
    catch (error) {
      console.error(error);
      res.status(500).send("Error deleting account");
    }
}



module.exports = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateBalance,
  deleteAccount
};
