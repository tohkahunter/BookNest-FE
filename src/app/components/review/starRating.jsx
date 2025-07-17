import React from "react";

const StarRating = ({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const handleStarClick = (selectedRating) => {
    if (!readonly && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleStarClick(star)}
          disabled={readonly}
          className={`
            ${sizeClasses[size]}
            ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}
            ${star <= rating ? "text-yellow-400" : "text-gray-300"}
            transition-all duration-200
            ${!readonly && "hover:text-yellow-300"}
          `}
        >
          ★
        </button>
      ))}
      {readonly && (
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      )}
    </div>
  );
};

export default StarRating;
