import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import indigo from "@material-ui/core/colors/indigo";
import red from "@material-ui/core/colors/red";
import { makeStyles } from "@material-ui/styles";

import {
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Fab,
  Switch
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { db, extractData } from "../firebaseConfig";
import { firestore } from "firebase/app";
import { AddMatchTeam } from "./AddMatchTeam";
import { AddMatchScore } from "./AddMatchScore";
import AddIcon from "@material-ui/icons/Save";
import { AddMatchRecap } from "./AddMatchRecap";
import { LoaderInline } from "./LoaderInline";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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

function saveMatch(equipeBleue, equipeRouge) {
  const matchData = {
    equipeBleue: {
      ...equipeBleue,
      score: equipeBleue.score,
      members: equipeBleue.members.map(m =>
        db.collection("users").doc(m.value)
      ),
      victory: equipeBleue.score > equipeRouge.score
    },
    equipeRouge: {
      ...equipeRouge,
      score: equipeRouge.score,
      members: equipeRouge.members.map(m =>
        db.collection("users").doc(m.value)
      ),
      victory: equipeRouge.score > equipeBleue.score
    },
    createdAt: firestore.FieldValue.serverTimestamp(),
    week: dayjs(new Date()).week(),
    year: dayjs(new Date()).year()
  };
  return db.collection("matchs").add(matchData);
}

function getUserAutocomplete(users, usedUsers, classes) {
  return users
    .filter(user => !usedUsers.map(u => u.value).includes(user.id))
    .map(user => ({
      value: user.id,
      label: user.displayName
    }));
}

export function AddMatchdialog({ open, handleClose }) {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [equipeBleue, setEquipeBleue] = useState({ members: [], score: 0 });
  const [equipeRouge, setEquipeRouge] = useState({ members: [], score: 0 });
  const [selectedTeam, setSelectedTeam] = useState("bleu");
  const onClickSave = () => {
    setLoading(true);
    saveMatch(equipeBleue, equipeRouge)
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
          setEquipe={setEquipeBleue}
          setSelectedTeam={setSelectedTeam}
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
            style={{ color: "white", background: loading ? "grey" : "black" }}
            onClick={onClickSave}
            disabled={loading}>
            {loading && <LoaderInline />}
            {!loading && <AddIcon />}
          </Fab>
        </div>
        <AddMatchRecap
          color="rouge"
          equipe={equipeRouge}
          setEquipe={equipeBleue}
          setSelectedTeam={setSelectedTeam}
          styles={{ paddingTop: "35px" }}
        />
      </div>
    </Dialog>
  );
}
