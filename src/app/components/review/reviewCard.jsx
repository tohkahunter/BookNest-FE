import React, { useState } from "react";
import StarRating from "./starRating";
import CommentSection from "../comment/CommentSection";
import { useDeleteReview } from "../../hooks/useReview";

const ReviewCard = ({ review, onEdit }) => {
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteReviewMutation = useDeleteReview();

  const handleDelete = async () => {
    try {
      await deleteReviewMutation.mutateAsync(review.ReviewId);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {review.UserProfilePictureUrl ? (
              <img
                src={review.UserProfilePictureUrl}
                alt={review.UserFullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {review.UserFullName?.charAt(0) ||
                  review.Username?.charAt(0) ||
                  "U"}
              </span>
            )}
          </div>

          {/* User Info */}
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.UserFullName || review.Username}
            </h4>
            <p className="text-sm text-gray-500">
              {formatDate(review.DateReviewed)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        {(review.CanEdit || review.CanDelete) && (
          <div className="flex space-x-2">
            {review.CanEdit && (
              <button
                onClick={() => onEdit(review)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
            )}
            {review.CanDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                disabled={deleteReviewMutation.isPending}
              >
                {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={review.Rating} readonly />
      </div>

      {/* Review Text */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {review.ReviewText}
        </p>
      </div>

      {/* Review Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {!review.IsPublic && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Private
            </span>
          )}
        </div>

        {/* Comment Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center space-x-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>
              {review.CommentCount}{" "}
              {review.CommentCount === 1 ? "Comment" : "Comments"}
            </span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <CommentSection reviewId={review.ReviewId} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Review</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={deleteReviewMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                disabled={deleteReviewMutation.isPending}
              >
                {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
