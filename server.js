const express = require('express');
const bodyParser = require('body-parser');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files

// Store user data
app.post('/submit', (req, res) => {
    const userData = {
        name: req.body.name,
        contact: req.body.contact,
        email: req.body.email,
        address: req.body.address,
        aadhar: req.body.aadhar,
        pan: req.body.pan
    };

    // Save data to a JSON file
    fs.writeFileSync('data.json', JSON.stringify(userData, null, 2));

    // Generate a QR code that links to /view
    const qrCode = qr.imageSync(`http://localhost:${PORT}/view`, { type: 'png' });
    fs.writeFileSync('public/qrcode.png', qrCode);

    // Send response with QR Code
    res.send(`
        <h2>QR Code Generated</h2>
        <p>Scan this QR code to view your details</p>
        <img src="qrcode.png" alt="QR Code">
        <br>
        <a href="/">Go Back</a>
    `);
});

// Route to display stored user data
app.get('/view', (req, res) => {
    if (fs.existsSync('data.json')) {
        const userData = JSON.parse(fs.readFileSync('data.json'));
        res.send(`
            <h2>User Details</h2>
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Contact:</strong> ${userData.contact}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Address:</strong> ${userData.address}</p>
            <p><strong>Aadhar Card:</strong> ${userData.aadhar}</p>
            <p><strong>PAN Card:</strong> ${userData.pan}</p>
            <br>
            <a href="/">Go Back</a>
        `);
    } else {
        res.send("<h2>No data found</h2>");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
