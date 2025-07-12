// src/hooks/queries/useBooks.js
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import * as bookService from "../../services/bookService";

// Hook chính để lấy tất cả sách
export const useBooks = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS,
    queryFn: bookService.getAllBooks,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
    ...options,
  });
};

// Hook để lấy sách phổ biến
export const usePopularBooks = (limit = 10, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_POPULAR(limit),
    queryFn: () => bookService.getPopularBooks(limit),
    staleTime: 15 * 60 * 1000, // 15 phút
    ...options,
  });
};

// Hook để lấy sách mới
export const useRecentBooks = (limit = 10, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_RECENT(limit),
    queryFn: () => bookService.getRecentBooks(limit),
    staleTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

// 🔧 FIXED: Hook để search sách
export const useSearchBooks = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_SEARCH(searchTerm),
    queryFn: () => bookService.searchBooks(searchTerm), // ✅ Use bookService.searchBooks
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 phút
    cacheTime: 5 * 60 * 1000, // 5 phút
    ...options,
  });
};

// Hook để search sách với thông tin tác giả
export const useSearchBooksWithAuthors = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BOOKS_SEARCH(searchTerm), "with-authors"],
    queryFn: () => bookService.searchBooksWithAuthors(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy sách theo genre
export const useBooksByGenre = (genreId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_GENRE(genreId),
    queryFn: () => bookService.getBooksByGenre(genreId),
    enabled: !!genreId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy sách theo author
export const useBooksByAuthor = (authorId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_AUTHOR(authorId),
    queryFn: () => bookService.getBooksByAuthor(authorId),
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy 1 cuốn sách
export const useBook = (bookId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOK(bookId),
    queryFn: () => bookService.getBookById(bookId),
    enabled: !!bookId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// Hook để lấy books với details
export const useBooksWithDetails = (options = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BOOKS, "with-details"],
    queryFn: bookService.getBooksWithDetails,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};
