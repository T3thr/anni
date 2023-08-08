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

  submitButton.addEventListener("click", async function () {
    const commentText = commentInput.value;
    if (commentText !== "") {
      // Add comment to Firestore
      await db.collection("comments").add({
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
});
