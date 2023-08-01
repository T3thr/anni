document.getElementById('wish-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const pictureInput = document.getElementById('picture');
  const pictureFile = pictureInput.files[0]; 
  
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
    message
  };

  if (pictureFile) {
    const reader = new FileReader();
    reader.onload = function() {
      const pictureBase64 = reader.result.split(',')[1];
      uploadPicture(pictureFile.name, pictureBase64)
        .then(pictureURL => {
          wish.pictureURL = pictureURL;
          saveWishToStorage(wish);
        })
        .catch(error => {
          console.error('Failed to upload picture:', error);
          saveWishToStorage(wish); 
        });
    };
    reader.readAsDataURL(pictureFile);
  } else {
    saveWishToStorage(wish); 
  }
}

function uploadPicture(fileName, base64Data) {
  const url = `https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_GITHUB_REPOSITORY/contents/images/${fileName}`;
  const authToken = 'YOUR_GITHUB_PERSONAL_ACCESS_TOKEN';
  const headers = new Headers({
    'Authorization': `token ${authToken}`,
    'Content-Type': 'application/json'
  });

  const data = {
    message: 'Upload image',
    content: base64Data
  };

  return fetch(url, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    return response.json();
  })
  .then(data => data.content.download_url)
  .catch(error => {
    throw error;
  });
}

function saveWishToStorage(wish) {
  let wishes = localStorage.getItem('wishes');
  if (wishes) {
    wishes = JSON.parse(wishes);
    wishes.push(wish);
  } else {
    wishes = [wish];
  }
  localStorage.setItem('wishes', JSON.stringify(wishes));
}
