const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: ["http://localhost:5173"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); 

app.get("/api", (req, res) =>{
    res.json({"fruits": ["apple", "banana", "orange"]});
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
