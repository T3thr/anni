const messageForm = document.getElementById('message-form');
const wishesList = document.getElementById('wishes-list');

messageForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const pictureInput = document.getElementById('picture');

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!message) {
        alert('Please enter a message before submitting.');
        return;
    }

    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${name ? name + ': ' : ''}</strong>${message}`;
    wishesList.appendChild(listItem);

    messageInput.value = '';
    nameInput.value = '';
});
