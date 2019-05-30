import React from "react";
import purple from "@material-ui/core/colors/purple";

export function DefisPoints({ points, sign }) {
  return (
    <span
      style={{
        color: purple[500],
        display: "inline-block",
        marginLeft: "15px",
        fontWeight: "bold",
        fontSize: "14px"
      }}>
      {sign} {points}
    </span>
  );
}
