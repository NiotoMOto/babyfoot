import React, { useEffect, useState } from "react";
import {
  Dialog,
  Slide,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Divider
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { AutoComplete } from "../AutoComplete";
import { db, extractData } from "../../firebaseConfig";

function Transition(props) {
  return <Slide direction="up" {...props} />;
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
  const [equipe1, setEquipe1] = useState([]);
  const [equipe2, setEquipe2] = useState([]);
  useEffect(() => {
    db.collection("users")
      .limit(50)
      .get()
      .then(doc => {
        setUsers(extractData(doc));
      });
  }, []);
  const autocompleteUsers = getUserAutocomplete(users, [
    ...equipe1,
    ...equipe2
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
          <Button color="inherit" onClick={handleClose}>
            ajouter
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ textAlign: "center" }}>
        <h2>Equipe 1</h2>
        <AutoComplete
          mutli={true}
          suggestions={autocompleteUsers}
          handleChange={value => setEquipe1(value)}
          value={equipe1}
        />
        <Divider />
        <h2>Equipe 2</h2>
        <AutoComplete
          mutli={true}
          suggestions={autocompleteUsers}
          handleChange={value => setEquipe2(value)}
          value={equipe2}
        />
      </div>
    </Dialog>
  );
}
