// Initialize PubNub
const pubnub = new PubNub({
  publishKey: 'pub-c-70f83965-9121-4ce0-b6e6-7b18b51b13fe',
  subscribeKey: 'YOUR_PUBNUB_SUBSCRIBE_KEY'
});

// Set the PubNub channel name
const channelName = 'anniversary_wishes';

// Submit wish form
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
        saveWish(name, message, pictureURL);
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

// Show thank you alert after submitting the wish
function showThankYouAlert() {
  alert('Thank you for your wishes!');
}

// Save the wish to PubNub channel
function saveWish(name, message, pictureURL) {
  const wish = {
    name: name || 'Anonymous',
    message,
    pictureURL,
    timestamp: Date.now()
  };

  pubnub.publish({
    channel: channelName,
    message: wish,
    callback: (message) => {
      console.log('Wish sent successfully:', message);
    },
    error: (error) => {
      console.error('Error sending wish:', error);
    }
  });
}

// Rest of the script.js code...
