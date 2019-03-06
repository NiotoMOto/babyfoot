import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

export function AddMatchButton({ onClick }) {
  return (
    <div>
      <Fab
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 99,
          color: "white",
          background: "black"
        }}
        size="medium"
        aria-label="Add"
        onClick={onClick}>
        <AddIcon />
      </Fab>
    </div>
  );
}
