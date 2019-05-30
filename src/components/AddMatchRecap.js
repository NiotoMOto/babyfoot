import React, { Fragment } from "react";
import { Chip, Avatar, CardContent } from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";

export const AddMatchRecap = ({
  equipe,
  otherEquipe,
  setSelectedTeam,
  color,
  styles,
  defiPoints
}) => {
  const sytleColor =
    color === "bleu" ? "rgba(63, 81, 181, 1)" : "rgb(245, 7, 92)";

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
                {defiPoints[member.value] && (
                  <span
                    style={{
                      color: purple[500],
                      display: "inline-block",
                      marginLeft: "15px",
                      fontWeight: "bold"
                    }}>
                    {equipe.score !== otherEquipe.score && (
                      <Fragment>
                        <span>
                          {equipe.score > otherEquipe.score ? "+" : "-"}{" "}
                        </span>
                        <span>
                          {defiPoints[member.value].reduce(
                            (sum, d) => sum + d.points,
                            0
                          )}
                        </span>
                      </Fragment>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              justifyContent: "center",
              display: "flex",
              flexDirection: "column"
            }}>
            <Avatar style={{ background: sytleColor }}>{equipe.score}</Avatar>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
