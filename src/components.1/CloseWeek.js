import React, { useEffect, useState, Fragment } from "react";
import { UserContext } from "../App";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions
} from "@material-ui/core";
import { db, extractData } from "../firebaseConfig";
import dayjs from "dayjs";

function handleCloseWeek(week, stats, year) {
  return db.collection("weeks").add({ stats, week, year: dayjs().year() });
}

export function CloseWeek({ year = dayjs().year(), week, stats }) {
  const [matchs, setMatchs] = useState([]);
  const [weekDb, setWeekDb] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  useEffect(
    () => {
      db.collection("matchs")
        .where("week", "==", week)
        .orderBy("createdAt", "desc")
        .get()
        .then(doc => {
          setMatchs(extractData(doc));
        });
      db.collection("weeks")
        .where("week", "==", week)
        .where("year", "==", year)
        .onSnapshot(doc => {
          if (doc.docs.length) {
            setWeekDb(extractData(doc)[0]);
          }
        });
    },
    [week]
  );
  return (
    <UserContext.Consumer>
      {me => (
        <div style={{ textAlign: "center" }}>
          {me.admin && (
            <Fragment>
              <Button
                onClick={() => setConfirmOpen(true)}
                disabled={!!(matchs.length <= 0 || weekDb)}
                color="primary">
                Fermer la semaine
              </Button>
              <Dialog open={confirmOpen}>
                <DialogContent>
                  Etes-vous sûre de vouloir cloturer la semaine {week}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmOpen(false)}>Non</Button>{" "}
                  <Button
                    onClick={() =>
                      handleCloseWeek(week, stats).then(() =>
                        setConfirmOpen(false)
                      )
                    }>
                    Oui
                  </Button>
                </DialogActions>
              </Dialog>
            </Fragment>
          )}
        </div>
      )}
    </UserContext.Consumer>
  );
}
