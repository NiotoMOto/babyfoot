import React from "react";
import { User } from "../User";

export function Team({ members }) {
  return (
    <div>
      {members.map(member => (
        <div key={member.path} style={{ marginBottom: "5px" }}>
          <User docRef={member} />
        </div>
      ))}
    </div>
  );
}
