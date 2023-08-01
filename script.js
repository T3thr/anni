// Personal Access Token from GitHub (Replace with your token)
const accessToken = 'KAITUNG';

// Function to fetch wishes from GitHub repository
async function fetchWishesFromGitHub() {
  const apiUrl = 'https://api.github.com/repos/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME/contents/wishes.json';
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

// Function to save wish to GitHub repository
async function saveWishToGitHub(wish) {
  try {
    const repoOwner = 'T3thrE';
    const repoName = 'anni';
    const fileName = 'wishes.json';
    const branchName = 'main';

    let wishes = await fetchWishesFromGitHub();
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

// Function to commit file to GitHub repository
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
