document.addEventListener("DOMContentLoaded", function () {
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitButton = document.getElementById("submit-button");

  // Initialize Firebase
  firebase.initializeApp({
    apiKey: "AIzaSyDCS6hFxkfaqyTWvO7Zlo23zDbAWh8U3Oc",
    authDomain: "anni-e336f.firebaseapp.com",
    projectId: "anni-e336f",
  });

  const db = firebase.firestore();
  const auth = firebase.auth(); // Get the auth instance

  // Listen for changes in user authentication state
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      submitButton.disabled = false; // Enable submit button
      db.collection("comments")
        .orderBy("timestamp")
        .onSnapshot(function (snapshot) {
          commentList.innerHTML = "";
          snapshot.forEach(function (doc) {
            const commentItem = document.createElement("li");
            commentItem.className = "comment";
            commentItem.textContent = doc.data().text;

            if (user.uid === "D42rljE5qLgcDyJPZl3ErdH2LEE3") {
              // Only the admin user can see the delete button
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.addEventListener("click", async function () {
                // Delete comment from Firestore
                await db.collection("comments").doc(doc.id).delete();
              });

              commentItem.appendChild(deleteButton);
            }

            commentList.appendChild(commentItem);
          });
        });
    } else {
      // User is signed out
      submitButton.disabled = true; // Disable submit button
      commentList.innerHTML = ""; // Clear comment list
    }
  });

  submitButton.addEventListener("click", async function () {
    const commentText = commentInput.value;
    if (commentText !== "") {
      // Add comment to Firestore
      await db.collection("comments").add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: auth.currentUser.uid, // Store user ID with the comment
      });

      commentInput.value = "";
    }
  });

  // Handle user authentication (e.g., sign in, sign out) using Firebase Authentication
  // You'll need to implement this part separately
});


