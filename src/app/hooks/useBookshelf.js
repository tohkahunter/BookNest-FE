// src/hooks/queries/useBookshelf.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import * as bookshelfService from "../../services/bookshelfService";

// ==================== QUERY HOOKS ====================

// Hook để lấy sách của user với optional filters
export const useMyBooks = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_BOOKS, filters],
    queryFn: () => bookshelfService.getMyBooks(filters), // ✅ Pass filters object
    staleTime: 2 * 60 * 1000, // 2 phút - user data thay đổi thường xuyên
    cacheTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

// Hook để lấy books theo status
export const useBooksByStatus = (statusId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_STATUS(statusId),
    queryFn: () => bookshelfService.getBooksByStatus(statusId), // ✅ Pass statusId
    enabled: !!statusId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy books theo shelf
export const useBooksByShelf = (shelfId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_SHELF(shelfId),
    queryFn: () => bookshelfService.getBooksByShelf(shelfId), // ✅ Pass shelfId
    enabled: !!shelfId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy user book details
export const useUserBook = (bookId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_BOOK(bookId),
    queryFn: () => bookshelfService.getUserBook(bookId), // ✅ Pass bookId
    enabled: !!bookId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy shelves của user
export const useMyShelves = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_SHELVES,
    queryFn: bookshelfService.getMyShelves, // ✅ Match exact service function
    staleTime: 10 * 60 * 1000, // 10 phút - shelves ít thay đổi
    cacheTime: 15 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy reading statuses
export const useReadingStatuses = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.READING_STATUS,
    queryFn: bookshelfService.getReadingStatuses, // ✅ Match exact service function
    staleTime: 30 * 60 * 1000, // 30 phút - statuses rất ít thay đổi
    cacheTime: 60 * 60 * 1000, // 1 giờ
    ...options,
  });
};

// Hook để check book có trong library không
export const useBookInLibrary = (bookId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOK_IN_LIBRARY(bookId),
    queryFn: () => bookshelfService.checkBookInLibrary(bookId), // ✅ Pass bookId
    enabled: !!bookId,
    staleTime: 1 * 60 * 1000, // 1 phút
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

// Hook để add book vào library
export const useAddBookToLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, statusId = 1, shelfId = null }) =>
      bookshelfService.addBookToShelf({ bookId, statusId, shelfId }), // ✅ Match exact service signature

    onSuccess: (data, variables) => {
      // Invalidate user books để refresh
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });

      // Update book in library status
      queryClient.setQueryData(QUERY_KEYS.BOOK_IN_LIBRARY(variables.bookId), {
        exists: true,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
      if (variables.statusId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.BOOKS_BY_STATUS(variables.statusId),
        });
      }
      if (variables.shelfId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.BOOKS_BY_SHELF(variables.shelfId),
        });
      }
    },

    onError: (error) => {
      console.error("Error adding book to library:", error);
    },
  });
};

// Hook để update book status
export const useUpdateBookStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, newStatusId }) =>
      bookshelfService.updateBookStatus({ bookId, newStatusId }), // ✅ Match exact service signature

    onSuccess: (data, variables) => {
      // Invalidate user books
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_BOOK(variables.bookId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKS_BY_STATUS(variables.newStatusId),
      });
    },

    onError: (error) => {
      console.error("Error updating book status:", error);
    },
  });
};

// Hook để update reading progress
export const useUpdateReadingProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      currentPage = null,
      readingProgress = null,
      notes = null,
    }) =>
      bookshelfService.updateReadingProgress({
        bookId,
        currentPage,
        readingProgress,
        notes,
      }), // ✅ Match exact service signature

    onSuccess: (data, variables) => {
      // Invalidate user books
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_BOOK(variables.bookId),
      });
    },

    onError: (error) => {
      console.error("Error updating reading progress:", error);
    },
  });
};

// Hook để remove book from library
export const useRemoveBookFromLibrary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => bookshelfService.removeBookFromShelf(bookId), // ✅ Match exact service signature

    onSuccess: (data, bookId) => {
      // Invalidate user books
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });

      // Update book in library status
      queryClient.setQueryData(QUERY_KEYS.BOOK_IN_LIBRARY(bookId), {
        exists: false,
      });

      // Remove specific user book data
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_BOOK(bookId) });
    },

    onError: (error) => {
      console.error("Error removing book from library:", error);
    },
  });
};

