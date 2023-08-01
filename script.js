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

        // Save the wish to the repository
        saveWishToRepository(name, message, pictureFile);
      };
      pictureReader.readAsDataURL(pictureFile);
    } else {
      newWish.innerHTML = wishContent;
      wishList.appendChild(newWish);
      showThankYouAlert();

      // Save the wish to the repository
      saveWishToRepository(name, message);
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

function saveWishToRepository(name, message, pictureFile) {
  const wish = {
    name: name || 'Anonymous',
    message,
    pictureURL: pictureFile ? URL.createObjectURL(pictureFile) : null
  };

  fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPOSITORY/main/wishes.json')
    .then(response => response.json())
    .then(data => {
      const currentWishes = data || [];
      currentWishes.push(wish);
      return fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPOSITORY/contents/wishes.json', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update wishes.json',
          content: btoa(JSON.stringify(currentWishes, null, 2)),
          sha: data?.sha || null
        })
      });
    })
    .catch(error => console.error('Error saving wish to repository:', error));
}
