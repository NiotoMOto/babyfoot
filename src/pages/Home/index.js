import React, { useEffect } from "react";
import { Matchs } from "../../components/Matchs";
import Link from "react-router-dom/Link";
import dayjs from "dayjs";
import { Typography } from "@material-ui/core";

export function Home() {
  useEffect(() => {}, []);
  return (
    <div>
      <Typography variant="h2">Bienvenue sur King of baby</Typography>
      <Link to={`/matchs/${dayjs().week()}`}>Matchs de cette semaine</Link>
      <div>
        Tournois en cours<div />
      </div>
    </div>
  );
}
