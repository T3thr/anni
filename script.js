const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your server's URL

document.getElementById('wish-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const pictureInput = document.getElementById('picture');
  const pictureFile = pictureInput.files[0]; // Get the first selected file (if any)

  if (message.trim() !== '') {
    const wish = {
      name: name || 'Anonymous',
      message
    };

    if (pictureFile) {
      try {
        const pictureURL = await uploadPictureToServer(pictureFile);
        wish.pictureURL = pictureURL;
      } catch (error) {
        console.error('Error uploading picture:', error);
      }
    }

    await saveWishToServer(wish);

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';

    showThankYouAlert();
  }
});

async function uploadPictureToServer(pictureFile) {
  const formData = new FormData();
  formData.append('picture', pictureFile);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      return data.pictureURL;
    } else {
      throw new Error('Failed to upload picture to server.');
    }
  } catch (error) {
    throw error;
  }
}

async function saveWishToServer(wish) {
  try {
    const response = await fetch(`${API_BASE_URL}/wishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wish)
    });

    if (!response.ok) {
      throw new Error('Failed to save wish to server.');
    }
  } catch (error) {
    throw error;
  }
}

function showThankYouAlert() {
  alert('Thank you for your wishes!');
}
