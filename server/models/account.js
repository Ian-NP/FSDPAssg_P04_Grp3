const { getDatabase, update, ref, get, set, push, query, orderByChild, equalTo, remove } = require("firebase/database");
const { database } = require("../firebase"); // Import the initialized database instance
const bcryptjs = require('bcryptjs');

// Define constants for account statuses and types
const ACCOUNT_STATUSES = ['active', 'suspended', 'closed'];
const ACCOUNT_TYPES = ['savings', 'checking', 'business'];

class Account {
    constructor({ account_name, email, phoneNo, account_num, account_status = 'active', account_type = 'savings', balance = 0, category, password }) {
        this.account_name = account_name;
        this.email = email;
        this.phoneNo = phoneNo;
        this.account_num = account_num;
        this.account_status = Account.validateAccountStatus(account_status); // Use Account to call static method
        this.account_type = Account.validateAccountType(account_type); // Use Account to call static method
        this.balance = balance; // Ensure balance is a number
        this.category = category;
        this.password = password; // Store password securely (hashed)
    }

    // Validate the account status
    static validateAccountStatus(status) {
        if (!ACCOUNT_STATUSES.includes(status)) {
            throw new Error(`Invalid account status: ${status}. Must be one of: ${ACCOUNT_STATUSES.join(', ')}`);
        }
        return status;
    }

    // Validate the account type
    static validateAccountType(type) {
        if (!ACCOUNT_TYPES.includes(type)) {
            throw new Error(`Invalid account type: ${type}. Must be one of: ${ACCOUNT_TYPES.join(', ')}`);
        }
        return type;
    }

    // Method to convert instance to Firebase-compatible JSON
    toFirebase() {
        return {
            account_name: this.account_name,
            email: this.email,
            phoneNo: this.phoneNo,
            account_num: this.account_num,
            account_status: this.account_status,
            account_type: this.account_type,
            balance: this.balance,
            category: this.category,
            password: this.password, // Include password (ensure it is hashed before storing)
        };
    }

    // Retrieve all accounts
    static async getAllAccounts() {
        try {
            const accountsRef = ref(database, "account");
            const snapshot = await get(accountsRef);

            if (snapshot.exists()) {
                const accounts = snapshot.val();
                return Object.keys(accounts).map(key => ({ id: key, ...accounts[key] }));
            } else {
                console.log("No accounts available");
                return []; // Return an empty array if no accounts are found
            }
        } catch (error) {
            console.error("Error retrieving accounts:", error.message);
            throw new Error("Error retrieving accounts");
        }
    }

    // Retrieve an account by its ID
    static async getAccountById(id) {
        try {
            const accountRef = ref(database, `account/${id}`);
            const snapshot = await get(accountRef);

            if (snapshot.exists()) {
                const account = snapshot.val();
                return { id, ...account };
            } else {
                throw new Error("Account not found");
            }
        } catch (error) {
            console.error("Error retrieving account:", error.message);
            throw new Error("Error retrieving account");
        }
    }

    // Retrieve an account by its account number
    static async getAccountByAccountNum(accountNum) {
        try {
            const accountQuery = query(ref(database, 'account'), orderByChild('account_num'), equalTo(accountNum));
            const snapshot = await get(accountQuery);

            if (snapshot.exists()) {
                const accountData = snapshot.val();
                const accountId = Object.keys(accountData)[0];
                return { id: accountId, ...accountData[accountId] };
            } else {
                throw new Error("Account not found");
            }
        } catch (error) {
            console.error("Error retrieving account:", error.message);
            throw new Error("Error retrieving account");
        }
    }

    // Login method using getAccountByAccountNum
    static async login(accountNum, password) {
        try {
            const account = await this.getAccountByAccountNum(accountNum);
            const isPasswordValid = await bcryptjs.compare(password, account.password);

            if (isPasswordValid) {
                return account; // Return account details on successful login
            } else {
                throw new Error("Invalid password");
            }
        } catch (error) {
            console.error("Error logging in:", error.message);
            throw new Error("Error logging in");
        }
    }

    // Create a new account
    static async createAccount(accountData) {
        try {
            // Validate account data
            const { account_name, email, phoneNo, account_num, account_status, account_type, balance, category, password } = accountData;

            console.log("Creating account with data:", accountData);

            // Check for required fields
            if (
                account_num === undefined || 
                category === undefined || 
                account_name === undefined || 
                email === undefined || 
                phoneNo === undefined || 
                password === undefined
            ) {
                throw new Error("All fields including account number, category, account name, email, phone number, and password are required.");
            }

            // Validate account status and type using existing methods
            const validatedAccountStatus = Account.validateAccountStatus(account_status);
            const validatedAccountType = Account.validateAccountType(account_type);

            // Hash the password with bcrypt
            const hashedPassword = await bcryptjs.hash(password, 10);

            // Create a new account instance
            const newAccount = new Account({
                account_name,
                email,
                phoneNo,
                account_num,
                account_status: validatedAccountStatus,
                account_type: validatedAccountType,
                balance: parseFloat(balance), // Ensure balance is a number
                category: parseInt(category), // Ensure category is a number
                password: hashedPassword, // Store the hashed password
            });

            const accountsRef = ref(database, 'account');
            const newAccountRef = push(accountsRef);

            // Save the new account to the database
            await set(newAccountRef, newAccount.toFirebase());
            console.log("Account created with ID:", newAccountRef.key);
            return { id: newAccountRef.key };
        } catch (error) {
            console.error("Error creating account:", error.message);
            throw new Error("Error adding account: " + error.message); // Provide more detail on the error
        }
    }

    // Update account balance
    static async updateBalance(accountNum, newBalance) {
        try {
            const accountQuery = query(ref(database, 'account'), orderByChild('account_num'), equalTo(accountNum));
            const snapshot = await get(accountQuery);

            if (snapshot.exists()) {
                const accountKey = Object.keys(snapshot.val())[0];
                await update(ref(database, `account/${accountKey}`), { balance: newBalance });
                console.log("Balance updated successfully.");
                return true;
            } else {
                console.log("Account not found");
                return false;
            }
        } catch (error) {
            console.error("Error updating balance:", error.message);
            throw new Error("Error updating balance");
        }
    }

    // Delete an account
    static async deleteAccount(id) {
        try {
            const accountDocRef = ref(database, `account/${id}`);
            await remove(accountDocRef);
            console.log("Account deleted successfully.");
            return true;
        } catch (error) {
            console.error("Error deleting account:", error.message);
            throw new Error("Error deleting account");
        }
    }
}

module.exports = Account;
