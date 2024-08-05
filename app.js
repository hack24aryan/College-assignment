const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(fileUpload());

const UPLOAD_DIR = './public/uploads/';

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({ success: false });
    }

    const pdfFile = req.files.pdf;

    if (pdfFile.mimetype !== 'application/pdf') {
        return res.status(400).send({ success: false });
    }

    const uploadPath = UPLOAD_DIR + pdfFile.name;

    pdfFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send({ success: false });
        }
        res.send({ success: true });
    });
});

app.get('/notes', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            return res.status(500).send({ notes: [] });
        }
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        res.send({ notes: pdfFiles });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 
