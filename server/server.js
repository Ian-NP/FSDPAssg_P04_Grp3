const express = require('express');
const app = express();
const cors = require('cors');


const accountController = require('./controllers/accountController');

const corsOptions = {
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200
};
const transactionRoutes = require("./models/transactions");

app.use(cors(corsOptions)); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", transactionRoutes)

app.get("/Accounts", accountController.getAllAccounts);
app.get("/Accounts/:id", accountController.getAccountById);
app.post('/Accounts/create', accountController.createAccount);
app.put("/Accounts/balance/:id", accountController.updateBalance);
app.delete("/Accounts/remove/:id", accountController.deleteAccount);

//app.get("/api", (req, res) =>{
    //res.json({"fruits": ["apple", "banana", "orange"]});
//})

//app.listen(3001, () => {
//    console.log("Server is running on port 3001");
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});