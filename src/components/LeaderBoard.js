import React from "react";
import orderBy from "lodash/orderBy";
import { User } from "./User";
import { StatLine } from "./StatsLine";
import { Typography } from "@material-ui/core";
import { DefisPoints } from "./DefisPoints";

const leadsStyles = {
  0: "or",
  1: "argent",
  2: "bronze"
};

const variantStyles = {
  or: { background: "#C98910", color: "white" },
  argent: { background: "#A8A8A8", color: "white" },
  bronze: { background: "#965A38", color: "white" }
};

export function LeaderBoard({ stats }) {
  return (
    <div>
      <Typography
        style={{ textAlign: "center", marginBottom: "10px" }}
        variant="h6">
        Résultats finaux
      </Typography>
      {orderBy(stats, ["points"], ["desc"]).map((stat, index) => (
        <StatLine
          key={stat.docRef.id}
          label={
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}>
              <User docRef={stat.docRef} variant={leadsStyles[index]} />
              {stat.defis !== 0 && (
                <DefisPoints
                  sign={stat.defis > 0 ? "+" : ""}
                  points={stat.defis}
                />
              )}
            </span>
          }
          value={stat.points}
          valueStyle={variantStyles[leadsStyles[index]]}
        />
      ))}
    </div>
  );
}
