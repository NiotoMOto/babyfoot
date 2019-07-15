import React from "react";
import find from "lodash/find";
import orderBy from "lodash/orderBy";
import { UserButton } from "./UserButton";

export const AddMatchTeam = ({
  equipe,
  setEquipe,
  otherEquipe,
  users = [],
  color,
  onClick
}) => {
  const isInOtherEquipe = u =>
    !!otherEquipe.members.find(member => member.value === u.id);
  const muiColor = color === "bleu" ? "primary" : "secondary";
  return (
    <div style={{ padding: "0 8px" }}>
      <div style={{ marginBottom: "20px" }}>
        {orderBy(users, "displayName").map(user => (
          <div key={user.id} style={{ margin: "5px", display: "inline-block" }}>
            <UserButton
              variant={
                [...equipe.members, ...otherEquipe.members].find(
                  member => member.value === user.id
                )
                  ? "default"
                  : "outlined"
              }
              color={isInOtherEquipe(user) ? "default" : muiColor}
              photoURL={user.photoURL}
              onClick={() =>
                !isInOtherEquipe(user) ? onClick(user, color) : null
              }
              label={user.displayName}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
