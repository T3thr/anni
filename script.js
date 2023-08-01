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
    pictureFile: pictureFile ? pictureFile.name : null
  };

  fetch('https://api.github.com/repos/T3thr/anni/contents/data.json', {
    method: 'GET',
    headers: {
      'Authorization': 'token KAITUNG'
    }
  })
  .then(response => response.json())
  .then(data => {
    const existingWishes = JSON.parse(atob(data.content));
    existingWishes.wishes.push(wish);

    return fetch(data.url, {
      method: 'PUT',
      headers: {
        'Authorization': 'token KAITUNG',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update wishes',
        content: btoa(JSON.stringify(existingWishes)),
        sha: data.sha
      })
    });
  })
  .catch(error => {
    console.error('Error saving wish:', error);
  });
}
