import React, { useState } from "react";
import ReviewForm from "./reviewForm";
import ReviewCard from "./reviewCard";
import StarRating from "./starRating";
import {
  useBookReviews,
  useCanReviewBook,
  useMyReviewForBook,
} from "../../hooks/useReview";

const ReviewSection = ({ bookId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const {
    data: bookReviewData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useBookReviews(bookId);

  const { data: canReview, isLoading: canReviewLoading } =
    useCanReviewBook(bookId);

  const { data: myReview, isLoading: myReviewLoading } =
    useMyReviewForBook(bookId);

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(false);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleReviewCancel = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const renderRatingDistribution = () => {
    if (!bookReviewData) return null;

    const {
      FiveStarCount,
      FourStarCount,
      ThreeStarCount,
      TwoStarCount,
      OneStarCount,
      TotalReviews,
    } = bookReviewData;

    const ratings = [
      { stars: 5, count: FiveStarCount },
      { stars: 4, count: FourStarCount },
      { stars: 3, count: ThreeStarCount },
      { stars: 2, count: TwoStarCount },
      { stars: 1, count: OneStarCount },
    ];

    return (
      <div className=" text-gray-700 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>

        {/* Overall Rating */}
        <div className="flex items-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mr-4">
            {TotalReviews > 0 ? bookReviewData.AverageRating.toFixed(1) : "0.0"}
          </div>
          <div>
            <StarRating
              rating={Math.round(bookReviewData.AverageRating)}
              readonly
              size="lg"
            />
            <p className="text-sm text-gray-600 mt-1">
              {TotalReviews} {TotalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {ratings.map(({ stars, count }) => (
            <div key={stars} className="flex items-center">
              <span className="text-sm text-gray-600 w-6">{stars}</span>
              <svg
                className="w-4 h-4 text-yellow-400 mx-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <div className="flex-1 mx-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width:
                        TotalReviews > 0
                          ? `${(count / TotalReviews) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (reviewsLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviewsError) {
    return (
      <div className="text-red-500 text-center py-8">
        Error loading reviews. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Distribution */}
      {renderRatingDistribution()}

      {/* Write Review Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-gray-700 text-lg font-semibold mb-4">
          Your Review
        </h3>

        {myReviewLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : myReview ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm mb-2">
                You have already reviewed this book
              </p>
              <div className="flex items-center space-x-4">
                <StarRating rating={myReview.Rating} readonly />
                <button
                  onClick={() => handleEditReview(myReview)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit Review
                </button>
              </div>
            </div>
          </div>
        ) : canReview ? (
          <div>
            {!showReviewForm && !editingReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-full py-3 px-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                + Write a review
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 text-sm">
              You need to add this book to your "Read" shelf before you can
              write a review.
            </p>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <ReviewForm
            bookId={bookId}
            onSuccess={handleReviewSuccess}
            onCancel={handleReviewCancel}
          />
        )}

        {/* Edit Review Form */}
        {editingReview && (
          <ReviewForm
            bookId={bookId}
            existingReview={editingReview}
            onSuccess={handleReviewSuccess}
            onCancel={handleReviewCancel}
          />
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-gray-700 text-lg font-semibold">Reviews</h3>

        {bookReviewData?.Reviews?.length > 0 ? (
          <div className="space-y-4">
            {bookReviewData.Reviews.map((review) => (
              <ReviewCard
                key={review.ReviewId}
                review={review}
                onEdit={handleEditReview}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this book!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
