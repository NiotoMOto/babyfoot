import React, { Fragment, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  Snackbar
} from "@material-ui/core";
import { auth } from "./firebaseConfig";
import { Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import { ListItem } from "semantic-ui-react";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Notifications";
import CloseIcon from "@material-ui/icons/Close";

import { UserContext } from "./App";
import { askForPermissioToReceiveNotifications } from "./pushNotification";

function SnakBar({ open, handleClose }) {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={<span id="message-id">Notifications activées</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      ]}
    />
  );
}

function Menu() {
  const [notifDone, setNotifDone] = useState(false);
  return (
    <UserContext.Consumer>
      {me => (
        <div style={{ width: "250px" }}>
          <List style={{ marginLeft: "10px" }}>
            <ListItem
              style={{
                width: "100%",
                display: "flex",
                position: "relative",
                boxSizing: "border-box",
                textAlign: "left",
                alignItems: "center",
                paddingTop: "11px",
                paddingBottom: "11px",
                justifyContent: "flex-start",
                textDecoration: "none"
              }}
              onClick={async () => {
                try {
                  await askForPermissioToReceiveNotifications(me);
                  setNotifDone(true);
                } catch (e) {}
              }}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
          </List>
          <SnakBar open={notifDone} handleClose={() => setNotifDone(false)} />
        </div>
      )}
    </UserContext.Consumer>
  );
}

export function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <Fragment>
      <Drawer open={menu} onClose={() => setMenu(false)}>
        <div tabIndex={0} role="button">
          <Menu />
        </div>
      </Drawer>
      <AppBar color="primary" position="relative">
        <Toolbar>
          <IconButton
            onClick={() => setMenu(true)}
            color="inherit"
            aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography style={{ color: "white", flexGrow: 1 }} variant="h5">
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              King of baby
            </Link>
          </Typography>
          <Button
            onClick={() =>
              auth()
                .signOut()
                .then(() => window.location.reload())
            }
            color="inherit">
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}
