import React, { Fragment } from "react";
import orderBy from "lodash/orderBy";
import { StatLine } from "../StatsLine";
import { User } from "../User";

export function LivePoints({ stats }) {
  return (
    <Fragment>
      {orderBy(stats, ["points"], ["desc"]).map(stat => (
        <StatLine
          key={stat.docRef.id}
          label={<User docRef={stat.docRef} />}
          value={stat.points}
        />
      ))}
    </Fragment>
  );
}
