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

function getStats(user, team, otherTeam, group) {
  return {
    [`stats.${group.id}.buts`]: add(
      _.get(user, `stats.${group.id}.buts`),
      team.score
    ),
    [`stats.${group.id}.butsNeg`]: add(
      _.get(user, `stats.${group.id}.butsNeg`),
      otherTeam.score
    ),
    [`stats.${group.id}.defeats`]: add(
      _.get(user, `stats.${group.id}.defeats`),
      otherTeam.victory ? 1 : 0
    ),
    [`stats.${group.id}.victories`]: add(
      _.get(user, `stats.${group.id}.victories`),
      team.victory ? 1 : 0
    ),
    [`stats.${group.id}.parties`]: add(
      _.get(user, `stats.${group.id}.parties`),
      1
    )
  };
}

function storeStates(match, group) {
  return Promise.all([
    ...match.equipeBleue.members.map(userRefBleu => {
      return userRefBleu.get().then(doc => {
        const userBleu = doc.data();

        return userRefBleu.update(
          getStats(userBleu, match.equipeBleue, match.equipeRouge, group)
        );
      });
    }),
    ...match.equipeRouge.members.map(userRefRouge => {
      return userRefRouge.get().then(doc => {
        const userRouge = doc.data();

        return userRefRouge.update(
          getStats(userRouge, match.equipeRouge, match.equipeBleue, group)
        );
      });
    })
  ]);
}

exports.addStats = functions.firestore
  .document("matchs/{matchId}")
  .onCreate(async (snap, context) => {
    const match = snap.data();
    // console.log("GROUP ===>", match.group.data());
    console.log("MATCH ===>", match);
    const group = await db
      .collection("groups")
      .doc(match.group.id)
      .get(doc => doc.data());
    return Promise.all([storeStates(match, group)])
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

function storeWeeksStats(stats, group) {
  return Promise.all(
    _.take(_.orderBy(stats, ["points"], ["desc"]), 3).map((stat, index) => {
      return stat.docRef.get().then(user => {
        const userData = user.data();
        const fieldToUpdate = `wins.${group.id}.${labelPosition[index]}`;
        console.log("STATS =======>", stat);
        console.log("group data =======>", group.id);
        console.log("fieldToUpdate =======>", fieldToUpdate);
        console.log("groups =======>", group.path);
        console.log("user path =======>", stat.docRef.path);
        return user.ref.update({
          [fieldToUpdate]: add(_.get(userData, fieldToUpdate), 1)
        });
        // return db
        //   .collection("wins")
        //   .where("user", "==", stat.docRef)
        //   .where("group", "==", group)
        //   .get()
        //   .then(win => {
        //     console.log("win =====>", win);
        //     console.log("win =====>", win.empty);
        //     console.log(_.get(win, fieldToUpdate));
        //     if (!win.empty) {
        //       const winLine = win.docs[0];
        //       return winLine.ref.update({
        //         [fieldToUpdate]: add(_.get(winLine.data(), fieldToUpdate), 1)
        //       });
        //     } else {
        //       return db.collection("wins").add({
        //         [fieldToUpdate]: 1,
        //         user: stat.docRef,
        //         group
        //       });
        //     }
        //   })
        //   .catch(e => {
        //     console.log("erroror", e);
        //   });
        // console.log(
        //   userData.wins,
        //   fieldToUpdate,
        //   _.get(userData, fieldToUpdate),
        //   {
        //     [fieldToUpdate]: add(_.get(userData, fieldToUpdate), 1)
        //   }
        // );
        // return stat.docRef.update({
        //   [fieldToUpdate]: add(_.get(userData, fieldToUpdate), 1)
        // });
      });
    })
  );
}

exports.addWins = functions.firestore
  .document("weeks/{weekId}")
  .onCreate((snap, context) => {
    const statsData = snap.data();
    return Promise.all([storeWeeksStats(statsData.stats, statsData.group)])
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
