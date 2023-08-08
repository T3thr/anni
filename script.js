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

  auth.signInAnonymously()
    .then(() => {
      submitButton.removeAttribute("disabled"); // Enable submit button after authentication
    })
    .catch(error => {
      console.error("Authentication failed:", error);
    });

  submitButton.addEventListener("click", function () {
    const commentText = commentInput.value;
    if (commentText !== "") {
      // Add comment to Firestore
      db.collection("comments").add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        commentInput.value = ""; // Clear input after submission
      })
      .catch(error => {
        console.error("Error adding comment:", error);
      });
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

        if (auth.currentUser) { // Only show delete button to authenticated user
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function () {
            if (auth.currentUser.uid === "D42rljE5qLgcDyJPZl3ErdH2LEE3) {
              // Delete comment from Firestore
              db.collection("comments").doc(doc.id).delete();
            } else {
              console.log("You don't have permission to delete this comment.");
            }
          });

          commentItem.appendChild(deleteButton);
        }

        commentList.appendChild(commentItem);
      });
    });
});
