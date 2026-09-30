import React from "react";
import "./RatingStars.css";

const RatingStars = ({ rating = 0, size = "sm", showValue = true }) => {
  const stars = [];
  const rounded = Math.round(rating * 2) / 2;

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) stars.push("full");
    else if (i - 0.5 === rounded) stars.push("half");
    else stars.push("empty");
  }

  return (
    <div className={`rating-stars rating-stars-${size}`}>
      <div className="stars">
        {stars.map((type, i) => (
          <span key={i} className={`star star-${type}`}>&#9733;</span>
        ))}
      </div>
      {showValue && <span className="rating-value">{rating ? rating.toFixed(1) : "0.0"}</span>}
    </div>
  );
};

export default RatingStars;
