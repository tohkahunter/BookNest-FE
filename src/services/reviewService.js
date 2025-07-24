import axiosInstance from "../config/axios";

// Review API Service
export const reviewApi = {
  // Create a new review
  createReview: async (bookId, reviewText, rating, isPublic = true) => {
    try {
      const response = await axiosInstance.post("/api/Review", {
        BookId: bookId,
        ReviewText: reviewText,
        Rating: rating,
        IsPublic: isPublic,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Update an existing review
  updateReview: async (reviewId, reviewText, rating, isPublic = true) => {
    try {
      const response = await axiosInstance.put(`/api/Review/${reviewId}`, {
        ReviewId: reviewId,
        ReviewText: reviewText,
        Rating: rating,
        IsPublic: isPublic,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await axiosInstance.delete(`/api/Review/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  // Get all reviews for a book
  getBookReviews: async (bookId) => {
    try {
      const response = await axiosInstance.get(`/api/Review/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting book reviews:", error);
      throw error;
    }
  },

  // Get specific review details
  getReviewById: async (reviewId) => {
    try {
      const response = await axiosInstance.get(`/api/Review/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting review:", error);
      throw error;
    }
  },

  // Check if current user can review this book
  canReviewBook: async (bookId) => {
    try {
      const response = await axiosInstance.get(
        `/api/Review/book/${bookId}/can-review`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking review permission:", error);
      throw error;
    }
  },

  // Get current user's review for a book
  getMyReviewForBook: async (bookId) => {
    try {
      const response = await axiosInstance.get(
        `/api/Review/book/${bookId}/my-review`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting my review:", error);
      throw error;
    }
  },
};

// Comment API Service
export const commentApi = {
  // Create a new comment
  createComment: async (reviewId, commentText) => {
    try {
      const response = await axiosInstance.post(
        `/api/Review/${reviewId}/comments`,
        {
          ReviewId: reviewId,
          CommentText: commentText,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Update an existing comment
  updateComment: async (commentId, commentText) => {
    try {
      const response = await axiosInstance.put(
        `/api/Review/comments/${commentId}`,
        {
          CommentId: commentId,
          CommentText: commentText,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/Review/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  // Get all comments for a review
  getReviewComments: async (reviewId) => {
    try {
      const response = await axiosInstance.get(
        `/api/Review/${reviewId}/comments`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting review comments:", error);
      throw error;
    }
  },
};
