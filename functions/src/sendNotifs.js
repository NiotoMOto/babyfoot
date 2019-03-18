const functions = require("firebase-functions");

module.exports = {
  sendNotifs: functions.firestore
    .document("matchs/{matchId}")
    .onCreate(snap => {
      return "SEND OK";
    })
};
