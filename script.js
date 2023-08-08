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
  const auth = firebase.auth();

  submitButton.addEventListener("click", function () {
    const commentText = commentInput.value;
    if (commentText !== "") {
      // Add comment to Firestore
      db.collection("comments").add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: auth.currentUser ? auth.currentUser.uid : null,
      });

      commentInput.value = "";
    }
  });

  // Listen for changes in the comments collection and update the UI
  db.collection("comments")
    .orderBy("timestamp")
    .onSnapshot(function (snapshot) {
      commentList.innerHTML = "";
      snapshot.forEach(function (doc) {
        const commentItem = document.createElement("li");
        commentItem.className = "comment";
        commentItem.textContent = doc.data().text;

        // Show delete button if the current user is the owner
        if (auth.currentUser && doc.data().userId === auth.currentUser.uid) {
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function () {
            db.collection("comments").doc(doc.id).delete();
          });
          commentItem.appendChild(deleteButton);
        }

        commentList.appendChild(commentItem);
      });
    });

  // User authentication state change listener
  auth.onAuthStateChanged(function (user) {
    // Show/hide comment input and submit button based on authentication
    if (user) {
      commentInput.style.display = "block";
      submitButton.style.display = "block";
    } else {
      commentInput.style.display = "none";
      submitButton.style.display = "none";
    }
  });
});
