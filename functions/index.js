const functions = require("firebase-functions");
const admin = require("firebase-admin");
const _ = require("lodash");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

function extractData(querySnapshot) {
  let d = [];

  querySnapshot.forEach(doc => {
    d.push(Object.assign(doc.data(), { id: doc.id }));
  });
  return d;
}
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

function getMatchUsers(match) {
  const equipes = {
    equipeBleue: [],
    equipeRouge: []
  };
  return Promise.all([
    ...match.equipeBleue.members.map(userRefBleu => {
      return userRefBleu.get().then(doc => {
        const userBleu = doc.data();
        equipes.equipeBleue.push(userBleu);
        return userBleu;
      });
    }),
    ...match.equipeRouge.members.map(userRefRouge => {
      return userRefRouge.get().then(doc => {
        const userRouge = doc.data();
        equipes.equipeRouge.push(userRouge);
        return userRefRouge;
      });
    })
  ]).then(() => equipes);
}

exports.sendNotifs = functions.firestore
  .document("matchs/{matchId}")
  .onCreate(snap => {
    let payload = {};
    const match = snap.data();
    return getMatchUsers(match)
      .then(equipes => {
        let body = "";
        equipes.equipeBleue.forEach((user, index) => {
          body += `${user.displayName}${
            index < equipes.equipeBleue.length - 1 ? " - " : " "
          }`;
        });
        body += `(${match.equipeBleue.score}) vs `;
        equipes.equipeRouge.forEach((user, index) => {
          body += `${user.displayName}${
            index < equipes.equipeRouge.length - 1 ? " - " : " "
          }`;
        });
        body += `(${match.equipeRouge.score})`;
        payload = {
          notification: {
            title: "Nouveau match",
            body,
            click_action: "https://babyfoot-5ca0a.firebaseapp.com",
            icon: "https://babyfoot-5ca0a.firebaseapp.com/KingOfBaby.png"
          }
        };
        return payload;
      })
      .then(() => {
        return db.collection("users").get();
      })
      .then(userDoc => extractData(userDoc))
      .then(usersDatas =>
        usersDatas.map(userData => {
          if (userData.pushTokens) {
            return Promise.all(
              userData.pushTokens.map(token =>
                admin
                  .messaging()
                  .sendToDevice(token, payload)
                  .then(response => cleanupTokens(response, token, userData))
              )
            );
          }
          return Promise.resolve([]);
        })
      )
      .then(() => {
        return "Sended ok";
      });
  });

function cleanupTokens(response, token, userData) {
  // For each notification we check if there was an error.
  const tokensDelete = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error("Failure sending notification to", token, error);
      // Cleanup the tokens who are not registered anymore.
      if (
        error.code === "messaging/invalid-registration-token" ||
        error.code === "messaging/registration-token-not-registered"
      ) {
        const deleteTask = db
          .collection("users")
          .doc(userData.uid)
          .update({
            pushTokens: admin.firestore.FieldValue.arrayRemove(token)
          });
        tokensDelete.push(deleteTask);
      }
    }
  });
  return Promise.all(tokensDelete);
}
