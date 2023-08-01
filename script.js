const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Replace with your own service account key file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = admin.storage().bucket();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to save a wish
app.post('/saveWish', upload.single('picture'), async (req, res) => {
  try {
    const { name, message } = req.body;
    const wish = { name, message, timestamp: Date.now() };

    if (req.file) {
      const pictureName = `${Date.now()}_${req.file.originalname}`;
      const file = storage.file(pictureName);
      const fileStream = file.createWriteStream({
        metadata: { contentType: req.file.mimetype }
      });

      fileStream.on('error', (err) => {
        console.error('Error uploading picture:', err);
        res.status(500).send('Error uploading picture');
      });

      fileStream.on('finish', () => {
        wish.pictureURL = `https://storage.googleapis.com/${storage.name}/${pictureName}`;
        saveWishToFirestore(wish);
      });

      fileStream.end(req.file.buffer);
    } else {
      saveWishToFirestore(wish);
    }

    res.status(200).send('Wish saved successfully');
  } catch (error) {
    console.error('Error saving wish:', error);
    res.status(500).send('Error saving wish');
  }
});

// Function to save wish to Firestore
async function saveWishToFirestore(wish) {
  await db.collection('wishes').add(wish);
}

// Endpoint to fetch all wishes
app.get('/getAllWishes', async (req, res) => {
  try {
    const snapshot = await db.collection('wishes').orderBy('timestamp', 'desc').get();
    const wishes = snapshot.docs.map(doc => doc.data());
    res.status(200).json(wishes);
  } catch (error) {
    console.error('Error fetching wishes:', error);
    res.status(500).send('Error fetching wishes');
  }
});

// Start the server
const port = 5000; // Change to the desired port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
