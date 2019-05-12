import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Fab
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { db, extractData } from "../firebaseConfig";
import { firestore } from "firebase/app";
import { AddMatchTeam } from "./AddMatchTeam";
import { AddMatchScore } from "./AddMatchScore";
import AddIcon from "@material-ui/icons/Save";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

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

function getUserAutocomplete(users, usedUsers) {
  return users
    .filter(user => !usedUsers.map(u => u.value).includes(user.id))
    .map(user => ({
      value: user.id,
      label: user.displayName
    }));
}

export function AddMatchdialog({ open, handleClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [equipeBleue, setEquipeBleue] = useState({ members: [], score: 0 });
  const [equipeRouge, setEquipeRouge] = useState({ members: [], score: 0 });
  const [selectedTeam, setSelectedTeam] = useState("bleu");
  const onClickSave = () => {
    setLoading(true);
    saveMatch(equipeBleue, equipeRouge)
      .then(() => handleClose())
      .then(() => setLoading(false))
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
          <Button
            color="inherit"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              saveMatch(equipeBleue, equipeRouge)
                .then(() => handleClose())
                .then(() => setLoading(false))
                .catch(() => setLoading(false));
            }}>
            ajouter
          </Button>
        </Toolbar>
      </AppBar>

      {selectedTeam === "bleu" && (
        <React.Fragment>
          <AddMatchTeam
            equipe={equipeBleue}
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
      <div style={{ margin: "15px", position: "relative" }}>
        <Card
          style={{ background: "#3f51b5" }}
          onClick={() => setSelectedTeam("bleu")}>
          <CardContent style={{ paddingBottom: "43px" }}>
            <div>
              {equipeBleue.members.map(member => (
                <div
                  key={member.value}
                  style={{ margin: "5px", display: "inline-block" }}>
                  <Chip
                    style={{ fontSize: "10px" }}
                    avatar={<Avatar alt="" src={member.photoURL} />}
                    label={
                      <div style={{ display: "flex" }}>
                        {member.displayName}
                      </div>
                    }
                    onClick={() =>
                      setEquipeBleue({
                        ...equipeBleue,
                        members: equipeBleue.members.filter(
                          m => m.value !== member.value
                        )
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <h3 style={{ textAlign: "center", color: "white" }}>
              {equipeBleue.score}
            </h3>
          </CardContent>
        </Card>
        <div
          style={{
            position: "absolute",
            marginTop: "-28px",
            width: "100%",
            display: "flex",
            justifyContent: "center"
          }}>
          <Fab style={{ background: "green" }} onClick={onClickSave}>
            <AddIcon />
          </Fab>
        </div>
        <Card
          style={{ background: "#f51464" }}
          onClick={() => setSelectedTeam("rouge")}>
          <CardContent style={{ paddingTop: "43px" }}>
            <div>
              {equipeRouge.members.map(member => (
                <div style={{ margin: "5px", display: "inline-block" }}>
                  <Chip
                    style={{ fontSize: "10px" }}
                    avatar={<Avatar alt="" src={member.photoURL} />}
                    label={
                      <div style={{ display: "flex" }}>
                        {member.displayName}
                      </div>
                    }
                    onClick={() =>
                      setEquipeRouge({
                        ...equipeRouge,
                        members: equipeRouge.members.filter(
                          m => m.value !== member.value
                        )
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <h3 style={{ textAlign: "center", color: "white" }}>
              {equipeRouge.score}
            </h3>
          </CardContent>
        </Card>
      </div>
    </Dialog>
  );
}
