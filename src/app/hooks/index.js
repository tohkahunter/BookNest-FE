// src/hooks/queries/index.js
// Export tất cả React Query hooks để dễ import

// Books hooks
export {
  useBooks,
  usePopularBooks,
  useRecentBooks,
  useSearchBooks,
  useBook,
  useBooksByGenre, // ✅ Thiếu hook này
  useBooksByAuthor, // ✅ Thiếu hook này
  useBooksWithDetails, // ✅ Thiếu hook này
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
  useBooksByStatus, // ✅ Thiếu hook này
  useBooksByShelf, // ✅ Thiếu hook này
  useUserBook, // ✅ Thiếu hook này
  useMyShelves,
  useReadingStatuses,
  useBookInLibrary,
  useAddBookToLibrary,
  useUpdateBookStatus,
  useUpdateReadingProgress,
  useRemoveBookFromLibrary,
  useCreateShelf,
  useUpdateShelf, // ✅ Thiếu hook này
  useDeleteShelf,
  useMoveBookToShelf, // ✅ Thiếu hook này
  useQuickAddBook, // ✅ Thiếu hook này
  useStartReading, // ✅ Thiếu hook này
  useFinishReading, // ✅ Thiếu hook này
  useBookshelf,
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
export { useUserData } from "./useUserData"; // ✅ Thiếu hook này nếu đã tạo
