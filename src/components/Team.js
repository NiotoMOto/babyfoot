import React from "react";
import purple from "@material-ui/core/colors/purple";
import { User } from "./User";

export function Team({ members, defisPoints = [], victory }) {
  return (
    <div>
      {members.map(member => (
        <div key={member.path} style={{ marginBottom: "5px" }}>
          <User docRef={member} />
          {defisPoints.filter(d => d).find(d => d.id === member.id) && (
            <span
              style={{
                color: purple[500],
                display: "inline-block",
                marginLeft: "15px",
                fontWeight: "bold"
              }}>
              {victory ? "+" : "-"}{" "}
              {defisPoints.filter(d => d).find(d => d.id === member.id).points}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
