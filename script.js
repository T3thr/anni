// Initialize Firebase (Replace with your Firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyDCS6hFxkfaqyTWvO7Zlo23zDbAWh8U3Oc",
  authDomain: "anni-e336f.firebaseapp.com",
  databaseURL: "https://anni-e336f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "anni-e336f",
  storageBucket: "anni-e336f.appspot.com",
  messagingSenderId: "773257785211",
  appId: "1:773257785211:web:7735061a858604eb7757de",
  measurementId: "G-WME9JEGD0R"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

document.getElementById('wish-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const pictureInput = document.getElementById('picture');
  const pictureFile = pictureInput.files[0]; // Get the first selected file (if any)

  if (message.trim() !== '') {
    const newWish = {
      name: name || 'Anonymous',
      message,
      pictureURL: null
    };

    if (pictureFile) {
      const pictureReader = new FileReader();
      pictureReader.onload = function() {
        const pictureURL = pictureReader.result;
        newWish.pictureURL = pictureURL;
        saveWish(newWish);
        showThankYouAlert();
      };
      pictureReader.readAsDataURL(pictureFile);
    } else {
      saveWish(newWish);
      showThankYouAlert();
    }

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';
  }
});

function showThankYouAlert() {
  alert('Thank you for your wishes!');
}

// Save wish to Firebase Firestore
function saveWish(newWish) {
  const db = firebase.firestore();
  db.collection('wishes')
    .add(newWish)
    .catch(error => {
      console.error('Error saving wish:', error);
    });
  
}


