import React, { Fragment, useEffect, useState } from "react";
import reduce from "lodash/reduce";
import { Paper, Tabs, Tab } from "@material-ui/core";
import get from "lodash/get";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import { User } from "../User";
import { db, extractData } from "../../firebaseConfig";
import { StatLine } from "../StatsLine";
import { CloseWeek } from "../CloseWeek";
import { LeaderBoard } from "../LeaderBoard";
import dayjs from "dayjs";

function calculate(sum = 0, nb) {
  return sum + nb;
}

function arrayExpo(ideal) {
  return new Array(ideal)
    .fill(null)
    .map((n, i) => Math.min(Math.pow(i + 1, 2) / Math.pow(30, 2), 1));
}

function computePoint(stat, points) {
  const arrayMatchs = arrayExpo(points.ideal);
  const sortVictoryRatio = stat.ratioBut.sort((a, b) => b - a);
  return Math.round(
    (sortVictoryRatio[Math.round(stat.ratioBut.length / 2 - 1)] * points.but +
      (stat.victories / stat.party) * points.victory) *
      arrayMatchs[(stat.party > points.ideal ? points.ideal : stat.party) - 1]
  );
}

function mapUser(team, stats, otherTeam) {
  const maxBut = Math.max(team.score, otherTeam.score);
  team.members.forEach(member => {
    const victorues = calculate(
      get(stats[member.id], "victories", 0),
      team.victory ? 1 : 0
    );
    const parties = calculate(get(stats[member.id], "party", 0), 1);
    stats[member.id] = {
      ...stats[member.id],
      docRef: member,
      victories: calculate(
        get(stats[member.id], "victories", 0),
        team.victory ? 1 : 0
      ),
      ratioBut: get(stats[member.id], "ratioBut", []).concat(
        team.score / maxBut
      ),
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

  matchs.map(match => {
    mapUser(match.equipeBleue, stats, match.equipeRouge);
    mapUser(match.equipeRouge, stats, match.equipeBleue);
  });
  return map(stats, stat => ({
    ...stat,
    points: computePoint(stat, points)
  }));
}

export function MatchsStats({ matchs, week, year = dayjs().year() }) {
  const [tab, setTab] = useState(0);
  const [points, setPoints] = useState(null);
  const [weeksDb, setWeekDb] = useState(null);
  const stats = statsByUser(matchs, points);

  function handleChange(event, newValue) {
    setTab(newValue);
  }

  useEffect(() => {
    db.collection("points").onSnapshot(doc => {
      setPoints(extractData(doc)[0]);
    });
    db.collection("weeks")
      .where("week", "==", week)
      .where("year", "==", year)
      .onSnapshot(doc => {
        console.log("doc stats", doc);
        if (doc.docs.length) {
          setWeekDb(extractData(doc)[0]);
        }
      });
  }, []);

  return (
    <div>
      {matchs && (
        <Fragment>
          <CloseWeek week={parseInt(week)} stats={stats} />
          {weeksDb && <LeaderBoard />}
          <Paper square>
            <Tabs value={tab} onChange={handleChange}>
              <Tab label="Points" />
              <Tab label="Générales" />
              <Tab label="Victoires" />
              <Tab label="Buts" />
            </Tabs>
            <div style={{ padding: "10px" }}>
              {tab === 0 && (
                <Fragment>
                  {points && (
                    <Fragment>
                      {orderBy(stats, ["points"], ["desc"]).map(stat => (
                        <StatLine
                          key={stat.docRef.id}
                          label={<User docRef={stat.docRef} />}
                          value={stat.points}
                        />
                      ))}
                    </Fragment>
                  )}
                </Fragment>
              )}
              {tab === 1 && (
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
              {tab === 2 && (
                <Fragment>
                  {orderBy(stats, ["ratioVictories"], ["desc"]).map(stat => (
                    <StatLine
                      key={stat.docRef.id}
                      label={<User docRef={stat.docRef} />}
                      value={`${stat.ratioVictories} %`}
                      tooltip="test"
                    />
                  ))}
                </Fragment>
              )}
              {tab === 3 && (
                <Fragment>
                  {orderBy(stats, ["buts"], ["desc"]).map(stat => (
                    <StatLine
                      key={stat.docRef.id}
                      label={<User docRef={stat.docRef} />}
                      value={stat.buts}
                    />
                  ))}
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
