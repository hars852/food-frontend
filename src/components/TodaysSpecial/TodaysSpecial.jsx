import React, { useContext, useMemo } from "react";
import { StoreContext } from "../../Context/StoreContext";
import FoodCard from "../FoodCard/FoodCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import EmptyState from "../EmptyState/EmptyState";
import "../PopularDishes/PopularDishes.css";
import "./TodaysSpecial.css";

const TodaysSpecial = () => {
  const { specialFoods, loading } = useContext(StoreContext);

  const activeSpecials = useMemo(() => {
    const now = new Date();
    return specialFoods.filter(
      (f) => !f.specialValidUntil || new Date(f.specialValidUntil) >= now
    );
  }, [specialFoods]);

  if (!loading && activeSpecials.length === 0) return null;

  return (
    <section className="home-section todays-special" id="todays-special">
      <div className="section-header">
        <h2>Today&apos;s Special</h2>
        <span className="special-badge">Limited Time</span>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading specials..." />
      ) : (
        <div className="food-grid">
          {activeSpecials.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TodaysSpecial;
