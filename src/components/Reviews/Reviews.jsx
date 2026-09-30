import React, { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import RatingStars from "../RatingStars/RatingStars";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "../PopularDishes/PopularDishes.css";
import "./Reviews.css";

const Reviews = () => {
  const { reviews, reviewsSummary, loading } = useContext(StoreContext);

  return (
    <section className="home-section reviews-section" id="reviews">
      <div className="section-header">
        <h2>Customer Reviews</h2>
        <div className="reviews-summary">
          <RatingStars rating={reviewsSummary.averageRating} size="md" />
          <span>{reviewsSummary.totalReviews} reviews</span>
        </div>
      </div>
      {loading ? (
        <LoadingSpinner message="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <p className="reviews-empty">No reviews yet</p>
      ) : (
        <div className="reviews-grid">
          {reviews.slice(0, 6).map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="review-avatar">
                  {review.customerName?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="review-name">{review.customerName}</p>
                  <RatingStars rating={review.rating} size="sm" showValue={false} />
                </div>
              </div>
              <p className="review-text">{review.reviewText}</p>
              <p className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Reviews;
