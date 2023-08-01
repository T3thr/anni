document.getElementById('wish-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const pictureInput = document.getElementById('picture');
  const pictureFile = pictureInput.files[0]; // Get the first selected file (if any)

  if (message.trim() !== '') {
    const wish = {
      name: name || 'Anonymous',
      message,
      pictureFile
    };

    saveWish(wish);
    showThankYouAlert();

    // Clear input fields after submission
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
    pictureInput.value = '';
  }
});

function showThankYouAlert() {
  alert('Thank you for your wishes!');
}

function saveWish(wish) {
  let wishes = localStorage.getItem('wishes');
  if (wishes) {
    wishes = JSON.parse(wishes);
    wishes.push(wish);
  } else {
    wishes = [wish];
  }
  localStorage.setItem('wishes', JSON.stringify(wishes));
}
