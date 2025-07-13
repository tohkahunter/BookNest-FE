// src/hooks/queries/useAuthors.js
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import * as authorService from "../../services/authorService";

// Hook chính để lấy tất cả tác giả
export const useAuthors = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTHORS,
    queryFn: authorService.getAllAuthors, // ✅ Match exact service function
    staleTime: 10 * 60 * 1000, // 10 phút - tác giả ít thay đổi
    cacheTime: 15 * 60 * 1000, // 15 phút
    ...options,
  });
};

// Hook để lấy tác giả với số lượng sách (placeholder bookCount = 0)
export const useAuthorsWithBookCounts = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTHORS_WITH_BOOKS,
    queryFn: authorService.getAuthorsWithBookCounts, // ✅ Match exact service function
    staleTime: 10 * 60 * 1000, // 10 phút
    cacheTime: 15 * 60 * 1000, // 15 phút
    ...options,
  });
};

// Hook để lấy tác giả phổ biến
export const usePopularAuthors = (limit = 10, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTHORS_POPULAR(limit),
    queryFn: () => authorService.getPopularAuthors(limit), // ✅ Pass limit parameter
    staleTime: 15 * 60 * 1000, // 15 phút - data ít thay đổi
    cacheTime: 20 * 60 * 1000, // 20 phút
    ...options,
  });
};

// Hook để search tác giả (client-side filtering trong service)
export const useSearchAuthors = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTHORS_SEARCH(searchTerm),
    queryFn: () => authorService.searchAuthors(searchTerm), // ✅ Pass searchTerm
    enabled: !!searchTerm && searchTerm.length > 0, // ✅ Enable khi có searchTerm (không cần >= 2 vì service handle empty)
    staleTime: 2 * 60 * 1000, // 2 phút - search results thay đổi nhanh
    ...options,
  });
};

// Hook để lấy 1 tác giả theo ID
export const useAuthor = (authorId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTHOR(authorId),
    queryFn: () => authorService.getAuthorById(authorId), // ✅ Pass authorId parameter
    enabled: !!authorId, // Chỉ chạy khi có authorId
    staleTime: 10 * 60 * 1000, // 10 phút
    cacheTime: 15 * 60 * 1000, // 15 phút
    ...options,
  });
};

// Hook để lấy sách của một tác giả
export const useAuthorBooks = (authorId, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_AUTHOR(authorId),
    queryFn: () => authorService.getBooksByAuthor(authorId), // ✅ Pass authorId parameter
    enabled: !!authorId,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
    ...options,
  });
};
