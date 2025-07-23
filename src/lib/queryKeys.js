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

  // Genres
  GENRES: ["genres"],
  GENRE: (id) => ["genre", id],

  // Authors
  AUTHORS: ["authors"],
  AUTHOR: (id) => ["author", id],
  AUTHORS_WITH_BOOKS: ["authors", "with-books"],
  AUTHORS_POPULAR: (limit) => ["authors", "popular", limit],
  AUTHORS_SEARCH: (searchTerm) => ["authors", "search", searchTerm],

  // Bookshelf - User specific data
  USER_BOOKS: ["user-books"],
  USER_BOOK: (bookId) => ["user-book", bookId],
  USER_SHELVES: ["user-shelves"],
  BOOKS_BY_STATUS: (statusId) => ["books", "status", statusId],
  BOOKS_BY_SHELF: (shelfId) => ["books", "shelf", shelfId],
  READING_STATUS: ["reading-status"],
  BOOK_IN_LIBRARY: (bookId) => ["book-in-library", bookId],

  // Reviews

  // Reviews
  REVIEWS: ["reviews"],
  BOOK_REVIEWS: (bookId) => ["reviews", "book", bookId],
  REVIEW: (reviewId) => ["review", reviewId],
  MY_REVIEW: (bookId) => ["my-review", bookId],
  USER_REVIEWS: (userId) => ["reviews", "user", userId],
  MY_REVIEWS: ["my-reviews"],
  RECENT_REVIEWS: (count) => ["reviews", "recent", count],
  CAN_REVIEW: (bookId) => ["can-review", bookId],

  // Comments
  COMMENTS: ["comments"],
  REVIEW_COMMENTS: (reviewId) => ["comments", "review", reviewId],
  COMMENT: (commentId) => ["comment", commentId],

  USER_PROFILE: (userId) => ["user-profile", userId], // Support specific user ID
  USER_STATS: (userId) => ["user-stats", userId], // Support specific user ID - FIXED to function

  // ✅ Additional profile-related keys
  MY_PROFILE: ["my-profile"], // Current user's profile
  USER_AVATAR: (userId) => ["user-avatar", userId],
};
