// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// ... Rest of the script.js code ...


document.getElementById('wish-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const pictureInput = document.getElementById('picture');
  const pictureFile = pictureInput.files[0]; // Get the first selected file (if any)

  if (message.trim() !== '') {
    const wishList = document.getElementById('wish-list');
    const newWish = document.createElement('div');
    newWish.classList.add('wish');

    let wishContent = '';
    if (name !== '') {
      wishContent += `<strong>${name}:</strong> `;
    }
    wishContent += message;

    if (pictureFile) {
      const pictureReader = new FileReader();
      pictureReader.onload = function() {
        const pictureURL = pictureReader.result;
        wishContent += `<br><img src="${pictureURL}" alt="Wish Picture">`;
        newWish.innerHTML = wishContent;
        wishList.appendChild(newWish);
        showThankYouAlert();
        saveWish(name, message, pictureFile);
      };
      pictureReader.readAsDataURL(pictureFile);
    } else {
      newWish.innerHTML = wishContent;
      wishList.appendChild(newWish);
      showThankYouAlert();
      saveWish(name, message);
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

function saveWish(name, message, pictureFile) {
  const wish = {
    name: name || 'Anonymous',
    message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };
  
  // Save the wish to Firestore
  db.collection('wishes')
    .add(wish)
    .then((docRef) => {
      if (pictureFile) {
        uploadPicture(docRef.id, pictureFile)
          .then(() => {
            showThankYouAlert();
          })
          .catch(error => {
            console.error('Failed to upload picture:', error);
            showThankYouAlert();
          });
      } else {
        showThankYouAlert();
      }
    })
    .catch(error => {
      console.error('Error saving wish:', error);
    });
}

  let wishes = localStorage.getItem('wishes');
  if (wishes) {
    wishes = JSON.parse(wishes);
    wishes.push(wish);
  } else {
    wishes = [wish];
  }
  localStorage.setItem('wishes', JSON.stringify(wishes));
}

function uploadPicture(docId, pictureFile) {
  return new Promise((resolve, reject) => {
    const storageRef = firebase.storage().ref(`wishes/${docId}/${pictureFile.name}`);
    const uploadTask = storageRef.put(pictureFile);

    uploadTask.on(
      'state_changed',
      null,
      error => reject(error),
      () => resolve()
    );
  });
}
