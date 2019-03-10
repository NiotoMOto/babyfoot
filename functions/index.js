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

const labelPosition = {
  0: "first",
  1: "second",
  2: "third"
};

function storeWeeksStats(stats) {
  return Promise.all(
    _.take(_.orderBy(stats, ["points"], ["desc"]), 3).map((stat, index) => {
      return stat.docRef.get().then(user => {
        const userData = user.data();
        const fieldToUpdate = `wins.${labelPosition[index]}`;
        console.log(
          userData.wins,
          fieldToUpdate,
          _.get(userData, fieldToUpdate),
          {
            [fieldToUpdate]: add(_.get(userData, fieldToUpdate), 1)
          }
        );
        return stat.docRef.update({
          [fieldToUpdate]: add(_.get(userData, fieldToUpdate), 1)
        });
      });
    })
  );
}

exports.addWins = functions.firestore
  .document("weeks/{weekId}")
  .onCreate((snap, context) => {
    const statsData = snap.data();
    return Promise.all([storeWeeksStats(statsData.stats)])
      .then(() => {
        return "Send OK";
      })
      .catch(err => err);
  });
