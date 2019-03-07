import React from "react";
import { Typography, Chip } from "@material-ui/core";

export function StatLine({ label, value }) {
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
