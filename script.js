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

function saveWish(newWish) {
  const db = firebase.firestore();
  db.collection('wishes')
    .add(newWish)
    .catch(error => {
      console.error('Error saving wish:', error);
    });
}
