import React from "react";
import Fab from "@material-ui/core/Fab";
import { FitnessCenter } from "@material-ui/icons";
import purple from "@material-ui/core/colors/purple";

export function AddDefiButton({ onClick }) {
  return (
    <div>
      <Fab
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          zIndex: 99,
          color: "white",
          background: purple[400]
        }}
        size="medium"
        aria-label="Add"
        onClick={onClick}
      >
        <FitnessCenter />
      </Fab>
    </div>
  );
}
