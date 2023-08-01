// Personal Access Token from GitHub (Replace with your token)
const accessToken = 'KAITUNG';

document.getElementById('wish-form').addEventListener('submit', async function(event) {
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
      pictureReader.onload = async function() {
        const pictureURL = pictureReader.result;
        wishContent += `<br><img src="${pictureURL}" alt="Wish Picture">`;
        newWish.innerHTML = wishContent;
        wishList.appendChild(newWish);
        showThankYouAlert();
        await saveWishToGitHub(name, message, pictureFile);
      };
      pictureReader.readAsDataURL(pictureFile);
    } else {
      newWish.innerHTML = wishContent;
      wishList.appendChild(newWish);
      showThankYouAlert();
      await saveWishToGitHub(name, message);
    }

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';
  }
});

async function showThankYouAlert() {
  alert('Thank you for your wishes!');
}

async function saveWishToGitHub(name, message, pictureFile) {
  const wish = {
    name: name || 'Anonymous',
    message,
    pictureURL: pictureFile ? URL.createObjectURL(pictureFile) : null
  };

  try {
    const repoOwner = 'T3thr';
    const repoName = 'anni';
    const fileName = 'wishes.json';
    const branchName = 'main';

    let wishes = await getWishesFromGitHub(repoOwner, repoName, fileName, branchName);
    if (!wishes) {
      wishes = [];
    }
    wishes.push(wish);

    const fileContent = JSON.stringify(wishes, null, 2);
    await commitFileToGitHub(repoOwner, repoName, fileName, fileContent, 'Add new wish', branchName);
  } catch (error) {
    console.error('Error saving wish to GitHub:', error);
  }
}

async function getWishesFromGitHub(repoOwner, repoName, fileName, branchName) {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}?ref=${branchName}`;

  const response = await fetch(apiUrl);
  if (response.ok) {
    const fileData = await response.json();
    if (fileData.content) {
      const decodedContent = atob(fileData.content);
      return JSON.parse(decodedContent);
    }
  }
  return null;
}

async function commitFileToGitHub(repoOwner, repoName, fileName, content, commitMessage, branchName) {
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`;
  const requestBody = {
    message: commitMessage,
    content: btoa(content),
    branch: branchName
  };

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (response.ok) {
    console.log('Wish saved to GitHub successfully!');
  } else {
    throw new Error('Failed to save wish to GitHub.');
  }
}
