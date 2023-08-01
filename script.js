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

        // Save the wish to GitHub repository
        saveWishToCloud(name, message, pictureFile);
      };
      pictureReader.readAsDataURL(pictureFile);
    } else {
      newWish.innerHTML = wishContent;
      wishList.appendChild(newWish);
      showThankYouAlert();

      // Save the wish to GitHub repository
      saveWishToCloud(name, message);
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

function saveWishToCloud(name, message, pictureFile) {
  const wish = {
    name: name || 'Anonymous',
    message,
    pictureURL: pictureFile ? URL.createObjectURL(pictureFile) : null
  };

  fetch('https://api.github.com/repos/T3thr/anni/contents/wishes.json', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN'
    }
  })
  .then(response => response.json())
  .then(data => {
    const currentWishes = JSON.parse(atob(data.content));
    currentWishes.push(wish);
    const updatedContent = JSON.stringify(currentWishes, null, 2);
    const updatedContentEncoded = btoa(updatedContent);
    return fetch('https://api.github.com/repos/T3thr/anni/contents/wishes.json', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer KAITUNG',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update wishes.json',
        content: updatedContentEncoded,
        sha: data.sha
      })
    });
  })
  .catch(error => console.error('Error saving wish to cloud:', error));
}
