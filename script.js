// Function to save a wish to the GitHub repository
async function saveWishToGitHub(name, message) {
    const data = {
        name: name,
        message: message
    };

    const response = await fetch('https://api.github.com/repos/T3thr/anniversary-wishes/contents/wishes/' + Date.now() + '.json', {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer YOUR_GITHUB_ACCESS_TOKEN',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Create new wish',
            content: btoa(JSON.stringify(data))
        })
    });

    if (response.ok) {
        console.log('Wish saved to GitHub!');
    } else {
        console.error('Error saving wish to GitHub:', response.status, response.statusText);
    }
}

// Function to load wishes from the GitHub repository and display on the second page
async function loadWishesFromGitHub() {
    const response = await fetch('https://api.github.com/repos/T3thr/anniversary-wishes/contents/wishes', {
        headers: {
            'Authorization': 'Bearer KAITUNG'
        }
    });

    if (response.ok) {
        const wishes = await response.json();
        const wishesList = document.getElementById('wishes-list');
        for (const wish of wishes) {
            const wishData = JSON.parse(atob(wish.content));
            const listItem = document.createElement('li');
            listItem.innerHTML = `<strong>${wishData.name ? wishData.name + ': ' : ''}</strong>${wishData.message}`;
            wishesList.appendChild(listItem);
        }
    } else {
        console.error('Error loading wishes from GitHub:', response.status, response.statusText);
    }
}

// Load wishes when the second page loads
if (window.location.pathname === '/wishes.html') {
    loadWishesFromGitHub();
}
