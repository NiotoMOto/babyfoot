import React from "react";
import { Matchs } from "../../components/Matchs";

export function MatchsPage({ match, setTitle, setColor }) {
  return (
    <div>
      <Matchs
        setTitle={setTitle}
        setColor={setColor}
        group={match.params.group}
        week={parseInt(match.params.week)}
      />
    </div>
  );
}
