import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="loading-spinner-wrap">
    <div className="loading-spinner" />
    {message && <p>{message}</p>}
  </div>
);

export default LoadingSpinner;
