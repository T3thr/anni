  <a href="index.html" class="back-link">Back to Homepage</a>

  <footer>
    <center> <p>&copy; 2023 Theerapat Pooraya. All rights reserved.</p>
  </footer>

  <script src="script.js"></script>
  <script>
    // JavaScript code to fetch and display all wishes
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
              ${wish.name === 'admin' ? `<button onclick="deleteWish('${wish.id}')">Delete</button>` : ''}
            `;
            wishList.appendChild(wishCard);
          });
	@@ -49,36 +48,6 @@ <h1>All Wishes</h1>
        }
      })
      .catch(error => console.error('Error fetching wishes data:', error));

    // JavaScript code to delete a wish
    function deleteWish(id) {
      const confirmation = confirm('Are you sure you want to delete this wish?');
      if (confirmation) {
        fetch(`https://raw.githubusercontent.com/T3thr/anni/main/wishes.json`)
          .then(response => response.json())
          .then(data => {
            const updatedWishes = data.filter(wish => wish.id !== id);
            const updatedContent = JSON.stringify(updatedWishes, null, 2);
            const updatedContentEncoded = btoa(updatedContent);
            return fetch('https://api.github.com/repos/T3thr/anni/contents/wishes.json', {
              method: 'PUT',
              headers: {
                'Authorization': 'Bearer KAITUNG',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: 'Update wishes.json',
                content: updatedContentEncoded,
                sha: data.sha
              })
            });
          })
          .then(() => {
            window.location.reload();
          })
          .catch(error => console.error('Error deleting wish:', error));
      }
    }
  </script>
</body>
</html>
