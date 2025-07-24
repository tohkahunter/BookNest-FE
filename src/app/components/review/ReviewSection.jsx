import React, { useState } from "react";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import ReviewForm from "./reviewForm";
import ReviewCard from "./reviewCard";
import StarRating from "./starRating";
import {
  useBookReviews,
  useCanReviewBook,
  useMyReviewForBook,
} from "../../hooks/useReview";
import { useBookInLibrary } from "../../hooks/index";
import { useQueryClient } from "@tanstack/react-query";

const ReviewSection = ({ bookId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: bookReviewData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useBookReviews(bookId);

  const {
    data: canReview,
    isLoading: canReviewLoading,
    error: canReviewError,
  } = useCanReviewBook(bookId);

  const { data: myReview, isLoading: myReviewLoading } =
    useMyReviewForBook(bookId);

  console.log("🐛 ReviewSection State:", {
    showReviewForm,
    editingReview,
    myReview: myReview,
    myReviewLoading,
    bookId,
  });
  const {
    data: bookInLibrary,
    isLoading: libraryLoading,
    error: libraryError,
  } = useBookInLibrary(bookId);

  const getReviewPermission = () => {
    console.log("🔍 Review Permission Debug:", {
      canReview,
      canReviewLoading,
      canReviewError,
      bookInLibrary,
      libraryLoading,
      libraryError,
      myReview,
      myReviewLoading,
    });

    // Loading state
    if (canReviewLoading || libraryLoading || myReviewLoading) {
      return {
        canReview: false,
        loading: true,
        message: "Checking review permissions...",
        showForm: false,
      };
    }

    // If user already has review, show edit options
    if (myReview && !myReviewLoading) {
      return {
        canReview: true,
        loading: false,
        hasExisting: true,
        message: null,
        showForm: false,
        existingReview: myReview,
      };
    }

    // Check if book is in library
    if (libraryError || !bookInLibrary) {
      return {
        canReview: false,
        loading: false,
        message:
          "Unable to check library status. Please try refreshing the page or contact support.",
        showForm: false,
      };
    }

    if (!bookInLibrary.Exists) {
      return {
        canReview: false,
        loading: false,
        message:
          "You need to add this book to your library before you can write a review.",
        showForm: false,
        needsInLibrary: true,
      };
    }

    // Prioritize canReview from API if true
    if (canReview === true && !myReview) {
      console.log("🔍 Using API canReview: true");
      return {
        canReview: true,
        loading: false,
        message: null,
        showForm: true,
      };
    }

    // Check book status (handle both UserBook and flat structure)
    let statusId;
    if (bookInLibrary.UserBook && bookInLibrary.UserBook.StatusId) {
      statusId = bookInLibrary.UserBook.StatusId;
      console.log("🔍 Using UserBook.StatusId:", statusId);
    } else if (bookInLibrary.StatusId) {
      statusId = bookInLibrary.StatusId;
      console.log("🔍 Using flat StatusId from bookInLibrary:", statusId);
    } else {
      console.log("🔍 No StatusId found in bookInLibrary");
      return {
        canReview: false,
        loading: false,
        message:
          "Book data incomplete. Please try refreshing the page or contact support.",
        showForm: false,
      };
    }

    const statusNames = {
      1: "Want to Read",
      2: "Currently Reading",
      3: "Read",
    };

    console.log("🔍 Book Status:", {
      statusId,
      statusName: statusNames[statusId],
    });

    // Check API permission if not already handled
    if (canReviewError) {
      if (statusId === 3) {
        console.log(
          "⚠️ API error but book is marked as Read - allowing review"
        );
        return {
          canReview: true,
          loading: false,
          message: null,
          showForm: true,
          fallbackPermission: true,
        };
      }
      return {
        canReview: false,
        loading: false,
        message: `You need to mark this book as "Read" to write a review. Current status: ${
          statusNames[statusId] || "Unknown"
        }`,
        showForm: false,
        needsReadStatus: true,
        currentStatus: statusNames[statusId],
      };
    }

    // API says no - check why based on status
    if (statusId !== 3) {
      return {
        canReview: false,
        loading: false,
        message: `You need to mark this book as "Read" to write a review. Current status: ${
          statusNames[statusId] || "Unknown"
        }`,
        showForm: false,
        needsReadStatus: true,
        currentStatus: statusNames[statusId],
      };
    }

    // Book is marked as "Read" but API still says no
    return {
      canReview: false,
      loading: false,
      message:
        "Review permission check failed. Please try refreshing the page or contact support.",
      showForm: false,
      apiMismatch: true,
    };
  };

  const handleEditReview = (review) => {
    console.log("🔍 Editing Review:", review);
    setEditingReview(review);
    setShowReviewForm(false);
  };

  const handleReviewSuccess = () => {
    console.log("🎉 Review Success - Forms closed");

    // ✅ ONLY close forms - no cache operations
    setShowReviewForm(false);
    setEditingReview(null);

    console.log("✅ Forms closed - cache preserved");
  };

  const handleReviewCancel = () => {
    console.log("❌ Review Cancelled");
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleAddToLibrary = async () => {
    try {
      const response = await fetch("/api/library/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ bookId }),
      });
      if (!response.ok) throw new Error("Failed to add book to library");
      queryClient.invalidateQueries(["bookInLibrary", bookId]);
      console.log("✅ Book added to library");
    } catch (error) {
      console.error("❌ Error adding book to library:", error);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      const response = await fetch("/api/library/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ bookId, statusId: 3 }),
      });
      if (!response.ok) throw new Error("Failed to update book status");
      queryClient.invalidateQueries(["bookInLibrary", bookId]);
      queryClient.invalidateQueries(["canReview", bookId]);
      console.log("✅ Book marked as Read");
    } catch (error) {
      console.error("❌ Error marking book as Read:", error);
    }
  };

  const renderRatingDistribution = () => {
    if (!bookReviewData) return null;

    const {
      FiveStarCount = 0,
      FourStarCount = 0,
      ThreeStarCount = 0,
      TwoStarCount = 0,
      OneStarCount = 0,
      TotalReviews = 0,
      AverageRating = 0,
    } = bookReviewData;

    const ratings = [
      { stars: 5, count: FiveStarCount },
      { stars: 4, count: FourStarCount },
      { stars: 3, count: ThreeStarCount },
      { stars: 2, count: TwoStarCount },
      { stars: 1, count: OneStarCount },
    ];

    return (
      <div className="text-gray-700 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
        <div className="flex items-center mb-6">
          <div className="text-3xl font-bold text-gray-900 mr-4">
            {TotalReviews > 0 ? AverageRating.toFixed(1) : "0.0"}
          </div>
          <div>
            <StarRating
              rating={Math.round(AverageRating || 0)}
              readonly
              size="lg"
            />
            <p className="text-sm text-gray-600 mt-1">
              {TotalReviews} {TotalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
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
      <div className="text-red-500 text-center py-8 bg-red-50 border border-red-200 rounded-lg p-4">
        <p>Error loading reviews. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  const reviewPermission = getReviewPermission();
  console.log("🔍 Final Review Permission:", reviewPermission);

  return (
    <div className="space-y-6">
      {renderRatingDistribution()}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-gray-700 text-lg font-semibold mb-4">
          Your Review
        </h3>

        {reviewPermission.loading ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
              <p className="text-gray-600 text-sm">
                {reviewPermission.message}
              </p>
            </div>
          </div>
        ) : reviewPermission.hasExisting ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm mb-2">
                ✅ You have already reviewed this book
              </p>
              <div className="flex items-center space-x-4">
                <StarRating
                  rating={reviewPermission.existingReview.Rating}
                  readonly
                />
                <span className="text-sm text-gray-600">
                  Rated {reviewPermission.existingReview.Rating}/5 stars
                </span>
                <button
                  onClick={() =>
                    handleEditReview(reviewPermission.existingReview)
                  }
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Edit Review
                </button>
              </div>
            </div>
          </div>
        ) : reviewPermission.canReview && reviewPermission.showForm ? (
          <div>
            {!showReviewForm && !editingReview && (
              <button
                onClick={() => {
                  console.log("🔍 Clicking Write Review Button");
                  setShowReviewForm(true);
                }}
                className="w-full py-3 px-4 border border-dashed border-green-300 bg-green-50 rounded-lg text-green-700 hover:bg-green-100 hover:border-green-400 transition-colors font-medium"
              >
                ⭐ Write a review
              </button>
            )}
          </div>
        ) : (
          <div
            className={`rounded-lg p-4 ${
              reviewPermission.needsInLibrary
                ? "bg-amber-50 border-amber-200"
                : reviewPermission.needsReadStatus
                ? "bg-blue-50 border-blue-200"
                : "bg-red-50 border-red-200"
            } border`}
          >
            <p
              className={`text-sm ${
                reviewPermission.needsInLibrary
                  ? "text-amber-800"
                  : reviewPermission.needsReadStatus
                  ? "text-blue-800"
                  : "text-red-800"
              }`}
            >
              {reviewPermission.needsInLibrary
                ? "📚"
                : reviewPermission.needsReadStatus
                ? "📖"
                : "⚠️"}{" "}
              {reviewPermission.message}
            </p>
            {reviewPermission.needsInLibrary && (
              <button
                onClick={handleAddToLibrary}
                className="mt-2 text-amber-600 hover:text-amber-800 text-sm font-medium"
              >
                Add to Library
              </button>
            )}
            {reviewPermission.needsReadStatus && (
              <div className="mt-2">
                <button
                  onClick={handleMarkAsRead}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Mark as Read
                </button>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Tip: Use the dropdown above or this button to change your
                  reading status to "Read"
                </p>
              </div>
            )}
            {reviewPermission.fallbackPermission && (
              <p className="text-xs text-gray-600 mt-1">
                (Using fallback permission check)
              </p>
            )}
          </div>
        )}

        {showReviewForm && (
          <div className="mt-4">
            <ReviewForm
              bookId={bookId}
              onSuccess={handleReviewSuccess}
              onCancel={handleReviewCancel}
            />
          </div>
        )}

        {editingReview && (
          <div className="mt-4">
            <ReviewForm
              bookId={bookId}
              existingReview={editingReview}
              onSuccess={handleReviewSuccess}
              onCancel={handleReviewCancel}
            />
          </div>
        )}
      </div>
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
          <div className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
