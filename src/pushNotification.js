import firebase from "firebase";
import get from "lodash/get";
import { db } from "./firebaseConfig";

export const askForPermissioToReceiveNotifications = async user => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    if (get(user, "pushTokens", []).indexOf(token) < 0) {
      await db
        .collection("users")
        .doc(user.uid)
        .update({
          ...user,
          pushTokens: [...get(user, "pushTokens", []), ...[token]]
        });
    }
    return token;
  } catch (error) {
    console.log(error);
    return error;
  }
};
