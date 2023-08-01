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
      pictureURL: null
    };

    if (pictureFile) {
      try {
        const pictureURL = await uploadPictureToGitHub(pictureFile);
        wish.pictureURL = pictureURL;
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
  }
});

async function uploadPictureToGitHub(pictureFile) {
  const repoOwner = 'T3thr';
  const repoName = 'anni';
  const uploadUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/pictures`;

  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onload = async function() {
      const pictureBase64 = fileReader.result.split(',')[1];

      const fileName = `${Date.now()}_${pictureFile.name}`;
      const fileContent = `data:${pictureFile.type};base64,${pictureBase64}`;
      const requestBody = {
        message: `Upload picture: ${fileName}`,
        content: pictureBase64,
        branch: 'main'
      };

      try {
        const response = await fetch(uploadUrl + '/' + fileName, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const pictureLink = `${repoOwner}/${repoName}/blob/main/pictures/${fileName}`;
          resolve(pictureLink);
        } else {
          reject('Failed to upload picture to GitHub.');
        }
      } catch (error) {
        reject(error);
      }
    };
    fileReader.readAsDataURL(pictureFile);
  });
}
