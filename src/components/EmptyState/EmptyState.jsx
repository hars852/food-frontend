import React from "react";
import "./EmptyState.css";

const EmptyState = ({ message = "Nothing to show", actionLabel, onAction }) => (
  <div className="empty-state">
    <p>{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction}>{actionLabel}</button>
    )}
  </div>
);

export default EmptyState;
