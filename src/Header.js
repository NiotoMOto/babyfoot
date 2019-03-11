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
import MenuIcon from "@material-ui/icons/Menu";

export function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <Fragment>
      <AppBar color="primary" position="relative">
        <Toolbar>
          <Typography style={{ color: "white", flexGrow: 1 }} variant="h5">
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              Baby-foot
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
