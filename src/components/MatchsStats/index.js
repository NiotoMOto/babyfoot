import React, { Fragment, useEffect } from "react";
import reduce from "lodash/reduce";
import { Paper, Tabs, Tab, Typography, Chip } from "@material-ui/core";
import get from "lodash/get";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import { User } from "../User";
import { db, extractData } from "../../firebaseConfig";

function calculate(sum = 0, nb) {
  return sum + nb;
}

function calculatePoint(stat, points) {
  return (
    stat.victories * points.victory +
    stat.defaites * points.defeat +
    stat.buts * points.but +
    stat.butNeg * points.butneg
  );
}

function mapUser(team, stats, otherTeam) {
  team.members.forEach(member => {
    stats[member.id] = {
      ...stats[member.id],
      docRef: member,
      victories: calculate(
        get(stats[member.id], "victories", 0),
        team.victory ? 1 : 0
      ),
      defaites: calculate(
        get(stats[member.id], "defaites", 0),
        otherTeam.victory ? 1 : 0
      ),
      party: calculate(get(stats[member.id], "party", 0), 1),
      buts: calculate(get(stats[member.id], "buts", 0), team.score),
      butNeg: calculate(get(stats[member.id], "butNeg", 0), otherTeam.score)
    };
  });
}

function StatLine({ label, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px"
      }}>
      <Typography variant="overline">{label}</Typography>
      <Chip style={{}} color="primary" label={value} />
    </div>
  );
}

function statsByUser(matchs, points) {
  const stats = {};

  matchs.map(match => {
    mapUser(match.equipeBleue, stats, match.equipeRouge);
    mapUser(match.equipeRouge, stats, match.equipeBleue);
  });
  return map(stats, stat => ({
    ...stat,
    points: calculatePoint(stat, points)
  }));
}

export function MatchsStats({ matchs }) {
  const [tab, setTab] = React.useState(0);
  const [points, setPoints] = React.useState(null);
  const stats = statsByUser(matchs, points);

  function handleChange(event, newValue) {
    setTab(newValue);
  }

  useEffect(() => {
    db.collection("points").onSnapshot(doc => {
      setPoints(extractData(doc)[0]);
    });
  }, []);

  return (
    <div>
      {matchs && (
        <Fragment>
          <Paper square>
            <Tabs value={tab} onChange={handleChange}>
              <Tab label="Générales" />
              <Tab label="Points" />
              <Tab label="Victoires" />
              <Tab label="Buts" />
            </Tabs>
            <div style={{ padding: "10px" }}>
              {tab === 0 && (
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
              {tab === 1 && (
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
              {tab === 2 && (
                <Fragment>
                  {orderBy(stats, ["victories"], ["desc"]).map(stat => (
                    <StatLine
                      key={stat.docRef.id}
                      label={<User docRef={stat.docRef} />}
                      value={stat.victories}
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
