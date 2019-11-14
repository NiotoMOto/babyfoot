import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import indigo from "@material-ui/core/colors/indigo";
import flatten from "lodash/flatten";
import red from "@material-ui/core/colors/red";
import { User } from "./User";
import { makeStyles } from "@material-ui/styles";
import purple from "@material-ui/core/colors/purple";
import groupBy from "lodash/groupBy";
import merge from "lodash/merge";
import uniqBy from "lodash/uniqBy";

import {
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
  Switch,
  Avatar
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { db, extractData } from "../firebaseConfig";
import { firestore } from "firebase/app";
import { AddMatchTeam } from "./AddMatchTeam";
import { AddMatchScore } from "./AddMatchScore";
import AddIcon from "@material-ui/icons/Save";
import { AddMatchRecap } from "./AddMatchRecap";
import find from "lodash/find";
import { LoaderInline } from "./LoaderInline";
import { DefisLists } from "./DefisLists";
import { AddMatchVocal } from "./AddMatchVocal";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const getDefis = (member, who) =>
  db
    .collection("defis")
    .where(who, "==", member)
    .where("winner", "==", null)
    .where("week", "==", dayjs().week())
    .where("year", "==", dayjs().year())
    .orderBy("createdAt", "desc")
    .get();

const useStyles = makeStyles(theme => ({
  colorSwitchBase: {
    color: indigo[500],
    "& + $colorBar": {
      backgroundColor: indigo[500]
    },
    "&$colorChecked": {
      color: indigo[500],
      "& + $colorBar": {
        backgroundColor: indigo[500]
      }
    }
  },
  colorChecked: {
    color: red[300],
    "&$colorChecked": {
      color: red[900],
      "& + $colorBar": {
        backgroundColor: red[900]
      }
    }
  }
}));

function saveMatch(equipeBleue, equipeRouge, defis, group) {
  const idBlues = equipeBleue.members.map(em => em.value);
  const idRouge = equipeRouge.members.map(er => er.value);
  const matchData = {
    equipeBleue: {
      ...equipeBleue,
      score: equipeBleue.score,
      members: equipeBleue.members.map(m =>
        db.collection("users").doc(m.value)
      ),
      victory: equipeBleue.score > equipeRouge.score,
      defisPoints: idBlues.map(id =>
        defis[id]
          ? { id, points: defis[id].reduce((sum, d) => sum + d.points, 0) }
          : null
      )
    },
    equipeRouge: {
      ...equipeRouge,
      score: equipeRouge.score,
      members: equipeRouge.members.map(m =>
        db.collection("users").doc(m.value)
      ),
      victory: equipeRouge.score > equipeBleue.score,
      defisPoints: idRouge.map(id =>
        defis[id]
          ? { id, points: defis[id].reduce((sum, d) => sum + d.points, 0) }
          : null
      )
    },
    createdAt: firestore.FieldValue.serverTimestamp(),
    week: dayjs(new Date()).week(),
    year: dayjs(new Date()).year(),
    group: db.collection("groups").doc(group)
  };
  return db
    .collection("matchs")
    .add(matchData)
    .then(() => {
      return Promise.all([
        ...flatten(
          idBlues.map(id =>
            defis[id] && equipeBleue.score > equipeRouge.score
              ? defis[id].map(d =>
                  db
                    .collection("defis")
                    .doc(d.id)
                    .update({
                      winner: db.collection("users").doc(id)
                    })
                )
              : Promise.resolve()
          )
        ),
        ...flatten(
          idRouge.map(id =>
            defis[id] && equipeRouge.score > equipeBleue.score
              ? defis[id].map(d =>
                  db
                    .collection("defis")
                    .doc(d.id)
                    .update({
                      winner: db.collection("users").doc(id)
                    })
                )
              : Promise.resolve()
          )
        )
      ]);
    });
}

export function AddMatchdialog({ open, handleClose, group }) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [equipeBleue, setEquipeBleue] = useState({ members: [], score: 0 });
  const [equipeRouge, setEquipeRouge] = useState({ members: [], score: 0 });
  const [matchDefis, setMatchDefis] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("bleu");
  const defiPoints = merge(
    groupBy(matchDefis, "requester.id"),
    groupBy(matchDefis, "sendingTo.id")
  );
  const onClickSave = () => {
    setLoading(true);
    saveMatch(equipeBleue, equipeRouge, defiPoints, group)
      .then(() => handleClose())
      .then(() => {
        setLoading(false);
        setEquipeBleue({ members: [], score: 0 });
        setEquipeRouge({ members: [], score: 0 });
        selectedTeam("bleu");
      })
      .catch(() => setLoading(false));
  };
  useEffect(() => {
    console.log("USE");
    db.collection("users")
      .limit(50)
      .get()
      .then(doc => {
        setUsers(extractData(doc));
      });
  }, []);

  const toggleTeam = () => {
    if (selectedTeam === "bleu") {
      return setSelectedTeam("rouge");
    }
    return setSelectedTeam("bleu");
  };

  const handleClickAddUser = async (user, color) => {
    const setEquipe = color === "rouge" ? setEquipeRouge : setEquipeBleue;
    const equipe = color === "rouge" ? equipeRouge : equipeBleue;
    const userExitAlready = find(equipe.members, { value: user.id });
    let newEquipe = {};
    if (userExitAlready) {
      newEquipe = {
        ...equipe,
        members: equipe.members.filter(member => member.value !== user.id)
      };
    } else {
      newEquipe = {
        ...equipe,
        members: [
          ...equipe.members,
          {
            value: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        ]
      };
    }
    setEquipe(newEquipe);
  };

  // useEffect(
  //   () => {
  //     const members = uniqBy(
  //       [...equipeBleue.members, ...equipeRouge.members],
  //       "value"
  //     ).map(member => db.collection("users").doc(member.value));
  //     console.log("members", members);

  //     Promise.all(
  //       flatten(
  //         members.map(member => [
  //           getDefis(member, "requester"),
  //           getDefis(member, "sendingTo")
  //         ])
  //       )
  //     ).then(results => {
  //       console.log(
  //         "results XHR",
  //         flatten(results.map(res => extractData(res).map(d => d.id)))
  //       );
  //       const d = uniqBy(flatten(results.map(res => extractData(res))), "id");
  //       console.log("d map", d.map(d => d.id));
  //       const md = d.filter(d => {
  //         const idBlues = equipeBleue.members.map(em => em.value);
  //         const idRouge = equipeRouge.members.map(er => er.value);
  //         const isOnWay =
  //           idBlues.includes(d.requester.id) &&
  //           idRouge.includes(d.sendingTo.id);
  //         const isOnOtherWay =
  //           idBlues.includes(d.sendingTo.id) &&
  //           idRouge.includes(d.requester.id);
  //         return !!isOnWay || !!isOnOtherWay;
  //       });
  //       console.log("md map", md.map(d => d.id));
  //       setMatchDefis(md);

  //       console.log(
  //         equipeBleue.members.reduce((sum, member) => sum + member.value, "")
  //       );
  //       console.log(
  //         equipeRouge.members.reduce((sum, member) => sum + member.value, "")
  //       );
  //     });
  //   },
  //   [
  //     equipeRouge.members.reduce((sum, member) => sum + member.value, ""),
  //     equipeBleue.members.reduce((sum, member) => sum + member.value, "")
  //   ]
  // );

  console.log("RENDER matchdefis", matchDefis);
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}>
      <AppBar color="primary" style={{ position: "relative" }}>
        <Toolbar>
          <IconButton color="inherit" onClick={handleClose} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ flex: 1 }}>
            Match
          </Typography>
        </Toolbar>
      </AppBar>
      <AddMatchVocal />
      <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
        <Switch
          onClick={toggleTeam}
          checked={selectedTeam === "rouge"}
          classes={{
            switchBase: classes.colorSwitchBase,
            checked: classes.colorChecked
          }}
        />
      </div>
      {selectedTeam === "bleu" && (
        <React.Fragment>
          <AddMatchTeam
            equipe={equipeBleue}
            otherEquipe={equipeRouge}
            setEquipe={setEquipeBleue}
            users={users}
            color="bleu"
            onClick={handleClickAddUser}
          />
          <AddMatchScore
            equipe={equipeBleue}
            setEquipe={setEquipeBleue}
            users={users}
            color="bleu"
            maxScore={5}
          />
        </React.Fragment>
      )}
      {selectedTeam === "rouge" && (
        <React.Fragment>
          <AddMatchTeam
            equipe={equipeRouge}
            otherEquipe={equipeBleue}
            setEquipe={setEquipeRouge}
            users={users}
            onClick={handleClickAddUser}
            color="rouge"
          />
          <AddMatchScore
            equipe={equipeRouge}
            setEquipe={setEquipeRouge}
            users={users}
            color="rouge"
            maxScore={5}
          />
        </React.Fragment>
      )}
      <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
        <Switch
          onClick={toggleTeam}
          checked={selectedTeam === "rouge"}
          classes={{
            switchBase: classes.colorSwitchBase,
            checked: classes.colorChecked
          }}
        />
      </div>
      <div style={{ margin: "15px", position: "relative" }}>
        <AddMatchRecap
          color="bleu"
          equipe={equipeBleue}
          otherEquipe={equipeRouge}
          setEquipe={setEquipeBleue}
          setSelectedTeam={setSelectedTeam}
          defiPoints={defiPoints}
          styles={{ paddingBottom: "35px" }}
        />
        <div
          style={{
            position: "absolute",
            marginTop: "-28px",
            width: "100%",
            display: "flex",
            justifyContent: "center"
          }}>
          <Fab
            style={{ color: "white", background: "black" }}
            onClick={onClickSave}
            disabled={loading}>
            {loading && <LoaderInline />}
            {!loading && <AddIcon />}
          </Fab>
        </div>
        <AddMatchRecap
          color="rouge"
          equipe={equipeRouge}
          otherEquipe={equipeBleue}
          setEquipe={equipeBleue}
          setSelectedTeam={setSelectedTeam}
          defiPoints={defiPoints}
          styles={{ paddingTop: "35px" }}
        />
        <DefisLists defis={matchDefis} />
      </div>
    </Dialog>
  );
}
