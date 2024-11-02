const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200
};
const transactionRoutes = require("./models/transactions");

app.use(cors(corsOptions)); 

app.use(express.json());
app.use("/api", transactionRoutes)

//app.get("/api", (req, res) =>{
    //res.json({"fruits": ["apple", "banana", "orange"]});
//})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});