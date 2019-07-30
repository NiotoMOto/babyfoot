import React, { useState, useEffect, useContext, Fragment } from "react";
import { AddMatchButton } from "./AddMatchButton";
import { AddMatchdialog } from "./AddMatchDialog";
import { db, extractData } from "../firebaseConfig";
import { Match } from "./Match";
import dayjs from "dayjs";
import {
  Typography,
  Button,
  Fab,
  Dialog,
  DialogContent
} from "@material-ui/core";
import { MatchsStats } from "./MatchsStats";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft, FitnessCenter } from "@material-ui/icons";
import { AddDefiButton } from "./AddDefiButton";

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

export const GroupContext = React.createContext();

export const useGroupContext = () => useContext(GroupContext);

export function Matchs({
  week = dayjs().week(),
  year = dayjs().year(),
  group,
  setTitle,
  setColor
}) {
  const [openAddMatch, setOpenAddMatch] = useState(false);
  const [openAddDefi, setOpenAddDefi] = useState(false);
  if (setTitle) {
  }

  const [matchs, setMatchs] = useState([]);
  const [points, setPoints] = useState(null);
  const currentWeek = dayjs().week();
  const currentYear = dayjs().year();
  useEffect(() => {
    const unsubscribe = db
      .collection("matchs")
      .where("week", "==", week)
      .where("year", "==", year)
      .where("group", "==", db.collection("groups").doc(group))
      .orderBy("createdAt", "desc")
      .onSnapshot(doc => {
        setMatchs(extractData(doc));
      });

    return () => unsubscribe();
  }, [week, year]);

  useEffect(() => {
    db.collection("groups")
      .doc(group)
      .onSnapshot(doc => {
        const data = doc.data();
        if (data) {
          setPoints(data.points);
          if (setTitle) {
            setTitle(data.name);
          }
          console.log(data.color, setColor);
          if (setColor) {
            setColor(data.color);
          }
        }
      });
  }, []);

  return (
    <GroupContext.Provider value={group}>
      <div style={{ marginBottom: "90px", marginTop: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {week - 1 > 0 && (
            <Link to={`/matchs/${group}/${year}/${week - 1}`}>
              <Button disabled={week - 1 <= 0}>
                <ChevronLeft color="primary" />
                Semaine {week - 1}
              </Button>
            </Link>
          )}
          {week - 1 <= 0 && <div />}
          {week !== currentWeek && (
            <Link to={`/matchs/${group}/${year}/${week + 1}`}>
              <Button disabled={week === currentWeek}>
                Semaine {week + 1}
                <ChevronRight color="primary" />
              </Button>
            </Link>
          )}
        </div>
        <div style={{ margin: "10px" }}>
          {/* <Link to="/defi">
          <Fab
            size="small"
            color="primary"
            variant="extended"
            aria-label="Delete">
            <FitnessCenter /> Défis
          </Fab>
        </Link> */}
        </div>
        <Typography style={{ margin: "10px" }} variant="h5">
          {getTitleStats(currentWeek, week, year, currentYear)}
        </Typography>
        <div style={{ margin: "10px" }}>
          <MatchsStats
            points={points}
            week={week}
            matchs={matchs}
            group={group}
          />
        </div>
        <Typography style={{ margin: "10px" }} variant="h5">
          {getTitle(currentWeek, week, year, currentYear)}
        </Typography>
        {week === currentWeek && (
          <Fragment>
            <AddMatchButton onClick={() => setOpenAddMatch(true)} />
            <AddDefiButton />
          </Fragment>
        )}
        {openAddMatch && (
          <AddMatchdialog
            group={group}
            open={openAddMatch}
            handleClose={() => setOpenAddMatch(false)}
          />
        )}
        {openAddDefi && (
          <Dialog open={openAddDefi} handleClose={() => setOpenAddDefi(false)}>
            <DialogContent>Test</DialogContent>
          </Dialog>
        )}
        {matchs.map((match, id) => (
          <Match key={id} match={match} />
        ))}
      </div>
    </GroupContext.Provider>
  );
}
