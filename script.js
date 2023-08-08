document.addEventListener("DOMContentLoaded", function () {
  const commentList = document.getElementById("comment-list");
  const commentInput = document.getElementById("comment-input");
  const submitButton = document.getElementById("submit-button");

  firebase.initializeApp({
    apiKey: "AIzaSyDCS6hFxkfaqyTWvO7Zlo23zDbAWh8U3Oc",
    authDomain: "anni-e336f.firebaseapp.com",
    projectId: "anni-e336f",
  });

  const db = firebase.firestore();

  submitButton.addEventListener("click", function () {
    const commentText = commentInput.value;
    if (commentText !== "") {
      // Add comment to Firestore
      db.collection("comments").add({
        text: commentText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
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
        commentList.appendChild(commentItem);
      });
    });
});
