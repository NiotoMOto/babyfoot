import React from "react";
import { Typography, Chip } from "@material-ui/core";
import { roundRation } from "../utils";

function getColorDiff(diff, inverseColor) {
  if (diff === 0) {
    return "black";
  } else if (diff > 0) {
    return !inverseColor ? "green" : "red";
  }
  return !inverseColor ? "red" : "green";
}

export function StatLine({
  label,
  value,
  diff,
  inverseColor,
  displayDiff,
  valueStyle,
  unit = ""
}) {
  const showDIsplayDiff = displayDiff;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px"
      }}>
      <Typography
        style={{ width: "100%", paddingRight: "10px" }}
        variant="overline">
        {label}
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px"
        }}>
        <Chip style={valueStyle} color="primary" label={`${value} ${unit}`} />
        {showDIsplayDiff && (
          <div
            style={{
              marginLeft: "10px",
              height: "30px",
              lineHeight: "30px",
              width: "50px",
              textAlign: "right",
              color: getColorDiff(diff, inverseColor)
            }}>
            {diff > 0 ? "+" : ""}
            {roundRation(diff)} {unit}
          </div>
        )}
      </div>
    </div>
  );
}
