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
            icon:
              "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiXuveNp_rgAhUUgHMKHSfwAQ8QjRx6BAgBEAU&url=http%3A%2F%2Fwww.jeuxdesophia.com%2Fjcms%2Frda_6268%2Fen%2Ftable-football&psig=AOvVaw0Rw1-jIkryDVIZeS-I2cHD&ust=1552401149567633"
          }
        };
        return payload;
      })
      .then(() => {
        return db.collection("users").get();
      })
      .then(userDoc => extractData(userDoc))
      .then(usersData =>
        usersData
          .map(userData => {
            if (userData.pushTokens) {
              return Promise.all(
                userData.pushTokens.map(token =>
                  admin.messaging().sendToDevice(token, payload)
                )
              );
            }
            return Promise.resolve([]);
          })
          .then(() => {
            return "Sended ok";
          })
      );
  });
