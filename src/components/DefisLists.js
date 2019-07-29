import React from "react";
import { User } from "./User";
import { Avatar, Typography } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import { useGroupContext } from "./Matchs";

export function DefisLists({ defis }) {
  const group = useGroupContext();
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
            <User currenGroup={group} docRef={md.requester} />
            <User currenGroup={group} docRef={md.sendingTo} />
          </div>
          <div>
            <Avatar style={{ background: purple[500] }}>{md.points}</Avatar>
          </div>
        </div>
      ))}
    </div>
  );
}
