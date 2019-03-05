import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import firebaseui from "firebaseui";

const config = {
  apiKey: "AIzaSyD9tZe0QQNZIpyugTkqrwiGyMb7JqOVFvo",
  authDomain: "babyfoot-5ca0a.firebaseapp.com",
  databaseURL: "https://babyfoot-5ca0a.firebaseio.com",
  projectId: "babyfoot-5ca0a",
  storageBucket: "babyfoot-5ca0a.appspot.com",
  messagingSenderId: "736751591167"
};

firebase.initializeApp(config);

export const db = firebase.firestore();
firebase.firestore().enablePersistence();
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
