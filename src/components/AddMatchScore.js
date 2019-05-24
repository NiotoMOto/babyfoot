import React from "react";
import times from "lodash/times";
import { Avatar } from "@material-ui/core";

// background: "rgba(63, 81, 181, 1)"
//  background: "rgb(245, 7, 92)"

export const AddMatchScore = ({ equipe, setEquipe, color, maxScore = 5 }) => {
  const setScore = score => setEquipe({ ...equipe, score });
  const scoreArray = times(maxScore);
  const muiColor = color === "bleu" ? "primary" : "secondary";
  const sytleColor =
    color === "bleu" ? "rgba(63, 81, 181, 1)" : "rgb(245, 7, 92)";

  return (
    <div>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center"
        }}>
        <Avatar
          color={muiColor}
          onClick={() => setScore(0)}
          checked={equipe.score >= 0}
          style={{
            background: equipe.score === 0 ? sytleColor : ""
          }}>
          0
        </Avatar>
        {scoreArray.map(number => (
          <Avatar
            key={number}
            onClick={() => setScore(number + 1)}
            style={{
              background: equipe.score === number + 1 ? sytleColor : "",
              marginLeft: "7px"
            }}>
            {number + 1}
          </Avatar>
        ))}
      </div>
    </div>
  );
};
