import React from "react";
import find from "lodash/find";
import { Chip, Avatar } from "@material-ui/core";

export const AddMatchTeam = ({ equipe, setEquipe, users = [], color }) => {
  const onClickUser = user => {
    const userExitAlready = find(equipe.members, { value: user.id });
    if (userExitAlready) {
      setEquipe({
        ...equipe,
        members: equipe.members.filter(member => member.value !== user.id)
      });
    } else {
      setEquipe({
        ...equipe,
        members: [
          ...equipe.members,
          {
            value: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        ]
      });
    }
  };
  const muiColor = color === "bleu" ? "primary" : "secondary";
  return (
    <div style={{ marginTop: "20px", padding: "30px" }}>
      <div style={{ marginBottom: "20px" }}>
        {users.map(user => (
          <div style={{ margin: "5px", display: "inline-block" }}>
            <Chip
              style={{ fontSize: "10px" }}
              variant={
                equipe.members.find(member => member.value === user.id)
                  ? "default"
                  : "outlined"
              }
              color={muiColor}
              avatar={<Avatar alt="" src={user.photoURL} />}
              label={<div style={{ display: "flex" }}>{user.displayName}</div>}
              onClick={() => onClickUser(user)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
