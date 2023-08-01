// Personal Access Token from GitHub (Replace with your token)
const accessToken = 'KAITUNG';

document.getElementById('wish-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const pictureInput = document.getElementById('picture');
  const pictureFile = pictureInput.files[0]; // Get the first selected file (if any)

  if (message.trim() !== '') {
    const wish = {
      name: name || 'Anonymous',
      message,
      pictureURL: null // We'll save the image to Gist instead of local storage
    };

    if (pictureFile) {
      try {
        const gistId = await createGist(pictureFile);
        wish.pictureURL = `https://gist.github.com/${gistId}.png`;
      } catch (error) {
        console.error('Error uploading picture:', error);
      }
    }

    let wishes = JSON.parse(localStorage.getItem('wishes')) || [];
    wishes.push(wish);
    localStorage.setItem('wishes', JSON.stringify(wishes));

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';

    showThankYouAlert();
    displayWishes(); // Display the updated wishes immediately
  }
});

async function createGist(pictureFile) {
  // Same as before
}

function showThankYouAlert() {
  alert('Thank you for your wishes!');
}

function displayWishes() {
  const wishList = document.getElementById('wish-list');
  const wishes = JSON.parse(localStorage.getItem('wishes')) || [];

  wishList.innerHTML = ''; // Clear existing wishes

  if (wishes.length > 0) {
    wishes.forEach((wish) => {
      const wishCard = document.createElement('div');
      wishCard.classList.add('wish');
      wishCard.innerHTML = `
        <p><strong>${wish.name}:</strong> ${wish.message}</p>
        ${wish.pictureURL ? `<img src="${wish.pictureURL}" alt="Wish Picture">` : ''}
      `;
      wishList.appendChild(wishCard);
    });
  } else {
    const noWishesMessage = document.createElement('p');
    noWishesMessage.textContent = 'No wishes yet. Be the first to leave a wish!';
    wishList.appendChild(noWishesMessage);
  }
}

displayWishes(); // Display the initial wishes when the page loads

// The rest of the code remains the same