// Hook để create shelf
export const useCreateShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shelfName, description = null }) =>
      bookshelfService.createShelf({ shelfName, description }), // ✅ Match exact service signature

    onSuccess: () => {
      // Invalidate shelves
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
    },

    onError: (error) => {
      console.error("Error creating shelf:", error);
    },
  });
};

// Hook để update shelf
export const useUpdateShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      shelfId,
      shelfName,
      description = null,
      displayOrder = null,
    }) =>
      bookshelfService.updateShelf({
        shelfId,
        shelfName,
        description,
        displayOrder,
      }), // ✅ Match exact service signature

    onSuccess: () => {
      // Invalidate shelves
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
    },

    onError: (error) => {
      console.error("Error updating shelf:", error);
    },
  });
};

// Hook để delete shelf
export const useDeleteShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shelfId) => bookshelfService.deleteShelf(shelfId), // ✅ Match exact service signature

    onSuccess: (data, shelfId) => {
      // Invalidate shelves và user books
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.BOOKS_BY_SHELF(shelfId),
      });
    },

    onError: (error) => {
      console.error("Error deleting shelf:", error);
    },
  });
};

// Hook để move book between shelves
export const useMoveBookToShelf = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, newShelfId }) =>
      bookshelfService.moveBookToShelf({ bookId, newShelfId }), // ✅ Match exact service signature

    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USER_BOOK(variables.bookId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKS_BY_SHELF(variables.newShelfId),
      });
    },

    onError: (error) => {
      console.error("Error moving book to shelf:", error);
    },
  });
};

// ==================== QUICK ACTION HOOKS ====================

// Hook để quick add book (sử dụng service utility function)
export const useQuickAddBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => bookshelfService.quickAddBook(bookId), // ✅ Match exact service function

    onSuccess: (data, bookId) => {
      // Same invalidation as addBookToLibrary
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.setQueryData(QUERY_KEYS.BOOK_IN_LIBRARY(bookId), {
        exists: true,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKS_BY_STATUS(1),
      }); // Want to Read = 1
    },

    onError: (error) => {
      console.error("Error quick adding book:", error);
    },
  });
};

// Hook để start reading (sử dụng service utility function)
export const useStartReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => bookshelfService.startReading(bookId), // ✅ Match exact service function

    onSuccess: (data, bookId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOK(bookId) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKS_BY_STATUS(2),
      }); // Currently Reading = 2
    },

    onError: (error) => {
      console.error("Error starting reading:", error);
    },
  });
};

// Hook để finish reading (sử dụng service utility function)
export const useFinishReading = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId) => bookshelfService.finishReading(bookId), // ✅ Match exact service function

    onSuccess: (data, bookId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOK(bookId) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOKS_BY_STATUS(3),
      }); // Read = 3
    },

    onError: (error) => {
      console.error("Error finishing reading:", error);
    },
  });
};

// ==================== MAIN BOOKSHELF HOOK ====================

