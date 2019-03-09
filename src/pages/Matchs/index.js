import React from "react";
import { Matchs } from "../../components/Matchs";

export function MatchsPage({ match }) {
  return (
    <div>
      <Matchs week={parseInt(match.params.week)} />
    </div>
  );
}
