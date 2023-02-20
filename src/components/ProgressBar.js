import React from "react";

export default function ProgressBar() {
  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="100"
        aria-valuemin="100"
        aria-valuemax="100"
        style={{ width: "100%" }}
      ></div>
    </div>
  );
}
