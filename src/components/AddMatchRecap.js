import React from "react";
import { Chip, Avatar, CardContent } from "@material-ui/core";

export const AddMatchRecap = ({ equipe, setSelectedTeam, color, styles }) => {
  const sytleColor =
    color === "bleu" ? "rgba(63, 81, 181, 1)" : "rgb(245, 7, 92)";
  console.log(equipe.members);
  return (
    <div
      style={{ borderColor: sytleColor }}
      onClick={() => setSelectedTeam("rouge")}>
      <CardContent style={styles}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {equipe.members.map(member => (
              <div style={{ margin: "5px", display: "inline-block" }}>
                <Chip
                  style={{ fontSize: "10px" }}
                  avatar={<Avatar alt="" src={member.photoURL} />}
                  label={
                    <div style={{ display: "flex" }}>{member.displayName}</div>
                  }
                />
              </div>
            ))}
          </div>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Avatar style={{ background: sytleColor }}>{equipe.score}</Avatar>
          </div>
        </div>
        {/* <div style={{ justifyContent: "center", display: "flex" }}>
          <Avatar style={{ background: sytleColor }}>{equipe.score}</Avatar>
        </div> */}
      </CardContent>
    </div>
  );
};
