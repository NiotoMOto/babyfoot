import React, { useEffect } from "react";
import { Defi } from "./Defi";
import { db, extractData } from "../../firebaseConfig";
import { Button } from "@material-ui/core";

export function DefiPage({ match }) {
  let group = null;
  const update = () =>
    db
      .collection("groups")
      .get()
      .then(groupDoc => {
        group = extractData(groupDoc)[0];
        return group;
      })
      .then(() => {
        db.collection("matchs")
          .get()
          .then(doc => {
            const matchs = extractData(doc);
            console.log("matchs a metre a jours :", matchs.length);
            return matchs;
          })
          .then(matchs => {
            return Promise.all(
              matchs.map(match =>
                db
                  .collection("matchs")
                  .doc(match.id)
                  .update({
                    group: db.collection("groups").doc(group.id)
                  })
              )
            ).then(() => console.log("ALL FINISHED"));
          });
      });

  const updateUsers = () =>
    db
      .collection("groups")
      .get()
      .then(groupDoc => {
        group = extractData(groupDoc)[0];
        return group;
      })
      .then(() => {
        db.collection("users")
          .get()
          .then(doc => {
            const users = extractData(doc);
            return users;
          })
          .then(users => {
            return Promise.all(
              users.map(user =>
                db
                  .collection("users")
                  .doc(user.id)
                  .update({
                    [`stats.1FdIL0Xk5GWr8HVlvyoG`]: user.stats
                      ? user.stats
                      : null,
                    [`wins.1FdIL0Xk5GWr8HVlvyoG`]: user.wins ? user.wins : null
                  })
              )
            ).then(() => console.log("ALL FINISHED"));
          });
      });
  return (
    <div>
      <Button color="primary" onClick={update}>
        Update Matchs
      </Button>
      <Button color="primary" onClick={updateUsers}>
        Update users
      </Button>
    </div>
  );
}
