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

      // Rest of the code (fetch and display comments)
    } else {
      // User is signed out
      submitButton.disabled = true; // Disable submit button
      signInWithGoogleButton.style.display = "block"; // Show Google sign-in
      commentList.innerHTML = ""; // Clear comment list
    }
  });

  submitButton.addEventListener("click", async function () {
    // Rest of the code (add new comment)
  });

  signInWithGoogleButton.addEventListener("click", function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(function (error) {
      console.error(error);
    });
  });
});

