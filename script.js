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
  const auth = firebase.auth(); // Add this line

  // Listen for authentication state changes
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in, enable comment submission
      submitButton.disabled = false;
      setupComments(user.uid);
    } else {
      // User is signed out, disable comment submission
      submitButton.disabled = true;
      clearComments();
    }
  });

  submitButton.addEventListener("click", async function () {
    const commentText = commentInput.value;
    if (commentText !== "") {
      // Add comment to Firestore
      await db.collection("comments").add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: auth.currentUser.uid, // Store user ID with comment
      });

      commentInput.value = "";
    }
  });

  function setupComments(userId) {
    // Listen for changes in the comments collection and update the UI
    db.collection("comments")
      .where("userId", "==", userId) // Only show comments from the current user
      .orderBy("timestamp")
      .onSnapshot(function (snapshot) {
        commentList.innerHTML = "";
        snapshot.forEach(function (doc) {
          const commentItem = document.createElement("li");
          commentItem.className = "comment";
          commentItem.textContent = doc.data().text;

          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", async function () {
            // Delete comment from Firestore
            await db.collection("comments").doc(doc.id).delete();
          });

          commentItem.appendChild(deleteButton);
          commentList.appendChild(commentItem);
        });
      });
  }

  function clearComments() {
    commentList.innerHTML = "";
  }
});

