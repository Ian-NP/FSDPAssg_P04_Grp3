process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique filenames
const accountController = require('./controllers/accountController');
const transactionRoutes = require('./models/transactions');
const transactionsController = require('./controllers/transactionsController');
const ATMController = require('./controllers/atmController');
const analyzeSpendingAndAdvice = require('./SpendingHabitsAnalysis');
const { getActionCommand } = require('./voiceCommandGeneration');
const faceDescriptorsController = require('./controllers/faceDescriptorController');

const app = express();

// const corsOptions = {
//     origin: ["http://localhost:5173", "http://192.168.50.19:5173"],
//     optionsSuccessStatus: 200
// };

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Serve static files from the "downloads" directory
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Mount transaction routes at /api/transactions
app.use("/api/transactions", transactionRoutes);

// Account routes
app.get("/api/accounts", accountController.getAllAccounts);
app.get("/api/accounts/firebaseid/:id", accountController.getAccountById);
app.get("/api/accounts/userId/:userId", accountController.getAccountsByUserId);
app.get("/api/accounts/:accountNum", accountController.getAccountByAccountNum);
app.post("/api/accounts/login", accountController.loginAccount);
app.post("/api/accounts/create", accountController.createAccount);
app.put("/api/accounts/updateBalance/:accountNum", accountController.updateBalance);
app.delete("/api/accounts/remove/:id", accountController.deleteAccount);

// ATM routes
app.get("/api/atm/:atmId", ATMController.getATMDetails);
app.put("/api/atm/:atmId", ATMController.updateATMNotes);
app.post("/api/atm/create", ATMController.createATM);
app.get("/api/atm/:atmId/nearestAtm", ATMController.getNearestOCBCATM);


// FaceDescriptors Routes
app.get("/api/getFaceDescriptors", faceDescriptorsController.getAllFaceIDsController);
app.post("/api/registerFace", faceDescriptorsController.createFaceIDController);
app.put("/api/updateFaceDescriptor/:faceId", faceDescriptorsController.updateFaceIDController);

// Function to get the local IP address
const getLocalIpAddress = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const netInterface of interfaces) {
            if (netInterface.family === 'IPv4' && !netInterface.internal) {
                return netInterface.address;
            }
        }
    }
    return 'localhost'; // Fallback
};

// Route for handling PDF upload with unique filename
app.post('/api/upload-pdf', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let pdfFile = req.files.pdfFile;
    const uploadDir = path.join(__dirname, 'downloads');

    // Create the "downloads" directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    // Generate a unique filename using UUID and the original file extension
    const uniqueFilename = `${path.parse(pdfFile.name).name}-${uuidv4()}${path.extname(pdfFile.name)}`;
    const uploadPath = path.join(uploadDir, uniqueFilename);

    // Save the file with the unique name
    pdfFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Get the local IP address and send the accessible URL
        const localIp = analyzeSpendingAndAdvice.getThirdNetworkAddress() || getLocalIpAddress();
        res.send({ pdfUrl: `${localIp}:3000/downloads/${uniqueFilename}` });
    });
});

app.post('/api/analyze-spending', async (req, res) => {
    const { transactionData } = req.body;
    try {
      const result = await analyzeSpendingAndAdvice.analyzeSpendingAndAdvice(transactionData);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  
// Voice Command Generation
app.post("/api/voiceCommandGeneration", async (req, res) => {
    const { userResponse } = req.body;
    try {
      const result = await getActionCommand(userResponse);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
