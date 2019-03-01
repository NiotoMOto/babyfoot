import React from "react";
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

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export function AddMatchdialog({ open, handleClose }) {
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
            Sound
          </Typography>
          <Button color="inherit" onClick={handleClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ textAlign: "center" }}>
        <h2>Equipe 1</h2>
        <AutoComplete mutli={true} />
        <Divider />
        <h2>Equipe 2</h2>
        <AutoComplete mutli={true} />
      </div>
    </Dialog>
  );
}
