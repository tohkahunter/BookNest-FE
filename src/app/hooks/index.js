// src/hooks/queries/index.js
// Export tất cả React Query hooks để dễ import

// Books hooks
export {
  useBooks,
  usePopularBooks,
  useRecentBooks,
  useSearchBooks,
  useBook,
  useBooksByGenre,
  useBooksByAuthor,
  useBooksWithDetails,
} from "./useBooks";

// Authors hooks
export {
  useAuthors,
  useAuthorsWithBookCounts,
  usePopularAuthors,
  useSearchAuthors,
  useAuthor,
  useAuthorBooks,
} from "./useAuthors";

// Genres hooks
export { useGenres } from "./useGenres";

// Bookshelf hooks
export {
  useMyBooks,
  useBooksByStatus,
  useBooksByShelf,
  useUserBook,
  useMyShelves,
  useReadingStatuses,
  useBookInLibrary,
  useAddBookToLibrary,
  useUpdateBookStatus,
  useUpdateReadingProgress,
  useRemoveBookFromLibrary,
  useCreateShelf,
  useUpdateShelf,
  useDeleteShelf,
  useMoveBookToShelf,
  useQuickAddBook,
  useStartReading,
  useFinishReading,
  useBookshelf,
  useCheckBookInLibrary,
} from "./useBookshelf";

// Auth hooks
export {
  useAuth,
  useCurrentUser, // ✅ Cập nhật tên hook (thay vì useUserProfile)
  useLogin,
  useRegister,
  useLogout,
  useUpdateUserProfile,
} from "./useAuth";

// Combined hooks
export { useHomePageData } from "./useHomeData";

// User data hooks
export { useUserData } from "./useUserData";
