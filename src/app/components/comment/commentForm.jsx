import React, { useState, useEffect } from "react";
import { useCreateComment, useUpdateComment } from "../../hooks/useReview";

const CommentForm = ({
  reviewId,
  existingComment = null,
  onCancel,
  onSuccess,
}) => {
  const [commentText, setCommentText] = useState("");
  const [errors, setErrors] = useState({});

  const createCommentMutation = useCreateComment();
  const updateCommentMutation = useUpdateComment();

  const isEditing = !!existingComment;
  const isLoading =
    createCommentMutation.isPending || updateCommentMutation.isPending;

  // Initialize form with existing comment data
  useEffect(() => {
    if (existingComment) {
      setCommentText(existingComment.CommentText || "");
    }
  }, [existingComment]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!commentText.trim()) {
      newErrors.commentText = "Comment text is required";
    } else if (commentText.trim().length < 3) {
      newErrors.commentText = "Comment must be at least 3 characters long";
    } else if (commentText.trim().length > 1000) {
      newErrors.commentText =
        "Comment must be no more than 1000 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const commentData = {
      reviewId,
      commentText: commentText.trim(),
    };

    try {
      if (isEditing) {
        await updateCommentMutation.mutateAsync({
          commentId: existingComment.CommentId,
          commentText: commentText.trim(),
        });
      } else {
        await createCommentMutation.mutateAsync(commentData);
      }

      // Reset form
      setCommentText("");
      setErrors({});

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        setErrors({
          submit: error.response.data.message || "Invalid comment data",
        });
      } else if (error.response?.status === 401) {
        setErrors({ submit: "Please log in to submit a comment" });
      } else {
        setErrors({
          submit: "An error occurred while submitting your comment",
        });
      }
    }
  };

  const handleCancel = () => {
    // Reset form
    setCommentText("");
    setErrors({});

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h4 className="text-gray-700 text-md font-medium mb-3">
        {isEditing ? "Edit Comment" : "Add a Comment"}
      </h4>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Comment Text */}
        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className={`text-gray-700 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.commentText ? "border-red-500" : "border-gray-300"
            }`}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            <div>
              {errors.commentText && (
                <p className="text-red-500 text-sm">{errors.commentText}</p>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {commentText.length}/1000 characters
            </span>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
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
                {isEditing ? "Updating..." : "Posting..."}
              </span>
            ) : isEditing ? (
              "Update Comment"
            ) : (
              "Post Comment"
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md font-medium text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
