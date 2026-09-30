import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { imageUrl } from "../../utils/imageUrl";

const Cart = () => {
  const { cartItems, removeFromCart, getTotalCartAmount, url, appliedCoupon, validateCoupon, setAppliedCoupon } = useContext(StoreContext);
  const navigate = useNavigate();
  const [coupon, setCoupon] = React.useState("");
  const [couponError, setCouponError] = React.useState("");
  const subtotal = getTotalCartAmount();
  const discount = appliedCoupon?.discountAmount || 0;
  const deliveryFee = subtotal ? 2 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const applyCoupon = async () => { try { setCouponError(""); await validateCoupon(coupon); } catch (error) { setAppliedCoupon(null); setCouponError(error.message); } };

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map((item) => (
              <div key={item.cartKey}>
                <div className="cart-items-title cart-items-item">
                  <img src={imageUrl(url, item.image)} alt="" />
                  <p>{item.name}</p>
                  <p>₹{item.unitPrice}</p>
                  <p>{item.quantity}</p>
                  <p>₹{item.totalPrice}</p>
                  <p onClick={() => removeFromCart(item.cartKey)} className="cross">
                    x
                  </p>
                </div>
                {(item.selectedAddons?.length > 0 || item.specialInstructions) && <p className="cart-item-note">{item.selectedAddons?.map((addon) => addon.name).join(", ")}{item.specialInstructions && ` · ${item.specialInstructions}`}</p>}
                <hr />
              </div>
            ))}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total}</b>
            </div>
          </div>
          <button disabled={!cartItems.length} onClick={() => navigate("/placeorder")}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className="cart-promocode-input">
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} type="text" placeholder="Coupon code" />
              <button type="button" onClick={applyCoupon}>Apply</button>
            </div>
            {appliedCoupon && <p className="coupon-success">{appliedCoupon.couponCode} applied: −₹{discount}</p>}
            {couponError && <p className="coupon-error">{couponError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
