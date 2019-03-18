import React from "react";
import { StatLine } from "../StatsLine";

export function ProfileLine({
  label,
  value,
  valueCurrentUser,
  negativeData,
  isCurrentUser,
  unit
}) {
  return (
    <StatLine
      label={label}
      value={value}
      diff={valueCurrentUser - value}
      inverseColor={negativeData}
      displayDiff={!isCurrentUser}
      unit={unit}
    />
  );
}
