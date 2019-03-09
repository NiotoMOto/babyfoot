import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebaseui from "firebaseui";
import { config } from "./firebase.configs";

firebase.initializeApp(config);

export const db = firebase.firestore();
firebase
  .firestore()
  .enablePersistence({ experimentalTabSynchronization: true });
// export const storage = firebase.storage();

export const provider = new firebase.auth.GoogleAuthProvider();
export const currentUser = firebase.auth().currentUser;
export const auth = firebase.auth;
export const ui = new firebaseui.auth.AuthUI(firebase.auth());

export const firebaseStorageUri =
  "https://firebasestorage.googleapis.com/v0/b/team-e7fdd.appspot.com/o/";

export function extractData(querySnapshot) {
  let d = [];
  querySnapshot.forEach(doc => {
    d.push({ ...doc.data(), id: doc.id });
  });
  return d;
}
