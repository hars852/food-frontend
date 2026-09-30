import React from "react";
import "./VegBadge.css";

const VegBadge = ({ isVeg }) => (
  <span className={`veg-badge ${isVeg ? "veg" : "nonveg"}`}>
    {isVeg ? "Veg" : "Non-Veg"}
  </span>
);

export default VegBadge;
