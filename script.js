// Function to fetch and display all wishes from wishes.json
function fetchAndDisplayWishes() {
  fetch('https://raw.githubusercontent.com/T3thr/anni/main/wishes.json')
    .then(response => response.json())
    .then(data => {
      const wishes = data;
      const wishList = document.getElementById('wish-list');

      if (wishes && wishes.length > 0) {
        wishes.forEach((wish) => {
          const wishCard = document.createElement('div');
          wishCard.classList.add('wish');
          wishCard.innerHTML = `
            <p><strong>${wish.name}:</strong> ${wish.message}</p>
            ${wish.pictureURL ? `<img src="${wish.pictureURL}" alt="Wish Picture">` : ''}
          `;
          wishList.appendChild(wishCard);
        });
      } else {
        const noWishesMessage = document.createElement('p');
        noWishesMessage.textContent = 'No wishes yet. Be the first to leave a wish!';
        wishList.appendChild(noWishesMessage);
      }
    })
    .catch(error => console.error('Error fetching wishes data:', error));
}

// Function to save the wish to wishes.json
function saveWishToRepository(name, message, pictureFile) {
  const wish = {
    name: name || 'Anonymous',
    message,
    pictureURL: pictureFile ? URL.createObjectURL(pictureFile) : null
	@@ -41,22 +66,3 @@ function saveWishToRepository(name, message, pictureFile) {
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
      // Refresh the wishes display after saving the new wish
      fetchAndDisplayWishes();
    })
    .catch(error => console.error('Error saving wish to repository:', error));
}

// Call fetchAndDisplayWishes() to display existing wishes on page load
fetchAndDisplayWishes();
