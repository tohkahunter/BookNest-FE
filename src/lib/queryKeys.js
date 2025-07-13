// src/lib/queryKeys.js
// Centralized query keys để dễ quản lý và tránh typo

export const QUERY_KEYS = {
  // Books
  BOOKS: ["books"],
  BOOK: (id) => ["book", id],
  BOOKS_BY_AUTHOR: (authorId) => ["books", "author", authorId],
  BOOKS_BY_GENRE: (genreId) => ["books", "genre", genreId],
  BOOKS_SEARCH: (searchTerm) => ["books", "search", searchTerm],
  BOOKS_POPULAR: (limit) => ["books", "popular", limit],
  BOOKS_RECENT: (limit) => ["books", "recent", limit],

  //genre
  GENRES: ["genres"],

  // Authors
  AUTHORS: ["authors"],
  AUTHOR: (id) => ["author", id],
  AUTHORS_WITH_BOOKS: ["authors", "with-books"],
  AUTHORS_POPULAR: (limit) => ["authors", "popular", limit],
  AUTHORS_SEARCH: (searchTerm) => ["authors", "search", searchTerm],

  // Bookshelf - User specific data
  USER_BOOKS: ["user-books"],
  USER_BOOK: (bookId) => ["user-book", bookId], // ✅ Thiếu key này
  USER_SHELVES: ["user-shelves"],
  BOOKS_BY_STATUS: (statusId) => ["books", "status", statusId], // ✅ Thiếu key này
  BOOKS_BY_SHELF: (shelfId) => ["books", "shelf", shelfId], // ✅ Thiếu key này
  READING_STATUS: ["reading-status"],
  BOOK_IN_LIBRARY: (bookId) => ["book-in-library", bookId],

  // Auth & User data
  USER_PROFILE: ["user-profile"],
  USER_STATS: ["user-stats"],

  // Additional user-related queries
  USER_REVIEWS: ["user-reviews"],
  USER_ACTIVITY: ["user-activity"],
};
