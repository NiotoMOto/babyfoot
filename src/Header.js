import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { auth } from "./firebaseConfig";

export function Header() {
  return (
    <AppBar color="primary" position="relative">
      <Toolbar>
        <Typography style={{ color: "white", flexGrow: 1 }} variant="h5">
          Baby-foot
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
