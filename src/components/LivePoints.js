import React, { Fragment } from "react";
import orderBy from "lodash/orderBy";
import { StatLine } from "./StatsLine";
import { User } from "./User";
import { DefisPoints } from "./DefisPoints";

export function LivePoints({ stats }) {
  return (
    <Fragment>
      {orderBy(stats, ["points"], ["desc"]).map(stat => (
        <StatLine
          key={stat.docRef.id}
          label={
            <span>
              <User docRef={stat.docRef} />
              {stat.defis !== 0 && (
                <DefisPoints
                  sign={stat.defis > 0 ? "+" : "-"}
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
