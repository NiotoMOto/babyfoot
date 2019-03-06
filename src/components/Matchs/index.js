import React, { useState, useEffect } from "react";
import { AddMatchButton } from "../../components/AddMatchButton";
import { AddMatchdialog } from "../../components/AddMatchDialog";
import { db, extractData } from "../../firebaseConfig";
import { Match } from "../../components/Match";
import dayjs from "dayjs";
import { Typography } from "@material-ui/core";

function getTitle(currentWeek, week) {
  return currentWeek === week
    ? "Matchs de cette semaine"
    : `Matchs de la semaine ${week}`;
}

export function Matchs({ week = dayjs(new Date()).week() }) {
  const [openAddMatch, setOpenAddMatch] = useState(false);
  const [matchs, setMatchs] = useState([]);
  const currentWeek = dayjs(new Date()).week();
  useEffect(() => {
    console.log(week);
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
      <Typography style={{ margin: "10px" }} variant="h4">
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
