import React from "react";
import "./loader.css";

export function Loader() {
  return (
    <div className="preloader-area">
      <div className="spinner">
        <div className="dot1" />
        <div className="dot2" />
      </div>
    </div>
  );
}
