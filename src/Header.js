import React, { Fragment, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@material-ui/core";
import { auth } from "./firebaseConfig";
import { Link } from "react-router-dom";
import KingOfBaby from "./assets/KingOfBaby.png";

export function Header() {
  return (
    <Fragment>
      <AppBar color="primary" position="relative">
        <Toolbar>
          <Link to="/">
            <img
              height="40px"
              style={{ marginRight: "10px" }}
              src={KingOfBaby}
              alt=""
            />
          </Link>
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
