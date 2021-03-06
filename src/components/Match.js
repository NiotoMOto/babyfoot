import React from "react";
import { Team } from "./Team";
import { Avatar, Paper, Divider } from "@material-ui/core";

const teamStyle = {
  alignItems: "center",
  justifyContent: "space-between",
  display: "flex",
  flexDirection: "row",
  padding: "10px"
};

export function Match({ match }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", margin: "10px" }}>
        <Paper>
          <div style={teamStyle}>
            <Team
              members={match.equipeRouge.members}
              defisPoints={match.equipeRouge.defisPoints}
              victory={match.equipeRouge.victory}
            />
            <Avatar style={{ background: "rgb(245, 7, 92)" }}>
              {match.equipeRouge.score}
            </Avatar>
          </div>
          <span
            style={{ position: "absolute", right: "50%", marginTop: "-8px" }}>
            VS
          </span>
          <Divider />
          <div style={teamStyle}>
            <Team
              members={match.equipeBleue.members}
              defisPoints={match.equipeBleue.defisPoints}
              victory={match.equipeBleue.victory}
            />
            <div>
              <Avatar style={{ background: "rgba(63, 81, 181, 1)" }}>
                {match.equipeBleue.score}
              </Avatar>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}
