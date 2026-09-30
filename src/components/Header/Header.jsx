import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { restaurantInfo } = useContext(StoreContext);

  return (
    <div className="header">
      <div className="header-contents">
        <h2>{restaurantInfo?.tagline || "Order your favourite food here"}</h2>
        <p>
          {restaurantInfo?.about?.introduction ||
            "Browse our menu, order delicious food, and enjoy fast delivery to your doorstep."}
        </p>
        <div className="header-buttons">
          <button onClick={() => navigate("/menu")}>Order Now</button>
          <button className="header-btn-secondary" onClick={() => navigate("/book-table")}>
            Book a Table
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
