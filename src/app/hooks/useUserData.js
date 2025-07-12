// src/hooks/queries/useUserData.js
// Combined hook cho tất cả user-related data
import { useAuth } from "./useAuth";
import { useBookshelf } from "./useBookshelf";
import { useMemo } from "react";

export const useUserData = () => {
  const auth = useAuth();
  const bookshelf = useBookshelf();

  // Combine user stats từ bookshelf data
  const userStats = useMemo(() => {
    if (!auth.isAuthenticated || !bookshelf.userBooks) {
      return { totalBooks: 0, currentlyReading: 0, completed: 0 };
    }

    const totalBooks = bookshelf.userBooks.length;
    const currentlyReading = bookshelf.userBooks.filter(
      (book) => book?.statusId === 2
    ).length;
    const completed = bookshelf.userBooks.filter(
      (book) => book?.statusId === 3
    ).length;

    return { totalBooks, currentlyReading, completed };
  }, [auth.isAuthenticated, bookshelf.userBooks]);

  // Combined loading state
  const isLoading = auth.loading || bookshelf.loading;

  // Combined error state
  const error = auth.error || bookshelf.error;

  return {
    // Auth data
    ...auth,

    // Bookshelf data
    userBooks: bookshelf.userBooks,
    shelves: bookshelf.shelves,
    readingStatuses: bookshelf.readingStatuses,

    // Bookshelf actions
    addBookToLibrary: bookshelf.addBookToLibrary,
    updateBookStatus: bookshelf.updateBookStatus,
    updateReadingProgress: bookshelf.updateReadingProgress,
    removeBookFromLibrary: bookshelf.removeBookFromLibrary,
    createShelf: bookshelf.createShelf,
    deleteShelf: bookshelf.deleteShelf,
    quickAddBook: bookshelf.quickAddBook,
    startReading: bookshelf.startReading,
    finishReading: bookshelf.finishReading,
    checkBookInLibrary: bookshelf.checkBookInLibrary,

    // Combined computed data
    userStats,

    // Combined states
    isLoading,
    error,

    // Utility functions
    refreshUserData: () => {
      auth.refreshAuth();
      bookshelf.fetchMyBooks();
      bookshelf.fetchMyShelves();
    },

    clearAllErrors: () => {
      auth.clearError();
      bookshelf.clearError();
    },
  };
};
