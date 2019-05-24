import React from "react";
import "./loaderInline.css";

export function LoaderInline() {
  return (
    <div className="spinner_inine" role="alert" aria-live="assertive">
      <div className="spinner__items" aria-hidden="true">
        <div className="spinner__item" />
        <div className="spinner__item" />
        <div className="spinner__item" />
      </div>
    </div>
  );
}
