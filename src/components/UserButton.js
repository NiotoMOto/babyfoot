import React from "react";
import { Chip, Avatar } from "@material-ui/core";

export function UserButton({ variant, color, label, onClick, photoURL }) {
  return (
    <div style={{ margin: "5px", display: "inline-block" }}>
      <Chip
        style={{ fontSize: "10px" }}
        variant={variant}
        color={color}
        avatar={<Avatar alt="" src={photoURL} />}
        label={<div style={{ display: "flex" }}>{label}</div>}
        onClick={onClick}
      />
    </div>
  );
}
