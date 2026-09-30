import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import FoodCard from "../FoodCard/FoodCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptyState/EmptyState";
import "./PopularDishes.css";

const PopularDishes = () => {
  const { popularFoods, loading } = useContext(StoreContext);

  return (
    <section className="home-section popular-dishes" id="popular-dishes">
      <div className="section-header">
        <h2>Popular Dishes</h2>
        <Link to="/menu" className="view-all-link">View All</Link>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading popular dishes..." />
      ) : popularFoods.length === 0 ? (
        <EmptyState message="No popular dishes yet" actionLabel="Browse Menu" onAction={() => window.location.href = "/menu"} />
      ) : (
        <div className="food-grid">
          {popularFoods.slice(0, 8).map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularDishes;
