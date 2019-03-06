import React from "react";
import { Matchs } from "../../components/Matchs";

export function MatchsPage({ match }) {
  return <Matchs week={parseInt(match.params.week)} />;
}
