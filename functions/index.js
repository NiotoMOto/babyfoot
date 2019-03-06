const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });

function storeStates(team) {
  team.members.map(userRef => {
    return userRef.get().then(doc => console.log(doc.data()));
  });
}

exports.addStats = functions.firestore
  .document("matchs/{matchId}")
  .onCreate((snap, context) => {
    const match = snap.data();
    Promise.all([storeStates]).catch(err => console.log(err));
    return "Send OK";
  });
