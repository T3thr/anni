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
        saveWish(name, message, pictureFile);
      };
      pictureReader.readAsDataURL(pictureFile);
    } else {
      newWish.innerHTML = wishContent;
      wishList.appendChild(newWish);
      saveWish(name, message);
    }

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';
  }
});

function saveWish(name, message, pictureFile) {
  const wish = {
    name: name || 'Anonymous',
    message,
    pictureFileName: pictureFile ? pictureFile.name : null
  };

  let wishes = JSON.parse(localStorage.getItem('wishes'));
  if (wishes) {
    wishes.push(wish);
  } else {
    wishes = [wish];
  }
  localStorage.setItem('wishes', JSON.stringify(wishes));

  if (pictureFile) {
    const formData = new FormData();
    formData.append('file', pictureFile);
    formData.append('path', 'images/' + pictureFile.name);

    fetch('https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_GITHUB_REPOSITORY/contents/images/' + pictureFile.name, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer YOUR_GITHUB_PERSONAL_ACCESS_TOKEN',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Upload image',
        content: pictureFile,
        branch: 'main',
      }),
    })
      .then(response => response.json())
      .then(data => {
        // The image is uploaded to the GitHub repository.
        // You can choose to do something with the data if needed.
      })
      .catch(error => console.error('Error uploading image:', error));
  }
}


