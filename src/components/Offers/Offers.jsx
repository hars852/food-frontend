import React, { useContext } from "react";
import { toast } from "react-toastify";
import { StoreContext } from "../../Context/StoreContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./Offers.css";

const Offers = () => {
  const { offers, loading, setAppliedCoupon } = useContext(StoreContext);

  const handleApply = (offer) => {
    setAppliedCoupon({
      couponCode: offer.couponCode,
      title: offer.title,
      discount: offer.discount,
      discountType: offer.discountType,
    });
    toast.success(`Coupon ${offer.couponCode} saved! Apply at checkout.`);
  };

  if (!loading && offers.length === 0) return null;

  return (
    <section className="home-section offers-section" id="offers">
      <div className="section-header">
        <h2>Offers & Deals</h2>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading offers..." />
      ) : (
        <div className="offers-grid">
          {offers.map((offer) => (
            <div key={offer._id} className="offer-card">
              <div className="offer-discount">
                {offer.discountType === "percent" ? `${offer.discount}% OFF` : `₹${offer.discount} OFF`}
              </div>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className="offer-meta">
                <span className="coupon-code">{offer.couponCode}</span>
                {offer.minOrderAmount > 0 && (
                  <span>Min order: ₹{offer.minOrderAmount}</span>
                )}
              </div>
              <p className="offer-validity">
                Valid till {new Date(offer.validUntil).toLocaleDateString()}
              </p>
              <button onClick={() => handleApply(offer)}>Apply Offer</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Offers;
