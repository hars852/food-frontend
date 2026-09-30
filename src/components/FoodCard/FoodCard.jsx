import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import RatingStars from "../RatingStars/RatingStars";
import VegBadge from "../VegBadge/VegBadge";
import { formatPrice, getEffectivePrice, getDiscountPercent } from "../../utils/formatPrice";
import { imageUrl } from "../../utils/imageUrl";
import "./FoodCard.css";

const FoodCard = ({ food, showDetailsLink = true }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const qty = cartItems
    .filter((item) => item.foodId === food._id && !item.selectedAddons?.length && !item.specialInstructions)
    .reduce((sum, item) => sum + item.quantity, 0);

  const price = getEffectivePrice(food);
  const discount = getDiscountPercent(food);
  const unavailable = food.isAvailable === false;

  const handleAdd = () => {
    if (!unavailable) addToCart(food._id);
  };

  const handleRemove = () => {
    const item = cartItems.find(
      (i) => i.foodId === food._id && !i.selectedAddons?.length && !i.specialInstructions
    );
    if (item) removeFromCart(item.cartKey);
  };

  return (
    <div className={`food-card ${unavailable ? "unavailable" : ""}`}>
      <div className="food-card-img-wrap">
        <img src={imageUrl(url, food.image)} alt={food.name} />
        <div className="food-card-badges">
          <VegBadge isVeg={food.isVeg} />
          {unavailable ? (
            <span className="availability-badge unavailable-badge">Unavailable</span>
          ) : (
            <span className="availability-badge available-badge">Available</span>
          )}
        </div>
        {!unavailable && (
          !qty ? (
            <img className="food-card-add-btn" onClick={handleAdd} src={assets.add_icon_white} alt="Add" />
          ) : (
            <div className="food-card-counter">
              <img onClick={handleRemove} src={assets.remove_icon_red} alt="Remove" />
              <p>{qty}</p>
              <img onClick={handleAdd} src={assets.add_icon_green} alt="Add" />
            </div>
          )
        )}
      </div>
      <div className="food-card-info">
        <div className="food-card-header">
          <h3>{food.name}</h3>
          <RatingStars rating={food.ratingAvg || 0} />
        </div>
        <p className="food-card-desc">{food.description}</p>
        <div className="food-card-price-row">
          <span className="food-card-price">{formatPrice(price)}</span>
          {discount > 0 && (
            <>
              <span className="food-card-original">{formatPrice(food.price)}</span>
              <span className="food-card-discount">{discount}% off</span>
            </>
          )}
        </div>
        {food.ratingCount > 0 && (
          <p className="food-card-reviews">{food.ratingCount} reviews</p>
        )}
        {showDetailsLink && (
          <Link to={`/menu/${food._id}`} className="food-card-details-link">View Details</Link>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
