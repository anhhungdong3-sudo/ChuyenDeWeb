import React from "react";

const StarRating = ({ value = 4.8, count = 0 }) => {
  const rounded = Math.round(Number(value) * 2) / 2;

  return (
    <div className="star-rating" aria-label={`${rounded} trên 5 sao`}>
      <span className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={rounded >= star ? "filled" : ""}>★</span>
        ))}
      </span>
      <small>{rounded.toFixed(1)}{count ? ` (${count})` : ""}</small>
    </div>
  );
};

export default StarRating;
