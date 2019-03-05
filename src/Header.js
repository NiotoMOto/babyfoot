import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

export function Header() {
  return (
    <AppBar color="primary" position="relative">
      <Toolbar>
        <Typography style={{ color: "white" }} variant="h5">
          Baby-foot
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
