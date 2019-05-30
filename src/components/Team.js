import React from "react";
import { User } from "./User";
import { DefisPoints } from "./DefisPoints";

export function Team({ members, defisPoints = [], victory }) {
  return (
    <div>
      {members.map(member => (
        <div key={member.path} style={{ marginBottom: "5px" }}>
          <User docRef={member} />
          {defisPoints.filter(d => d).find(d => d.id === member.id) && (
            <DefisPoints
              sign={victory ? "+" : "-"}
              points={
                defisPoints.filter(d => d).find(d => d.id === member.id).points
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}
