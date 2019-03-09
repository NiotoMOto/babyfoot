import React, { useState, useEffect } from "react";
import { AddMatchButton } from "../../components/AddMatchButton";
import { AddMatchdialog } from "../../components/AddMatchDialog";
import { db, extractData } from "../../firebaseConfig";
import { Match } from "../../components/Match";
import dayjs from "dayjs";
import { Typography } from "@material-ui/core";
import { MatchsStats } from "../MatchsStats";

function getTitle(currentWeek, week) {
  return currentWeek === week
    ? "Matchs de cette semaine"
    : `Matchs de la semaine ${week}`;
}
function getTitleStats(currentWeek, week) {
  return currentWeek === week
    ? "Stats de cette semaine"
    : `Stats de la semaine ${week}`;
}

export function Matchs({ week = dayjs(new Date()).week() }) {
  const [openAddMatch, setOpenAddMatch] = useState(false);
  const [matchs, setMatchs] = useState([]);
  const currentWeek = dayjs(new Date()).week();
  useEffect(() => {
    const unsubscribe = db
      .collection("matchs")
      .where("week", "==", week)
      .orderBy("createdAt", "desc")
      .onSnapshot(doc => {
        setMatchs(extractData(doc));
      });

    return () => unsubscribe();
  }, []);
  return (
    <div style={{ marginBottom: "90px", marginTop: "30px" }}>
      <Typography style={{ margin: "10px" }} variant="h5">
        {getTitleStats(currentWeek, week)}
      </Typography>
      <div style={{ margin: "10px" }}>
        <MatchsStats week={week} matchs={matchs} />
      </div>
      <Typography style={{ margin: "10px" }} variant="h5">
        {getTitle(currentWeek, week)}
      </Typography>
      <AddMatchButton onClick={() => setOpenAddMatch(true)} />
      <AddMatchdialog
        open={openAddMatch}
        handleClose={() => setOpenAddMatch(false)}
      />
      {matchs.map((match, id) => (
        <Match key={id} match={match} />
      ))}
    </div>
  );
}
