import React, { useState, useEffect, Fragment } from "react";
import {
  Typography,
  Button,
  Avatar,
  Tabs,
  Paper,
  Tab,
  Card,
  CardActions
} from "@material-ui/core";
import { db, extractData } from "../../firebaseConfig";
import { useUserContext } from "../../App";
import { UserButton } from "../../components/UserButton";
import isEmpty from "lodash/isEmpty";
import { User } from "../../components/User";
import { CardContent } from "semantic-ui-react";
import dayjs from "dayjs";
import { useGroupContext } from "../../components/Matchs";

const saveDefi = (currentUser, contender) => {
  const day = dayjs();
  return db.collection("defis").add({
    requester: db.collection("users").doc(currentUser.uid),
    sendingTo: db.collection("users").doc(contender.uid),
    points: 2,
    winner: null,
    week: day.week(),
    year: day.year(),
    day: day.day(),
    createdAt: new Date()
  });
};

export function Defi() {
  const [defis, setDefis] = useState([]);
  const [defisAgainstYou, setDefisAgainstYou] = useState([]);
  const [defisToday, setDefisTOday] = useState([]);
  const [contender, setContender] = useState({});
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const day = dayjs();
  function handleChange(event, newValue) {
    setTab(newValue);
  }

  useEffect(() => {
    const unsubscribe = db
      .collection("defis")
      .where("requester", "==", db.collection("users").doc(currentUser.uid))
      .where("winner", "==", null)
      .where("week", "==", day.week())
      .where("year", "==", day.year())
      .orderBy("createdAt", "desc")
      .onSnapshot(doc => {
        setDefis(extractData(doc));
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("defis")
      .where("sendingTo", "==", db.collection("users").doc(currentUser.uid))
      .where("winner", "==", null)
      .where("week", "==", day.week())
      .where("year", "==", day.year())
      .orderBy("createdAt", "desc")
      .onSnapshot(doc => {
        setDefisAgainstYou(extractData(doc));
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection("defis")
      .where("requester", "==", db.collection("users").doc(currentUser.uid))
      .where("day", "==", day.day())
      .where("week", "==", day.week())
      .where("year", "==", day.year())
      .orderBy("createdAt", "desc")
      .onSnapshot(doc => {
        setDefisTOday(extractData(doc));
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    db.collection("users")
      .limit(50)
      .get()
      .then(doc => {
        setUsers(extractData(doc));
      });
  }, []);
  const currentUser = useUserContext();
  const group = useGroupContext();
  return (
    <div style={{ margin: "30px 10px 90px 10px" }}>
      <Typography style={{ margin: "10px" }} variant="h5">
        Defi
      </Typography>
      <Card>
        <CardContent>
          {users
            .filter(user => user.uid !== currentUser.uid)
            .map(user => (
              <UserButton
                key={user.id}
                color={user.uid === contender.uid ? "primary" : "default"}
                label={user.displayName}
                photoURL={user.photoURL}
                onClick={() => setContender(user)}
              />
            ))}
        </CardContent>
        <CardActions>
          <div
            style={{
              textAlign: "center",
              display: "flex",
              alignItems: "center"
            }}>
            <Button
              onClick={() => {
                setLoading(true);
                saveDefi(currentUser, contender)
                  .then(() => setContender({}))
                  .then(() => setLoading(false));
              }}
              color="primary"
              disabled={isEmpty(contender) || loading || defisToday.length >= 2}
              variant="contained">
              Enregister defi
            </Button>
            <div style={{ paddingLeft: "10px" }}>
              {defisToday.length >= 2 && <span>2 défis par jours maximum</span>}
            </div>
          </div>
        </CardActions>
      </Card>
      <div>
        <Typography style={{ margin: "10px" }} variant="h5">
          Défis en attente
        </Typography>
        <Paper square>
          <Tabs value={tab} onChange={handleChange}>
            <Tab label="Vos defis" />
            <Tab label="Defis contre vous" />
          </Tabs>
          <div style={{ padding: "10px" }}>
            {tab === 0 && (
              <Fragment>
                {defis.map(defi => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px"
                    }}>
                    <User currenGroup={group} docRef={defi.sendingTo} />
                    <Avatar style={{ background: "rgb(245, 7, 92)" }}>
                      {defi.points}
                    </Avatar>
                  </div>
                ))}
              </Fragment>
            )}
            {tab === 1 && (
              <Fragment>
                {defisAgainstYou.map(defi => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px"
                    }}>
                    <User currenGroup={group} docRef={defi.requester} />
                    <Avatar style={{ background: "rgb(245, 7, 92)" }}>
                      {defi.points}
                    </Avatar>
                  </div>
                ))}
              </Fragment>
            )}
          </div>
        </Paper>
      </div>
    </div>
  );
}