// Main hook giống như useBookshelf cũ nhưng sử dụng React Query
export const useBookshelf = (filters = {}) => {
  const queryClient = useQueryClient();

  // Queries
  const myBooksQuery = useMyBooks(filters);
  const myShelvesQuery = useMyShelves();
  const readingStatusesQuery = useReadingStatuses();

  // Mutations
  const addBookMutation = useAddBookToLibrary();
  const updateStatusMutation = useUpdateBookStatus();
  const updateProgressMutation = useUpdateReadingProgress();
  const removeBookMutation = useRemoveBookFromLibrary();
  const createShelfMutation = useCreateShelf();
  const updateShelfMutation = useUpdateShelf();
  const deleteShelfMutation = useDeleteShelf();
  const moveBookMutation = useMoveBookToShelf();

  // Quick actions mutations
  const quickAddMutation = useQuickAddBook();
  const startReadingMutation = useStartReading();
  const finishReadingMutation = useFinishReading();

  // Quick action helpers với better error handling
  const quickAddBook = async (bookId) => {
    try {
      const result = await quickAddMutation.mutateAsync(bookId);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const startReading = async (bookId) => {
    try {
      const result = await startReadingMutation.mutateAsync(bookId);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const finishReading = async (bookId) => {
    try {
      const result = await finishReadingMutation.mutateAsync(bookId);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const addBookToLibrary = async (bookId, statusId = 1, shelfId = null) => {
    try {
      const result = await addBookMutation.mutateAsync({
        bookId,
        statusId,
        shelfId,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const updateBookStatus = async (bookId, newStatusId) => {
    try {
      const result = await updateStatusMutation.mutateAsync({
        bookId,
        newStatusId,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const updateReadingProgress = async (bookId, progressData) => {
    try {
      const result = await updateProgressMutation.mutateAsync({
        bookId,
        ...progressData,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const removeBookFromLibrary = async (bookId) => {
    try {
      await removeBookMutation.mutateAsync(bookId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const createShelf = async (shelfName, description = null) => {
    try {
      const result = await createShelfMutation.mutateAsync({
        shelfName,
        description,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const updateShelf = async (
    shelfId,
    shelfName,
    description = null,
    displayOrder = null
  ) => {
    try {
      const result = await updateShelfMutation.mutateAsync({
        shelfId,
        shelfName,
        description,
        displayOrder,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const deleteShelf = async (shelfId) => {
    try {
      await deleteShelfMutation.mutateAsync(shelfId);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const moveBookToShelf = async (bookId, newShelfId) => {
    try {
      const result = await moveBookMutation.mutateAsync({
        bookId,
        newShelfId,
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const checkBookInLibrary = async (bookId) => {
    try {
      const result = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.BOOK_IN_LIBRARY(bookId),
        queryFn: () => bookshelfService.checkBookInLibrary(bookId),
      });
      return result.exists;
    } catch (error) {
      console.error("Error checking book in library:", error);
      return false;
    }
  };

  // Refetch functions
  const fetchMyBooks = () => myBooksQuery.refetch();
  const fetchMyShelves = () => myShelvesQuery.refetch();

  // Combined loading và error states
  const isLoading =
    myBooksQuery.isLoading ||
    addBookMutation.isPending ||
    updateStatusMutation.isPending ||
    updateProgressMutation.isPending ||
    removeBookMutation.isPending ||
    createShelfMutation.isPending ||
    updateShelfMutation.isPending ||
    deleteShelfMutation.isPending ||
    moveBookMutation.isPending ||
    quickAddMutation.isPending ||
    startReadingMutation.isPending ||
    finishReadingMutation.isPending;

  const error =
    myBooksQuery.error ||
    myShelvesQuery.error ||
    readingStatusesQuery.error ||
    addBookMutation.error ||
    updateStatusMutation.error ||
    updateProgressMutation.error ||
    removeBookMutation.error ||
    createShelfMutation.error ||
    updateShelfMutation.error ||
    deleteShelfMutation.error ||
    moveBookMutation.error ||
    quickAddMutation.error ||
    startReadingMutation.error ||
    finishReadingMutation.error;

  return {
    // Data (giống như hook cũ)
    userBooks: myBooksQuery.data || [],
    shelves: myShelvesQuery.data || [],
    readingStatuses: readingStatusesQuery.data || [],
    loading: isLoading,
    error: error?.message || null,

    // Actions (giống như hook cũ)
    addBookToLibrary,
    updateBookStatus,
    updateReadingProgress,
    removeBookFromLibrary,
    checkBookInLibrary,
    createShelf,
    updateShelf, // ✅ New action
    deleteShelf,
    moveBookToShelf, // ✅ New action
    quickAddBook,
    startReading,
    finishReading,
    fetchMyBooks,
    fetchMyShelves,

    // Additional React Query specific
    queries: {
      myBooks: myBooksQuery,
      myShelves: myShelvesQuery,
      readingStatuses: readingStatusesQuery,
    },

    mutations: {
      addBook: addBookMutation,
      updateStatus: updateStatusMutation,
      updateProgress: updateProgressMutation,
      removeBook: removeBookMutation,
      createShelf: createShelfMutation,
      updateShelf: updateShelfMutation, // ✅ New mutation
      deleteShelf: deleteShelfMutation,
      moveBook: moveBookMutation, // ✅ New mutation
      quickAdd: quickAddMutation,
      startReading: startReadingMutation,
      finishReading: finishReadingMutation,
    },

    // Utilities
    clearError: () => {
      // React Query tự động clear error khi mutation success
      // Nhưng có thể manually reset nếu cần
      addBookMutation.reset();
      updateStatusMutation.reset();
      updateProgressMutation.reset();
      removeBookMutation.reset();
      createShelfMutation.reset();
      updateShelfMutation.reset();
      deleteShelfMutation.reset();
      moveBookMutation.reset();
      quickAddMutation.reset();
      startReadingMutation.reset();
      finishReadingMutation.reset();
    },
  };
};
