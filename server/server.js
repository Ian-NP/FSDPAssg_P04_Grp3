const express = require('express');
const cors = require('cors');
const accountController = require('./controllers/accountController');
const transactionRoutes = require('./models/transactions'); // Using models/transactions for routes

const app = express();

const corsOptions = {
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount transaction routes at /api/transactions
app.use("/api/transactions", transactionRoutes);

// Account routes
app.get("/api/accounts", accountController.getAllAccounts);
app.get("/api/accounts/firebaseid/:id", accountController.getAccountById);
app.get("/api/accounts/:accountNum", accountController.getAccountByAccountNum);
app.post("/api/accounts/login", accountController.loginAccount);
app.post("/api/accounts/create", accountController.createAccount);
app.put("/api/accounts/updateBalance/:accountNum", accountController.updateBalance);
app.delete("/api/accounts/remove/:id", accountController.deleteAccount);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
