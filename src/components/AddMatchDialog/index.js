import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Divider,
  TextField
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { AutoComplete } from "../AutoComplete";
import { db, extractData } from "../../firebaseConfig";
import { firestore } from "firebase/app";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

function saveMatch(equipeBleue, equipeRouge) {
  const matchData = {
    equipeBleue: {
      ...equipeBleue,
      members: equipeBleue.members.map(m => db.collection("users").doc(m.value))
    },
    equipeRouge: {
      ...equipeRouge,
      members: equipeRouge.members.map(m => db.collection("users").doc(m.value))
    },
    createdAt: firestore.FieldValue.serverTimestamp(),
    week: dayjs(new Date()).week()
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
  const [equipeBleue, setEquipeBleue] = useState({ members: [], score: 0 });
  const [equipeRouge, setEquipeRouge] = useState({ members: [], score: 0 });
  useEffect(() => {
    db.collection("users")
      .limit(50)
      .get()
      .then(doc => {
        setUsers(extractData(doc));
      });
  }, []);
  const autocompleteUsers = getUserAutocomplete(users, [
    ...equipeBleue.members,
    ...equipeRouge.members
  ]);
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
            onClick={() =>
              saveMatch(equipeBleue, equipeRouge).then(() => handleClose())
            }>
            ajouter
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: "20px", padding: "30px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Equipe bleue</h2>
          <AutoComplete
            key="equipeBleue"
            mutli={true}
            suggestions={autocompleteUsers}
            handleChange={value =>
              setEquipeBleue({ ...equipeBleue, members: value })
            }
            value={equipeBleue.members}
            placeholder="Membre(s) de l'équipe bleue"
          />
          <TextField
            type="number"
            label="score"
            onChange={e =>
              setEquipeBleue({ ...equipeBleue, score: e.target.value })
            }
          />
        </div>
        <Divider />
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <h2 style={{ textAlign: "center" }}>Equipe rouge</h2>
          <AutoComplete
            key="equipeRouge"
            mutli={true}
            suggestions={autocompleteUsers}
            handleChange={value =>
              setEquipeRouge({ ...equipeRouge, members: value })
            }
            value={equipeRouge.members}
            placeholder="Membre(s) de l'équipe rouge"
            menuPlacement="top"
          />
          <TextField
            type="number"
            label="score"
            onChange={e =>
              setEquipeRouge({ ...equipeRouge, score: e.target.value })
            }
          />
        </div>
      </div>
    </Dialog>
  );
}
