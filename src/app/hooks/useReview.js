import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi, commentApi } from "../../services/reviewService";
import { QUERY_KEYS } from "../../lib/queryKeys";

// ========== REVIEW HOOKS ==========

// Hook to get all reviews for a book
export const useBookReviews = (bookId) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOK_REVIEWS(bookId),
    queryFn: () => reviewApi.getBookReviews(bookId),
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to check if user can review a book
export const useCanReviewBook = (bookId) => {
  return useQuery({
    queryKey: QUERY_KEYS.CAN_REVIEW(bookId),
    queryFn: () => reviewApi.canReviewBook(bookId),
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get user's review for a book
export const useMyReviewForBook = (bookId) => {
  return useQuery({
    queryKey: QUERY_KEYS.MY_REVIEW(bookId),
    queryFn: () => reviewApi.getMyReviewForBook(bookId),
    enabled: !!bookId,
    retry: (failureCount, error) => {
      // Don't retry if review not found (404)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook to get specific review details
export const useReviewById = (reviewId) => {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEW(reviewId),
    queryFn: () => reviewApi.getReviewById(reviewId),
    enabled: !!reviewId,
  });
};

// Hook to create a new review
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, reviewText, rating, isPublic }) =>
      reviewApi.createReview(bookId, reviewText, rating, isPublic),
    onSuccess: (data, variables) => {
      // Invalidate and refetch book reviews
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOK_REVIEWS(variables.bookId),
      });

      // Invalidate can review check
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CAN_REVIEW(variables.bookId),
      });

      // Update my review cache
      queryClient.setQueryData(
        QUERY_KEYS.MY_REVIEW(variables.bookId),
        data.Review
      );

      // Invalidate my reviews list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_REVIEWS,
      });
    },
    onError: (error) => {
      console.error("Error creating review:", error);
    },
  });
};

// Hook to update a review
export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reviewText, rating, isPublic }) =>
      reviewApi.updateReview(reviewId, reviewText, rating, isPublic),
    onSuccess: (data, variables) => {
      const updatedReview = data.Review;

      // Update specific review cache
      queryClient.setQueryData(
        QUERY_KEYS.REVIEW(variables.reviewId),
        updatedReview
      );

      // Invalidate book reviews to reflect changes
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOK_REVIEWS(updatedReview.BookId),
      });

      // Update my review cache
      queryClient.setQueryData(
        QUERY_KEYS.MY_REVIEW(updatedReview.BookId),
        updatedReview
      );

      // Invalidate my reviews list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_REVIEWS,
      });
    },
    onError: (error) => {
      console.error("Error updating review:", error);
    },
  });
};

// Hook to delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewApi.deleteReview(reviewId),
    onSuccess: (data, reviewId) => {
      // Remove from all relevant caches
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.REVIEW(reviewId),
      });

      // Invalidate all review-related queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEWS,
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_REVIEWS,
      });
    },
    onError: (error) => {
      console.error("Error deleting review:", error);
    },
  });
};

// ========== COMMENT HOOKS ==========

// Hook to get comments for a review
export const useReviewComments = (reviewId) => {
  return useQuery({
    queryKey: QUERY_KEYS.REVIEW_COMMENTS(reviewId),
    queryFn: () => commentApi.getReviewComments(reviewId),
    enabled: !!reviewId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a new comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, commentText }) =>
      commentApi.createComment(reviewId, commentText),
    onSuccess: (data, variables) => {
      // Invalidate review comments
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEW_COMMENTS(variables.reviewId),
      });

      // Invalidate book reviews to update comment count
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOK_REVIEWS,
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });
};

// Hook to update a comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, commentText }) =>
      commentApi.updateComment(commentId, commentText),
    onSuccess: (data, variables) => {
      const updatedComment = data.Comment;

      // Invalidate review comments
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEW_COMMENTS(updatedComment.ReviewId),
      });
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });
};

// Hook to delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentApi.deleteComment(commentId),
    onSuccess: (data, commentId) => {
      // Invalidate all comment-related queries
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMENTS,
      });

      // Invalidate book reviews to update comment count
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOK_REVIEWS,
      });
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });
};
