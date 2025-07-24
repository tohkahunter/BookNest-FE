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

// ✅ FIXED: Hook to check if user can review a book
export const useCanReviewBook = (bookId) => {
  return useQuery({
    queryKey: QUERY_KEYS.CAN_REVIEW(bookId),
    queryFn: async () => {
      try {
        const result = await reviewApi.canReviewBook(bookId);
        console.log("✅ Can review API success:", result);
        return result;
      } catch (error) {
        console.log(
          "❌ Can review API error:",
          error.response?.status,
          error.message
        );
        // Don't throw for 404 or 403 - these are expected responses
        if (error.response?.status === 404 || error.response?.status === 403) {
          return false; // User cannot review
        }
        throw error; // Re-throw for other errors
      }
    },
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry for expected HTTP status codes
      if (error?.response?.status === 404 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// ✅ FIXED: Hook to get user's review for a book - Proper 404 handling
export const useMyReviewForBook = (bookId) => {
  return useQuery({
    queryKey: QUERY_KEYS.MY_REVIEW(bookId),
    queryFn: async () => {
      try {
        const result = await reviewApi.getMyReviewForBook(bookId);
        console.log("✅ My review API success:", result);
        return result;
      } catch (error) {
        console.log(
          "📝 My review API response:",
          error.response?.status,
          error.message
        );
        // 404 means no review exists - this is normal, return null
        if (error.response?.status === 404) {
          console.log("📝 No existing review found (404) - this is normal");
          return null;
        }
        // For other errors, re-throw
        console.error("❌ Unexpected error getting my review:", error);
        throw error;
      }
    },
    enabled: !!bookId,
    retry: (failureCount, error) => {
      // Don't retry if review not found (404) - this is expected
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    // ✅ CRITICAL: Don't treat 404 as error in UI
    onError: (error) => {
      // Only log real errors, not 404s
      if (error?.response?.status !== 404) {
        console.error("Real error getting my review:", error);
      }
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
      console.log("✅ Review created successfully:", data);

      // Invalidate and refetch book reviews
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOK_REVIEWS(variables.bookId),
      });

      // Invalidate can review check
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CAN_REVIEW(variables.bookId),
      });

      // Update my review cache with the new review
      queryClient.setQueryData(
        QUERY_KEYS.MY_REVIEW(variables.bookId),
        data.Review || data // Handle different response formats
      );

      // Invalidate my reviews list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_REVIEWS,
      });
    },
    onError: (error) => {
      console.error("❌ Error creating review:", error);
    },
  });
};

// Hook to update a review
// export const useUpdateReview = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ reviewId, reviewText, rating, isPublic }) =>
//       reviewApi.updateReview(reviewId, reviewText, rating, isPublic),
//     onSuccess: (data, variables) => {
//       const updatedReview = data.Review || data; // Handle different response formats
//       console.log("✅ Review updated successfully:", updatedReview);

//       // Update specific review cache
//       queryClient.setQueryData(
//         QUERY_KEYS.REVIEW(variables.reviewId),
//         updatedReview
//       );

//       // Invalidate book reviews to reflect changes
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEYS.BOOK_REVIEWS(updatedReview.BookId),
//       });

//       // Update my review cache
//       queryClient.setQueryData(
//         QUERY_KEYS.MY_REVIEW(updatedReview.BookId),
//         updatedReview
//       );

//       // Invalidate my reviews list
//       queryClient.invalidateQueries({
//         queryKey: QUERY_KEYS.MY_REVIEWS,
//       });
//     },
//     onError: (error) => {
//       console.error("❌ Error updating review:", error);
//     },
//   });
// };

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, bookId, reviewText, rating, isPublic }) => {
      console.log("🚀 API Call with:", {
        reviewId,
        reviewText,
        rating,
        isPublic,
      });
      return reviewApi.updateReview(reviewId, reviewText, rating, isPublic);
    },
    onSuccess: (apiResponse, variables) => {
      const updatedReview = apiResponse.Review || apiResponse;
      const bookId = variables.bookId;

      console.log("✅ API Response:", updatedReview);
      console.log("✅ New Review Text:", updatedReview.ReviewText);

      // 1. Update MY_REVIEW cache
      queryClient.setQueryData(QUERY_KEYS.MY_REVIEW(bookId), updatedReview);
      console.log("📝 MY_REVIEW cache updated");

      // 2. Update the review in BOOK_REVIEWS list
      const currentBookReviews = queryClient.getQueryData(
        QUERY_KEYS.BOOK_REVIEWS(bookId)
      );

      if (currentBookReviews && currentBookReviews.Reviews) {
        const updatedBookReviews = {
          ...currentBookReviews,
          Reviews: currentBookReviews.Reviews.map((review) => {
            if (review.ReviewId === updatedReview.ReviewId) {
              console.log("🔄 Updating review in list:", {
                oldText: review.ReviewText,
                newText: updatedReview.ReviewText,
              });
              return { ...review, ...updatedReview };
            }
            return review;
          }),
        };

        queryClient.setQueryData(
          QUERY_KEYS.BOOK_REVIEWS(bookId),
          updatedBookReviews
        );

        console.log(
          "✅ BOOK_REVIEWS cache updated with new text:",
          updatedReview.ReviewText
        );
      }

      console.log("✅ Both caches updated successfully");

      // ❌ REMOVE ALL INVALIDATION - Keep fresh cache data
      // No setTimeout, no invalidateQueries
      // Let user manually refresh if they want server data
    },
    onError: (error) => {
      console.error("❌ Error updating review:", error);
    },
  });
};

// Hook to delete a review
export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId) => reviewApi.deleteReview(reviewId),
    onSuccess: (data, reviewId) => {
      console.log("✅ Review deleted successfully");

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

      // ✅ CRITICAL: Also invalidate the specific book's my-review cache
      // Note: We need the bookId, but it's not passed to this mutation
      // Consider passing bookId in the mutation for better cache management
      queryClient.invalidateQueries({
        predicate: (query) => {
          // Invalidate all MY_REVIEW queries when a review is deleted
          return query.queryKey[0] === "my-review";
        },
      });
    },
    onError: (error) => {
      console.error("❌ Error deleting review:", error);
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
      console.log("✅ Comment created successfully");

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
      console.error("❌ Error creating comment:", error);
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
      const updatedComment = data.Comment || data;
      console.log("✅ Comment updated successfully");

      // Invalidate review comments
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REVIEW_COMMENTS(updatedComment.ReviewId),
      });
    },
    onError: (error) => {
      console.error("❌ Error updating comment:", error);
    },
  });
};

// Hook to delete a comment
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => commentApi.deleteComment(commentId),
    onSuccess: (data, commentId) => {
      console.log("✅ Comment deleted successfully");

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
      console.error("❌ Error deleting comment:", error);
    },
  });
};
