import React, { Fragment, useEffect, useState } from "react";
import reduce from "lodash/reduce";
import { Paper, Tabs, Tab } from "@material-ui/core";
import get from "lodash/get";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import { User } from "./User";
import { db, extractData } from "../firebaseConfig";
import { StatLine } from "./StatsLine";
import { CloseWeek } from "./CloseWeek";
import { LeaderBoard } from "./LeaderBoard";
import dayjs from "dayjs";
import { LivePoints } from "./LivePoints";
import { LoadingResult } from "./LoadingResult";
import { useGroupContext } from "./Matchs";

function calculate(sum = 0, nb) {
  return sum + nb;
}

function arrayExpo(ideal) {
  return new Array(ideal)
    .fill(null)
    .map((n, i) => Math.exp(-(ideal - (i + 1))));
}

function computePoint(stat, points, uid) {
  const arrayMatchs = arrayExpo(points.ideal);
  const ratioButMoyenne =
    reduce(stat.ratioBut, (sum, n) => sum + n, 0) / stat.ratioBut.length;
  return Math.round(
    (ratioButMoyenne * points.but +
      (stat.victories / stat.party) * points.victory) *
      arrayMatchs[(stat.party > points.ideal ? points.ideal : stat.party) - 1] +
      stat.defis
  );
}

const toFive = (num, max) => (num / max) * 5;

function mapUser(team, stats, otherTeam) {
  const maxBut = Math.max(team.score, otherTeam.score);
  team.members.forEach(member => {
    const victorues = calculate(
      get(stats[member.id], "victories", 0),
      team.victory ? 1 : 0
    );

    const parties = calculate(get(stats[member.id], "party", 0), 1);
    const defiPoints = get(
      get(team, "defisPoints", []).find(d => d && d.id === member.id),
      "points",
      0
    );
    stats[member.id] = {
      ...stats[member.id],
      docRef: member,
      defis: calculate(
        get(stats[member.id], "defis", 0),
        team.victory ? defiPoints : -defiPoints
      ),
      victories: calculate(
        get(stats[member.id], "victories", 0),
        team.victory ? 1 : 0
      ),
      ratioBut: team.victory
        ? get(stats[member.id], "ratioBut", []).concat(
            toFive(team.score, maxBut) ||
              1 / (toFive(otherTeam.score, maxBut) || 1)
          )
        : get(stats[member.id], "ratioBut", [1]),
      defaites: calculate(
        get(stats[member.id], "defaites", 0),
        otherTeam.victory ? 1 : 0
      ),
      ratioVictories: Math.round((victorues / parties) * 100),
      party: calculate(get(stats[member.id], "party", 0), 1),
      buts: calculate(get(stats[member.id], "buts", 0), team.score),
      butNeg: calculate(get(stats[member.id], "butNeg", 0), otherTeam.score)
    };
  });
}

function statsByUser(matchs, points) {
  const stats = {};

  return new Promise(resolve => {
    matchs.forEach(match => {
      mapUser(match.equipeBleue, stats, match.equipeRouge);
      mapUser(match.equipeRouge, stats, match.equipeBleue);
    });

    const userPoints = map(stats, (stat, key) => ({
      ...stat,
      points: computePoint(stat, points, key)
    }));
    resolve(userPoints);
  });
}

export function MatchsStats({ matchs, week, year = dayjs().year(), points }) {
  const [tab, setTab] = useState(0);
  const [weeksDb, setWeekDb] = useState(null);
  const [weeksDbLoaded, setWeeksDbLoaded] = useState(false);
  const [stats, setStats] = useState(null);

  function handleChange(event, newValue) {
    setTab(newValue);
  }
  const group = useGroupContext();

  useEffect(
    () => {
      setWeeksDbLoaded(false);
      setWeekDb(null);
      setStats(null);
      const unsubscribe = db
        .collection("weeks")
        .where("week", "==", week)
        .where("year", "==", year)
        .where("group", "==", db.collection("groups").doc(group))
        .onSnapshot(
          doc => {
            if (doc.docs.length) {
              setWeekDb(extractData(doc)[0]);
            } else {
              setWeekDb(null);
            }
            setWeeksDbLoaded(true);
          },
          () => setWeeksDbLoaded(true)
        );
      return () => unsubscribe();
    },
    [week, year]
  );

  useEffect(
    () => {
      if (points) {
        statsByUser(matchs, points).then(s => {
          orderBy(s, "points", "desc");
          const stats = orderBy(s, "points", "desc");
          if (stats.length) {
            if (dayjs().week() === week) {
              db.collection("groups")
                .doc(group)
                .update({
                  prince: stats[0].docRef,
                  princeWeek: week
                });
            }
          }
          setStats(s);
        });
      }
    },
    [matchs, points]
  );

  return (
    <div>
      {matchs && (
        <Fragment>
          <CloseWeek week={parseInt(week)} stats={stats} group={group} />

          <Paper square>
            <Tabs value={tab} onChange={handleChange}>
              <Tab label="Points" />
              <Tab label="Victoires" />
              <Tab label="Parties" />
              <Tab label="Buts" />
              <Tab label="Générales" />
            </Tabs>
            <div style={{ padding: "10px", minHeight: "340px" }}>
              {!weeksDb && !stats && <LoadingResult lines={6} />}
              {(!!weeksDb || !!stats) && (
                <Fragment>
                  {tab === 0 && (
                    <Fragment>
                      {weeksDb && <LeaderBoard stats={weeksDb.stats} />}
                      {points && weeksDbLoaded && !weeksDb && points && (
                        <LivePoints stats={stats} />
                      )}
                    </Fragment>
                  )}
                  {tab === 1 && (
                    <Fragment>
                      {orderBy(stats, "ratioVictories", "desc").map(stat => (
                        <StatLine
                          key={stat.docRef.id}
                          label={
                            <User currenGroup={group} docRef={stat.docRef} />
                          }
                          value={`${stat.ratioVictories} %`}
                          tooltip="test"
                        />
                      ))}
                    </Fragment>
                  )}
                  {tab === 2 && (
                    <Fragment>
                      {orderBy(stats, "party", "desc").map(stat => (
                        <StatLine
                          key={stat.docRef.id}
                          label={
                            <User currenGroup={group} docRef={stat.docRef} />
                          }
                          value={stat.party}
                        />
                      ))}
                    </Fragment>
                  )}{" "}
                  {tab === 3 && (
                    <Fragment>
                      {orderBy(stats, "buts", "desc").map(stat => (
                        <StatLine
                          key={stat.docRef.id}
                          label={
                            <User currenGroup={group} docRef={stat.docRef} />
                          }
                          value={stat.buts}
                        />
                      ))}
                    </Fragment>
                  )}
                  {tab === 4 && (
                    <Fragment>
                      <StatLine label="Matchs Joué" value={matchs.length} />
                      <StatLine
                        label="Buts Totaux"
                        value={reduce(
                          matchs,
                          (sum, n) =>
                            sum + n.equipeBleue.score + n.equipeRouge.score,
                          0
                        )}
                      />
                      <StatLine
                        label="Buts coté bleue"
                        value={reduce(
                          matchs,
                          (sum, n) => sum + n.equipeBleue.score,
                          0
                        )}
                      />
                      <StatLine
                        label="Buts coté rouge"
                        value={reduce(
                          matchs,
                          (sum, n) => sum + n.equipeRouge.score,
                          0
                        )}
                      />
                    </Fragment>
                  )}
                </Fragment>
              )}
            </div>
          </Paper>

          <div />
        </Fragment>
      )}
    </div>
  );
}
