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
  return (
    <div>
      <Button color="primary" onClick={update}>
        Update
      </Button>
    </div>
  );
}
