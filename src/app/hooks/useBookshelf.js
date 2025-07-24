// src/hooks/queries/useBookshelf.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import * as bookshelfService from "../../services/bookshelfService";
import { toast } from "react-hot-toast"; // Adjust import theo notification library bạn dùng

// ===== SHELF HOOKS =====

// Get user's shelves
export const useMyShelves = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_SHELVES,
    queryFn: bookshelfService.getMyShelves,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create new shelf
export const useCreateShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.createShelf,
    onSuccess: (data) => {
      // Invalidate shelves list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });

      toast.success(data.Message || "Tạo kệ sách thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi tạo kệ sách";
      toast.error(errorMessage);
    },
  });
};

// Update shelf
export const useUpdateShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.updateShelf,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });

      toast.success(data.Message || "Cập nhật kệ sách thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi cập nhật kệ sách";
      toast.error(errorMessage);
    },
  });
};

// Delete shelf
export const useDeleteShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.deleteShelf,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });

      toast.success(data.Message || "Xóa kệ sách thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi xóa kệ sách";
      toast.error(errorMessage);
    },
  });
};

// ===== READING STATUS HOOKS =====

// Get reading statuses
export const useReadingStatuses = () => {
  return useQuery({
    queryKey: QUERY_KEYS.READING_STATUS,
    queryFn: bookshelfService.getReadingStatuses,
    staleTime: 10 * 60 * 1000, // 10 minutes (rarely changes)
  });
};

// ===== BOOK MANAGEMENT HOOKS =====

// Get user's books with filters
export const useMyBooks = (filters = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_BOOKS, filters],
    queryFn: () => bookshelfService.getMyBooks(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get books by status
export const useBooksByStatus = (statusId) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_STATUS(statusId),
    queryFn: () => bookshelfService.getBooksByStatus(statusId),
    enabled: !!statusId, // Only run if statusId exists
    staleTime: 2 * 60 * 1000,
  });
};

// Get books by shelf
export const useBooksByShelf = (shelfId) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_SHELF(shelfId),
    queryFn: () => bookshelfService.getBooksByShelf(shelfId),
    enabled: !!shelfId, // Only run if shelfId exists
    staleTime: 2 * 60 * 1000,
  });
};

// Get specific user book
export const useUserBook = (bookId) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_BOOK(bookId),
    queryFn: () => bookshelfService.getUserBook(bookId),
    enabled: !!bookId, // Only run if bookId exists
    staleTime: 2 * 60 * 1000,
  });
};

// Check if book exists in library
export const useBookInLibrary = (bookId) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOK_IN_LIBRARY(bookId),
    queryFn: () => bookshelfService.checkBookInLibrary(bookId),
    enabled: !!bookId,
    staleTime: 5 * 60 * 1000,
  });
};
// Add book to library (alias for useAddBookToShelf)
export const useAddBookToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.addBookToShelf,
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });

      toast.success(data.Message || "Thêm sách thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi thêm sách";
      toast.error(errorMessage);
    },
  });
};

// Update book status
export const useUpdateBookStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.updateBookStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });

      toast.success(data.Message || "Cập nhật trạng thái thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi cập nhật trạng thái";
      toast.error(errorMessage);
    },
  });
};

// Update reading progress
export const useUpdateReadingProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.updateReadingProgress,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });

      toast.success(data.Message || "Cập nhật tiến độ thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi cập nhật tiến độ";
      toast.error(errorMessage);
    },
  });
};

// Remove book from library
export const useRemoveBookFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.removeBookFromShelf,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });

      toast.success(data.Message || "Xóa sách thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi xóa sách";
      toast.error(errorMessage);
    },
  });
};

// Move book between shelves
export const useMoveBookToShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.moveBookToShelf,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });

      toast.success(data.Message || "Di chuyển sách thành công!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi di chuyển sách";
      toast.error(errorMessage);
    },
  });
};

// ===== QUICK ACTION HOOKS =====

// Quick add book with default status (Want to Read)
export const useQuickAddBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.quickAddBook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });

      toast.success(data.Message || 'Thêm sách vào "Muốn đọc" thành công!');
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi thêm sách";
      toast.error(errorMessage);
    },
  });
};

// Start reading a book
export const useStartReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.startReading,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });

      toast.success(data.Message || 'Đã chuyển sang "Đang đọc"!');
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    },
  });
};

// Finish reading a book
export const useFinishReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookshelfService.finishReading,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });

      toast.success(data.Message || "Đã hoàn thành sách!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    },
  });
};

// Main bookshelf hook (combines multiple functionalities)
export const useBookshelf = () => {
  const shelves = useMyShelves();
  const myBooks = useMyBooks();
  const readingStatuses = useReadingStatuses();

  return {
    shelves,
    books: myBooks,
    readingStatuses,
    // Action hooks
    createShelf: useCreateShelf(),
    deleteShelf: useDeleteShelf(),
    addBook: useAddBookToLibrary(),
    updateStatus: useUpdateBookStatus(),
    removeBook: useRemoveBookFromLibrary(),
  };
};

export const useCheckBookInLibrary = useBookInLibrary;
