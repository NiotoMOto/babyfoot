import React, { Fragment } from "react";
import orderBy from "lodash/orderBy";
import { StatLine } from "./StatsLine";
import { User } from "./User";
import { DefisPoints } from "./DefisPoints";
import { useGroupContext } from "./Matchs";

export function LivePoints({ stats }) {
  const group = useGroupContext();

  return (
    <Fragment>
      {orderBy(stats, ["points"], ["desc"]).map(stat => (
        <StatLine
          key={stat.docRef.id}
          label={
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
              }}>
              <User currenGroup={group} docRef={stat.docRef} />
              {stat.defis !== 0 && (
                <DefisPoints
                  sign={stat.defis > 0 ? "+" : ""}
                  points={stat.defis}
                />
              )}
            </span>
          }
          value={stat.points}
        />
      ))}
    </Fragment>
  );
}
