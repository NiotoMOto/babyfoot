import React from "react";
import { variantStylesLeads } from "../../constants";

function Badge({ label, style }) {
  return (
    <span
      style={{
        display: "flex",
        marginLeft: "4px",
        fontSize: "8px",
        justifyContent: "center",
        alignItems: "center",
        width: "13px",
        height: "13px",
        borderRadius: "50%",
        fontWeight: 500,
        ...style
      }}>
      {label}
    </span>
  );
}

export function Badges({ wins = {} }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
      {wins.first && <Badge label={wins.first} style={variantStylesLeads.or} />}
      {wins.second && (
        <Badge label={wins.second} style={variantStylesLeads.argent} />
      )}
      {wins.third && (
        <Badge label={wins.third} style={variantStylesLeads.bronze} />
      )}
    </div>
  );
}
