import firebase from "firebase";
import get from "lodash/get";
import { db } from "./firebaseConfig";

export const askForPermissioToReceiveNotifications = async user => {
  try {
    console.log("ro");
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log(token);
    console.log(get(user, "pushTokens", []).indexOf(token));
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
    alert(error);
    return error;
  }
};
