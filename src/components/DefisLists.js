import React from "react";
import { User } from "./User";
import { Avatar, Typography } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";

export function DefisLists({ defis }) {
  console.log("defis", defis.map(d => d.id));
  return (
    <div>
      {defis.length > 0 && (
        <Typography style={{ textAlign: "center" }} variant="headline">
          Defis
        </Typography>
      )}
      {defis.map(md => (
        <div
          key={md.id}
          style={{
            display: "flex",
            padding: "10px",
            alignItems: "center"
          }}>
          <div>
            <User docRef={md.requester} />
            <User docRef={md.sendingTo} />
          </div>
          <div>
            <Avatar style={{ background: purple[500] }}>{md.points}</Avatar>
          </div>
        </div>
      ))}
    </div>
  );
}
