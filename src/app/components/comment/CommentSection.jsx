import React, { useState } from "react";
import CommentForm from "./commentForm";
import { useReviewComments, useDeleteComment } from "../../hooks/useReview";

const CommentSection = ({ reviewId }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { data: comments = [], isLoading, error } = useReviewComments(reviewId);

  const deleteCommentMutation = useDeleteComment();

  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setShowCommentForm(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentSuccess = () => {
    setShowCommentForm(false);
    setEditingComment(null);
  };

  const handleCommentCancel = () => {
    setShowCommentForm(false);
    setEditingComment(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm py-4">
        Error loading comments. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.CommentId} className="bg-gray-50 rounded-lg p-4">
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    {comment.UserProfilePictureUrl ? (
                      <img
                        src={comment.UserProfilePictureUrl}
                        alt={comment.UserFullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 text-sm font-medium">
                        {comment.UserFullName?.charAt(0) ||
                          comment.Username?.charAt(0) ||
                          "U"}
                      </span>
                    )}
                  </div>

                  {/* User Info */}
                  <div>
                    <h5 className="font-medium text-sm text-gray-900">
                      {comment.UserFullName || comment.Username}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.DateCommented)}
                      {comment.IsEdited && (
                        <span className="ml-2 text-gray-400">(edited)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {(comment.CanEdit || comment.CanDelete) && (
                  <div className="flex space-x-2">
                    {comment.CanEdit && (
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Edit
                      </button>
                    )}
                    {comment.CanDelete && (
                      <button
                        onClick={() => setDeleteConfirmId(comment.CommentId)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium"
                        disabled={deleteCommentMutation.isPending}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Comment Text */}
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {comment.CommentText}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm py-4 text-center">
          No comments yet. Be the first to comment!
        </div>
      )}

      {/* Add Comment Button */}
      {!showCommentForm && !editingComment && (
        <button
          onClick={() => setShowCommentForm(true)}
          className=" text-gray-700 w-full py-2 px-4 border border-dashed border-gray-300 rounded-lg  hover:bg-gray-50 hover:border-gray-400 transition-colors text-sm"
        >
          + Add a comment
        </button>
      )}

      {/* Comment Form */}
      {showCommentForm && (
        <CommentForm
          reviewId={reviewId}
          onSuccess={handleCommentSuccess}
          onCancel={handleCommentCancel}
        />
      )}

      {/* Edit Comment Form */}
      {editingComment && (
        <CommentForm
          reviewId={reviewId}
          existingComment={editingComment}
          onSuccess={handleCommentSuccess}
          onCancel={handleCommentCancel}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Comment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={deleteCommentMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteComment(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                disabled={deleteCommentMutation.isPending}
              >
                {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
