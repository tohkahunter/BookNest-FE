// src/hooks/queries/useGenres.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import { genreService } from "../../services/genreService";

// 🎯 Get all genres
export const useGenres = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.GENRES,
    queryFn: genreService.getAllGenres,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
    ...options,
  });
};

// 🎯 Get single genre by ID
export const useGenre = (id, options = {}) => {
  return useQuery({
    queryKey: ["genre", id], // Consistent with your pattern
    queryFn: () => genreService.getGenreById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};

// 🎯 Create new genre (Admin only)
export const useCreateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: genreService.createGenre,
    onSuccess: (data) => {
      // Invalidate và refetch genres list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENRES });

      // Add new genre to cache optimistically
      queryClient.setQueryData(["genre", data.Genre.GenreId], data.Genre);
    },
    onError: (error) => {
      console.error("Failed to create genre:", error);
    },
  });
};

// 🎯 Update genre (Admin only)
export const useUpdateGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => genreService.updateGenre(id, data),
    onSuccess: (data, variables) => {
      // Update genres list cache
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENRES });

      // Update specific genre cache
      queryClient.setQueryData(["genre", variables.id], data.Genre);
    },
    onError: (error) => {
      console.error("Failed to update genre:", error);
    },
  });
};

// 🎯 Delete genre (Admin only)
export const useDeleteGenre = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: genreService.deleteGenre,
    onSuccess: (data, deletedId) => {
      // Remove from genres list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GENRES });

      // Remove specific genre from cache
      queryClient.removeQueries({ queryKey: ["genre", deletedId] });
    },
    onError: (error) => {
      console.error("Failed to delete genre:", error);
    },
  });
};

// 🎯 Helper hook for genre options (for dropdowns)
export const useGenreOptions = () => {
  const { data: genres, isLoading } = useGenres();

  const genreOptions =
    genres?.map((genre) => ({
      value: genre.GenreId,
      label: genre.GenreName,
      description: genre.Description,
      bookCount: genre.BookCount,
    })) || [];

  return {
    genreOptions,
    isLoading,
    isEmpty: genreOptions.length === 0,
  };
};

// 🎯 Search genres hook (client-side filtering)
export const useSearchGenres = (searchTerm = "") => {
  const { data: genres, ...rest } = useGenres();

  const filteredGenres =
    genres?.filter(
      (genre) =>
        genre.GenreName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        genre.Description?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return {
    data: filteredGenres,
    searchTerm,
    totalCount: genres?.length || 0,
    filteredCount: filteredGenres.length,
    ...rest,
  };
};

// 🎯 Genres statistics
export const useGenreStats = () => {
  const { data: genres } = useGenres();

  const stats = {
    totalGenres: genres?.length || 0,
    totalBooks:
      genres?.reduce((sum, genre) => sum + (genre.BookCount || 0), 0) || 0,
    avgBooksPerGenre: 0,
    mostPopularGenre: null,
    emptyGenres:
      genres?.filter((genre) => (genre.BookCount || 0) === 0).length || 0,
  };

  if (stats.totalGenres > 0) {
    stats.avgBooksPerGenre =
      Math.round((stats.totalBooks / stats.totalGenres) * 100) / 100;
    stats.mostPopularGenre =
      genres?.reduce((max, genre) =>
        (genre.BookCount || 0) > (max?.BookCount || 0) ? genre : max
      ) || null;
  }

  return stats;
};

// 🎯 Get books by genre (sử dụng BOOKS_BY_GENRE key)
export const useBooksByGenre = (genreId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_GENRE(genreId),
    queryFn: () => {
      // Assuming you have a bookService.getBooksByGenre method
      // return bookService.getBooksByGenre(genreId);

      // For now, return empty array - implement when you have book service
      return Promise.resolve([]);
    },
    enabled: !!genreId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};

// 🎯 Genre with books count (optimized version)
export const useGenreWithBooks = (id, options = {}) => {
  return useQuery({
    queryKey: ["genre", id, "with-books"],
    queryFn: () => genreService.getGenreById(id), // Backend already returns BookCount
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};
