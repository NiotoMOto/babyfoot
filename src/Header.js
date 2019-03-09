import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { auth } from "./firebaseConfig";
import { Link } from "react-router-dom";

export function Header() {
  return (
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
  );
}
