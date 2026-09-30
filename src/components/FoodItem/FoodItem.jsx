import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ _id, name, price, description, image }) => {
  const { cartItem, addToCart, removefromCart, url } = useContext(StoreContext);

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url + "/images/" + image} alt={name} />

        {!cartItem[_id] ? (
          <img className='add' onClick={() => addToCart(_id)} src={assets.add_icon_white} alt="" />
        ) : (
          <div className='food-item-counter'>
            <img onClick={() => removefromCart(_id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItem[_id]}</p>
            <img onClick={() => addToCart(_id)} src={assets.add_icon_green} alt="" />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
