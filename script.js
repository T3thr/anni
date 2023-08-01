// Function to save the wish to wishes.json
function saveWishToRepository(name, message, pictureFile) {
  const wish = {
    id: Date.now().toString(), // Unique identifier for each wish (using timestamp)
    name: name || 'Anonymous',
    message,
    pictureURL: pictureFile ? URL.createObjectURL(pictureFile) : null
  };

  fetch('https://raw.githubusercontent.com/T3thr/anni/main/wishes.json')
    .then(response => response.json())
    .then(data => {
      const currentWishes = data || [];
      currentWishes.push(wish);
      return fetch('https://api.github.com/repos/T3thr/anni/contents/wishes.json', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer KAITUNG',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update wishes.json',
          content: btoa(JSON.stringify(currentWishes, null, 2)),
          sha: data?.sha || null
        })
      });
    })
    .then(() => {
      // Redirect to wishes.html to see all wishes after saving the new wish
      window.location.href = 'wishes.html';
    })
    .catch(error => console.error('Error saving wish to repository:', error));
}
