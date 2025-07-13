// src/hooks/queries/useHomeData.js
import { useBooks } from "./useBooks";
import { useAuthors } from "./useAuthors";

// ✅ Import individual hooks instead of useBookshelf
import { useMyBooks, useReadingStatuses } from "./useBookshelf";

// SIMPLIFIED hook chỉ dùng APIs có sẵn và WORKING
export const useHomePageData = () => {
  // Chỉ dùng APIs có sẵn và đã verified working
  const booksQuery = useBooks();
  const authorsQuery = useAuthors();

  // ✅ Add reading statuses - confirmed working from logs
  const readingStatusesQuery = useReadingStatuses();

  // Combine loading states (chỉ từ working APIs)
  const isLoading = booksQuery.isLoading || authorsQuery.isLoading;

  // Combine error states (chỉ từ working APIs)
  const error = booksQuery.error || authorsQuery.error;

  // Process data từ APIs có sẵn
  const books = booksQuery.data || [];
  const authors = authorsQuery.data || [];
  const readingStatuses = readingStatusesQuery.data || [];

  // ✅ FAKE popular/recent books từ data có sẵn
  const featuredBooks = books.slice(0, 8); // First 8 books as featured
  const popularBooks = books.slice(0, 8); // Same as featured for now
  const recentBooks = books.slice(-6); // Last 6 books as recent

  // ✅ FAKE popular authors từ data có sẵn
  const popularAuthors = authors.slice(0, 4); // First 4 authors

  const refetchAll = () => {
    booksQuery.refetch();
    authorsQuery.refetch();
    readingStatusesQuery.refetch();
  };

  return {
    // Data
    books,
    featuredBooks,
    popularBooks,
    recentBooks,
    authors,
    popularAuthors,
    readingStatuses, // ✅ Add this for other components

    // States
    isLoading,
    error,

    // Actions
    refetchAll,
  };
};
