const express = require('express');
const cors = require('cors');
const accountController = require('./controllers/accountController');
const transactionRoutes = require('./models/transactions'); // Ensure this points to your routes file

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the transaction routes
app.use("/api", transactionRoutes); // This automatically includes your defined transaction routes

// Add your account routes
app.get("/api/Accounts", accountController.getAllAccounts);
app.get("/api/Accounts/firebaseid/:id", accountController.getAccountById);
app.get("/api/Accounts/:accountNum", accountController.getAccountByAccountNum);
app.post("/api/Accounts/login", accountController.loginAccount);
app.post("/api/Accounts/create", accountController.createAccount);
app.put("/api/Accounts/updateBalance/:accountNum", accountController.updateBalance);
app.delete("/api/Accounts/remove/:id", accountController.deleteAccount);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
