document.addEventListener("DOMContentLoaded", function() {
    const crushNameElement = document.getElementById("crushName");
    const messageForm = document.getElementById("messageForm");
    const wishesContainer = document.getElementById("wishes");

    // Initialize Firebase
    firebase.initializeApp({
        apiKey: "AIzaSyDCS6hFxkfaqyTWvO7Zlo23zDbAWh8U3Oc",
        authDomain: "[YOUR_PROJECT_ID].anni-e336f.firebaseapp.com",
        projectId: "anni-e336f"
    });

    const db = firebase.firestore();

    // Replace [Your Crush's Name] with the actual name
    crushNameElement.textContent = "[Your Crush's Name]";

    messageForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const nameInput = document.getElementById("name");
        const messageInput = document.getElementById("message");

        const name = nameInput.value || "Anonymous";
        const message = messageInput.value;

        // Store wish in Firestore
        await db.collection("wishes").add({
            name: name,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear form inputs
        nameInput.value = "";
        messageInput.value = "";
    });

    // Load wishes from Firestore
    db.collection("wishes").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        wishesContainer.innerHTML = ""; // Clear existing wishes

        snapshot.forEach(doc => {
            const wish = doc.data();
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");
            messageElement.innerHTML = `<strong>${wish.name}</strong>: ${wish.message}`;
            wishesContainer.appendChild(messageElement);
        });
    });

    messageForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // ...

    // Save the wish to Firebase Firestore
    db.collection('wishes').add({
        name: name,
        message: message
    }).then(() => {
        // Clear form inputs
        nameInput.value = "";
        messageInput.value = "";
    });
});

});
