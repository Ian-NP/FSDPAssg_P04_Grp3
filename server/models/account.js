const { ref, get, set, push, query, orderByChild, equalTo, remove } = require("firebase/database");
const { database } = require("../firebase"); // Import the initialized database instance

class Account {
  constructor({ account_num, account_status, account_type, balance, category }) {
    this.account_num = account_num || null;
    this.account_status = account_status || 'active' || 'suspended';
    this.account_type = account_type || 'savings' || 'checking' || 'business' ;
    this.balance = balance;
    this.category = category;
  }

  // Method to convert instance to Firebase-compatible JSON
  toFirebase() {
    return {
      account_num: this.account_num,
      account_status: this.account_status,
      account_type: this.account_type,
      balance: this.balance,
      category: this.category,
    };
  }

  static async getAllAccounts() {
    try {
      const accountsRef = ref(database, "account");
      const snapshot = await get(accountsRef); 

      if (snapshot.exists()) {
        const accounts = snapshot.val();
        
        return Object.keys(accounts).map(key => ({ id: key, ...accounts[key] }));
      } 
      else {
        console.log("No accounts available");
      }
    } 
    
    catch (error) {
      console.error("Error retrieving accounts:", error);
      throw new Error("Error retrieving accounts");
    }
  }

  static async getAccountById(id) {
    try {
      const accountsRef = ref(database, `account/${id}`);
      const snapshot = await get(accountsRef);

      if (snapshot.exists()) {
        const account = snapshot.val();
        
        return { id, ...account };  
      }

      else {
        throw new Error("Account not found");
      }    
    }
    catch (error) {
      console.error("Error retrieving account:", error);
      throw new Error("Error retrieving account");
    }
  }


  static async createAccount(accountData) {
      try {
        const accountsRef = ref(database, 'account');

        const newAccountRef = push(accountsRef);

          // Use push to add a new account and generate a unique key
          await set(newAccountRef, accountData); 

          console.log("Account created with ID:", newAccountRef.key);
          return { id: newAccountRef.key };
      } 
      catch (error) {
          console.error("Error adding account:", error);
          throw new Error("Error adding account");
      }
  }


  static async updateBalance(oldBalance, newBalance) {
    try {
        // Reference to the accounts in the database
        const accountsRef = ref(database, 'account'); // Adjust the path to your needs

        // Query to find the accounts with the specific old balance
        const accountsQuery = query(accountsRef, orderByChild('balance'), equalTo(oldBalance));
        const snapshot = await get(accountsQuery); // Fetch the snapshot

        if (snapshot.exists()) {
            const updates = {};

            // Loop through the results and prepare updates
            snapshot.forEach(childSnapshot => {
                const accountId = childSnapshot.key; // Get the unique ID of the account
                updates[`account/${accountId}/balance`] = newBalance; // Update the balance, ensure correct path
            });

            // Now perform the update using the correct reference
            await update(ref(database), updates); // Update with the collected updates object
            console.log("Update successful:", updates); // Log the updates

            return true; // Indicate that the update was successful
        } else {
            console.log("No account with the specified balance was found.");
            return false; // No account found with the specified old balance
        }
    } 
    catch (error) {
        console.error('Error updating balance in database:', error);
        throw error; // Rethrow the error for handling in the controller
    }
}

 
  static async deleteAccount(id) {
    try {
        // Create a reference to the account in the Realtime Database
        const accountDocRef = ref(database, `account/${id}`); 

        // Delete the record
        await remove(accountDocRef);

        return true; // Return true if deletion was successful
    } 
    
    catch (error) {
        console.error("Error deleting account:", error);
        throw new Error("Error deleting account");
    }
  }
}

  


module.exports = Account;
