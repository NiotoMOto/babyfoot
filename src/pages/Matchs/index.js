import React from "react";
import { Matchs } from "../../components/Matchs";

export function MatchsPage({ match, group }) {
  return (
    <div>
      <Matchs group={match.params.group} week={parseInt(match.params.week)} />
    </div>
  );
}
