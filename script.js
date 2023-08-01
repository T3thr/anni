// Personal Access Token from GitHub (Replace with your token)
const accessToken = 'YOUR_PERSONAL_ACCESS_TOKEN';

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
  }
});

async function createGist(pictureFile) {
  const apiUrl = 'https://api.github.com/gists';
  const fileName = `${Date.now()}_${pictureFile.name}`;
  const fileContent = await readFileAsBase64(pictureFile);

  const requestBody = {
    files: {
      [fileName]: {
        content: fileContent
      }
    },
    public: false
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      return data.id;
    } else {
      throw new Error('Failed to create Gist.');
    }
  } catch (error) {
    throw error;
  }
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// The rest of the code remains the same
