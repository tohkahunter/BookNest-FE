// src/hooks/queries/useGenres.js
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import { useBooks } from "./useBooks";

// 🎯 Hook chính để extract genres từ books data
export const useGenres = (options = {}) => {
  const { data: books, isLoading: booksLoading } = useBooks();

  return useQuery({
    queryKey: QUERY_KEYS.GENRES,
    queryFn: async () => {
      if (!books || books.length === 0) {
        return [];
      }

      // Extract unique genres từ books data
      const genreMap = new Map();

      books.forEach((book) => {
        if (book.GenreId && !genreMap.has(book.GenreId)) {
          genreMap.set(book.GenreId, {
            GenreId: book.GenreId,
            GenreName: book.GenreName || `Genre ${book.GenreId}`,
          });
        }
      });

      const genres = Array.from(genreMap.values());

      // Sort theo tên genre A-Z
      return genres.sort((a, b) => a.GenreName.localeCompare(b.GenreName));
    },
    enabled: !!books && books.length > 0 && !booksLoading,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
    ...options,
  });
};
