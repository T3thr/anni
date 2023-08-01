// Initialize Firebase with your project's config
// Replace the placeholder with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = firebase.firestore();

// Function to save a wish to the database
function saveWishToDatabase(name, message) {
    db.collection("wishes").add({
        name: name,
        message: message
    })
    .then(() => {
        console.log("Wish saved to database!");
    })
    .catch((error) => {
        console.error("Error saving wish to database:", error);
    });
}

// Function to load wishes from the database and display on the second page
function loadWishesFromDatabase() {
    db.collection("wishes").get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const wishData = doc.data();
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${wishData.name ? wishData.name + ': ' : ''}</strong>${wishData.message}`;
            wishesList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error("Error loading wishes from database:", error);
    });
}

// Load wishes when the second page loads
if (window.location.pathname === '/wishes.html') {
    const wishesList = document.getElementById('wishes-list');
    loadWishesFromDatabase();
}

// Add event listener for form submission on the first page
messageForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const pictureInput = document.getElementById('picture');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!message) {
        alert('Please enter a message before submitting.');
        return;
    }

    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${name ? name + ': ' : ''}</strong>${message}`;
    wishesList.appendChild(listItem);

    messageInput.value = '';
    nameInput.value = '';

    // Save the wish to the database
    saveWishToDatabase(name, message);
});
