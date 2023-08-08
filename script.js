document.addEventListener("DOMContentLoaded", function () {
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitButton = document.getElementById("submit-button");
  const loginButton = document.getElementById("login-button");

  // Initialize Firebase
  firebase.initializeApp({
    apiKey: "AIzaSyDCS6hFxkfaqyTWvO7Zlo23zDbAWh8U3Oc",
    authDomain: "anni-e336f.firebaseapp.com",
    projectId: "anni-e336f",
  });

  const db = firebase.firestore();
  const auth = firebase.auth();

  // Listen for changes in user authentication state
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      submitButton.disabled = false; // Enable submit button

      if (user.uid === "D42rljE5qLgcDyJPZl3ErdH2LEE3") {
        signInWithGoogleButton.style.display = "none"; // Hide Google sign-in for admin
      }

      // Fetch and display comments
      db.collection("comments")
        .orderBy("timestamp")
        .onSnapshot(function (snapshot) {
          commentList.innerHTML = "";
          snapshot.forEach(function (doc) {
            const commentItem = document.createElement("li");
            commentItem.className = "comment";
            commentItem.textContent = doc.data().text;

            if (user.uid === "D42rljE5qLgcDyJPZl3ErdH2LEE3") {
              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.addEventListener("click", async function () {
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
      signInWithGoogleButton.style.display = "block"; // Show Google sign-in
      commentList.innerHTML = ""; // Clear comment list
    }
  });

  submitButton.addEventListener("click", async function () {
    const commentText = commentInput.value;
    if (commentText !== "") {
      await db.collection("comments").add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userId: auth.currentUser ? auth.currentUser.uid : null, // Store user ID with the comment
      });

      commentInput.value = "";
    }
  });

  signInWithGoogleButton.addEventListener("click", function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(function (error) {
      console.error(error);
    });
  });
});
