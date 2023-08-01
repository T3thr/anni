const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload Middleware using Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Serve wishes.html
app.get('/wishes.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../wishes.html'));
});

// API endpoint to upload picture
app.post('/api/upload', upload.single('picture'), (req, res) => {
  if (req.file) {
    const pictureURL = `${req.protocol}://${req.get('host')}/${req.file.path}`;
    res.json({ pictureURL });
  } else {
    res.status(400).json({ error: 'No picture uploaded.' });
  }
});

// In-memory storage for wishes (replace this with a database for a production app)
const wishes = [];

// API endpoint to save a wish
app.post('/api/wishes', (req, res) => {
  const { name, message, pictureURL } = req.body;
  const wish = { name, message, pictureURL };
  wishes.push(wish);
  res.sendStatus(200);
});

// API endpoint to get all wishes
app.get('/api/wishes', (req, res) => {
  res.json(wishes);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
