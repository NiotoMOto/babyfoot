import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

export function AddMatchButton({ onClick }) {
  return (
    <div>
      <Fab
        style={{ position: "absolute", bottom: "20px", right: "20px" }}
        size="small"
        color="secondary"
        aria-label="Add"
        onClick={onClick}>
        <AddIcon />
      </Fab>
    </div>
  );
}
