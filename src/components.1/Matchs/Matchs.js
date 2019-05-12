import React, { useState, useEffect } from "react";
import { AddMatchButton } from "../AddMatchButton";
import { AddMatchdialog } from "../AddMatchDialog";
import { db, extractData } from "../../firebaseConfig";
import { Match } from "../Match";
import dayjs from "dayjs";
import { Typography, Button } from "@material-ui/core";
import { MatchsStats } from "../MatchsStats";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "@material-ui/icons";

function getTitle(currentWeek, week, year, currentYear) {
  return currentWeek === week && year === currentYear
    ? "Matchs de cette semaine"
    : `Matchs de la semaine ${week}`;
}
function getTitleStats(currentWeek, week, year, currentYear) {
  return currentWeek === week && year === currentYear
    ? "Stats de cette semaine"
    : `Stats de la semaine ${week}`;
}

export function Matchs({ week = dayjs().week(), year = dayjs().year() }) {
  const [openAddMatch, setOpenAddMatch] = useState(false);
  const [matchs, setMatchs] = useState([]);
  const [points, setPoints] = useState(null);
  const currentWeek = dayjs().week();
  const currentYear = dayjs().year();
  useEffect(
    () => {
      const unsubscribe = db
        .collection("matchs")
        .where("week", "==", week)
        .orderBy("createdAt", "desc")
        .onSnapshot(doc => {
          setMatchs(extractData(doc));
        });

      return () => unsubscribe();
    },
    [week, year]
  );

  useEffect(() => {
    db.collection("points").onSnapshot(doc => {
      setPoints(extractData(doc)[0]);
    });
  }, []);
  return (
    <div style={{ marginBottom: "90px", marginTop: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {week - 1 > 0 && (
          <Link to={`/matchs/${week - 1}`}>
            <Button disabled={week - 1 <= 0}>
              <ChevronLeft color="primary" />
              Semaine {week - 1}
            </Button>
          </Link>
        )}
        {week - 1 <= 0 && <div />}
        {week !== currentWeek && (
          <Link to={`/matchs/${week + 1}`}>
            <Button disabled={week === currentWeek}>
              Semaine {week + 1}
              <ChevronRight color="primary" />
            </Button>
          </Link>
        )}
      </div>
      <Typography style={{ margin: "10px" }} variant="h5">
        {getTitleStats(currentWeek, week, year, currentYear)}
      </Typography>
      <div style={{ margin: "10px" }}>
        {points && <MatchsStats points={points} week={week} matchs={matchs} />}
      </div>
      <Typography style={{ margin: "10px" }} variant="h5">
        {getTitle(currentWeek, week, year, currentYear)}
      </Typography>
      {week === currentWeek && (
        <AddMatchButton onClick={() => setOpenAddMatch(true)} />
      )}
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
