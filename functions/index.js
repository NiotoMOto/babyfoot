const functions = require("firebase-functions");
const admin = require("firebase-admin");
const _ = require("lodash");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });

function add(sum = 0, nb) {
  return sum + nb;
}

function getStats(user, team, otherTeam) {
  return {
    "stats.buts": add(_.get(user.stats, "buts"), team.score),
    "stats.butsNeg": add(_.get(user.stats, "butsNeg"), otherTeam.score),
    "stats.defeats": add(
      _.get(user.stats, "defeats"),
      otherTeam.victory ? 1 : 0
    ),
    "stats.victories": add(
      _.get(user.stats, "victories"),
      team.victory ? 1 : 0
    ),
    "stats.parties": add(_.get(user.stats, "parties"), 1)
  };
}

function storeStates(match) {
  return Promise.all([
    ...match.equipeBleue.members.map(userRefBleu => {
      return userRefBleu.get().then(doc => {
        const userBleu = doc.data();

        return userRefBleu.update(
          getStats(userBleu, match.equipeBleue, match.equipeRouge)
        );
      });
    }),
    ...match.equipeRouge.members.map(userRefRouge => {
      return userRefRouge.get().then(doc => {
        const userRouge = doc.data();

        return userRefRouge.update(
          getStats(userRouge, match.equipeRouge, match.equipeBleue)
        );
      });
    })
  ]);
}

exports.addStats = functions.firestore
  .document("matchs/{matchId}")
  .onCreate((snap, context) => {
    const match = snap.data();
    return Promise.all([storeStates(match)])
      .then(() => {
        return "Send OK";
      })
      .catch(err => err);
  });
