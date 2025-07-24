import React, { useState, useEffect } from "react";
import StarRating from "../../components/review/starRating";
import { useCreateReview, useUpdateReview } from "../../hooks/useReview";

const ReviewForm = ({ bookId, existingReview = null, onCancel, onSuccess }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isPublic, setIsPublic] = useState(true);
  const [errors, setErrors] = useState({});

  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();

  const isEditing = !!existingReview;
  const isLoading =
    createReviewMutation.isPending || updateReviewMutation.isPending;

  // Initialize form with existing review data
  useEffect(() => {
    if (existingReview) {
      setReviewText(existingReview.ReviewText || "");
      setRating(existingReview.Rating || 5);
      setIsPublic(existingReview.IsPublic ?? true);
    }
  }, [existingReview]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!reviewText.trim()) {
      newErrors.reviewText = "Review text is required";
    } else if (reviewText.trim().length < 10) {
      newErrors.reviewText = "Review must be at least 10 characters long";
    } else if (reviewText.trim().length > 2000) {
      newErrors.reviewText = "Review must be no more than 2000 characters long";
    }

    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = "Please select a rating between 1 and 5 stars";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   const reviewData = {
  //     bookId,
  //     reviewText: reviewText.trim(),
  //     rating,
  //     isPublic,
  //   };

  //   try {
  //     if (isEditing) {
  //       await updateReviewMutation.mutateAsync({
  //         reviewId: existingReview.ReviewId,
  //         ...reviewData,
  //       });
  //     } else {
  //       await createReviewMutation.mutateAsync(reviewData);
  //     }

  //     // Reset form
  //     setReviewText("");
  //     setRating(5);
  //     setIsPublic(true);
  //     setErrors({});

  //     // Call success callback
  //     if (onSuccess) {
  //       onSuccess();
  //     }
  //   } catch (error) {
  //     console.error("Error submitting review:", error);

  //     // Handle specific error cases
  //     if (error.response?.status === 400) {
  //       setErrors({
  //         submit: error.response.data.message || "Invalid review data",
  //       });
  //     } else if (error.response?.status === 401) {
  //       setErrors({ submit: "Please log in to submit a review" });
  //     } else {
  //       setErrors({ submit: "An error occurred while submitting your review" });
  //     }
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditing) {
        console.log("🔄 Submitting update with:", {
          reviewId: existingReview.ReviewId,
          bookId: bookId, // ← Ensure this exists
          reviewText: reviewText.trim(),
          rating,
          isPublic,
        });

        const result = await updateReviewMutation.mutateAsync({
          reviewId: existingReview.ReviewId,
          bookId: bookId, // ← CRITICAL: Must have bookId
          reviewText: reviewText.trim(),
          rating,
          isPublic,
        });

        console.log("✅ Mutation completed:", result);
      } else {
        await createReviewMutation.mutateAsync({
          bookId,
          reviewText: reviewText.trim(),
          rating,
          isPublic,
        });
      }

      // Reset form
      setReviewText("");
      setRating(5);
      setIsPublic(true);
      setErrors({});

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ Submit error:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        setErrors({
          submit: error.response.data.message || "Invalid review data",
        });
      } else if (error.response?.status === 401) {
        setErrors({ submit: "Please log in to submit a review" });
      } else {
        setErrors({ submit: "An error occurred while submitting your review" });
      }
    }
  };

  const handleCancel = () => {
    // Reset form
    setReviewText("");
    setRating(5);
    setIsPublic(true);
    setErrors({});

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className=" text-gray-700 text-lg font-semibold mb-4">
        {isEditing ? "Edit Your Review" : "Write a Review"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className=" text-gray-700 block text-sm font-medium mb-2">
            Rating <span className="text-red-500">*</span>
          </label>
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          {errors.rating && (
            <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Review Text */}
        <div>
          <label className=" text-gray-700 block text-sm font-medium mb-2">
            Your Review <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this book..."
            rows={6}
            className={` text-gray-700 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.reviewText ? "border-red-500" : "border-gray-300"
            }`}
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-1">
            <div>
              {errors.reviewText && (
                <p className="text-red-500 text-sm">{errors.reviewText}</p>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {reviewText.length}/2000 characters
            </span>
          </div>
        </div>

        {/* Privacy Setting */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPublic" className=" text-gray-700 text-sm">
            Make this review public
          </label>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isEditing ? "Updating..." : "Submitting..."}
              </span>
            ) : isEditing ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
