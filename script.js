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
      pictureURL: null // We'll save the image to Gist instead of using local storage
    };

    if (pictureFile) {
      try {
        const gistId = await createGist(pictureFile);
        wish.pictureURL = `https://gist.github.com/${gistId}.png`;
      } catch (error) {
        console.error('Error uploading picture:', error);
      }
    }

    await saveWishToGitHub(wish);

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';

    showThankYouAlert();
  }
});

async function createGist(pictureFile) {
  // Same as before
}

async function saveWishToGitHub(wish) {
  const repoOwner = 'T3thr';
  const repoName = 'anni';
  const fileName = 'wishes.json';
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;

  try {
    // Fetch the existing wishes from GitHub Gist
    const existingWishesResponse = await fetch(apiUrl);
    if (!existingWishesResponse.ok) {
      throw new Error('Failed to get existing wishes from GitHub.');
    }

    const existingWishesContent = await existingWishesResponse.json();
    const existingWishes = JSON.parse(atob(existingWishesContent.content));

    // Add the new wish to the existing wishes
    existingWishes.push(wish);

    // Update the Gist with the updated wishes data
    const requestBody = {
      message: 'Update wishes data',
      content: btoa(JSON.stringify(existingWishes)),
      sha: existingWishesContent.sha
    };

    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!updateResponse.ok) {
      throw new Error('Failed to update wishes on GitHub.');
    }
  } catch (error) {
    throw error;
  }
}

function showThankYouAlert() {
  alert('Thank you for your wishes!');
}
