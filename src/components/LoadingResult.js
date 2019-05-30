import React from "react";
import times from "lodash/times";
import "./LoadingResult.css";

export function LoadingResult({ lines = 4 }) {
  return (
    <div className="container">
      {times(lines).map((v, key) => (
        <div className="post">
          <div className="avatar" />
          <div className="line" />
        </div>
      ))}
    </div>
  );
}
