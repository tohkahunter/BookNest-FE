// src/app/pages/BookRecent/BookRecent.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRecentBooks } from "../../../services/bookService";
import { QUERY_KEYS } from "../../../lib/queryKeys";

function BookRecent() {
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch recent books
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.BOOKS_RECENT(limit),
    queryFn: () => getRecentBooks(limit),
  });

  // Sort books based on selected option
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.CreatedAt) - new Date(a.CreatedAt);
      case "oldest":
        return new Date(a.CreatedAt) - new Date(b.CreatedAt);
      case "title":
        return (a.Title || "").localeCompare(b.Title || "");
      case "author":
        return (a.AuthorName || "").localeCompare(b.AuthorName || "");
      case "publication-year":
        return (b.PublicationYear || 0) - (a.PublicationYear || 0);
      case "pages":
        return (b.PageCount || 0) - (a.PageCount || 0);
      default:
        return 0;
    }
  });

  // Calculate stats
  const stats = {
    totalBooks: books.length,
    totalPages: books.reduce((sum, book) => sum + (book.PageCount || 0), 0),
    averagePages:
      books.length > 0
        ? Math.round(
            books.reduce((sum, book) => sum + (book.PageCount || 0), 0) /
              books.length
          )
        : 0,
    uniqueGenres: [
      ...new Set(books.map((book) => book.GenreName).filter(Boolean)),
    ].length,
    thisWeek: books.filter((book) => {
      const createdDate = new Date(book.CreatedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length,
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  // Get freshness badge
  const getFreshnessBadge = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return { label: "Just Added", color: "bg-green-500" };
    if (diffDays <= 3) return { label: "New", color: "bg-blue-500" };
    if (diffDays <= 7) return { label: "Fresh", color: "bg-purple-500" };
    return { label: "Recent", color: "bg-gray-500" };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Error Loading Recent Books
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading recent books. Please try again
          later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ Recently Added Books
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Explore our newest additions to the library. Fresh titles are being
            added regularly to keep your reading list exciting and up-to-date.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalBooks}
            </div>
            <div className="text-sm text-gray-600">Recent Books</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.thisWeek}
            </div>
            <div className="text-sm text-gray-600">Added This Week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.uniqueGenres}
            </div>
            <div className="text-sm text-gray-600">Different Genres</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.averagePages}
            </div>
            <div className="text-sm text-gray-600">Avg Pages</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publication-year">Publication Year</option>
              <option value="pages">Page Count</option>
            </select>
          </div>

          {/* Limit Options */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Show:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className=" text-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value={10}>10 books</option>
              <option value={20}>20 books</option>
              <option value={50}>50 books</option>
              <option value={100}>100 books</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBooks.map((book) => {
          const freshnessBadge = getFreshnessBadge(book.CreatedAt);

          return (
            <Link
              key={book.BookId}
              to={`/books/${book.BookId}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1"
            >
              {/* Book Cover */}
              <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                {/* Freshness Badge */}
                <div className="absolute top-2 right-2 z-10">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${freshnessBadge.color}`}
                  >
                    {freshnessBadge.label}
                  </div>
                </div>

                {/* Added Date */}
                <div className="absolute bottom-2 left-2 z-10">
                  <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                    {formatDate(book.CreatedAt)}
                  </div>
                </div>

                <img
                  src={book.CoverImageUrl}
                  alt={book.Title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="240" height="320" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="#f97316"/>
                        <text x="50%" y="35%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16" font-family="Arial, sans-serif">
                          ${book.Title}
                        </text>
                        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="12" font-family="Arial, sans-serif" opacity="0.8">
                          ${book.AuthorName}
                        </text>
                        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif" opacity="0.6">
                          ✨
                        </text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2 mb-2">
                  {book.Title}
                </h3>

                {book.AuthorName && (
                  <p className="text-sm text-orange-600 font-medium mb-2">
                    by {book.AuthorName}
                  </p>
                )}

                {book.GenreName && (
                  <p className="text-xs text-gray-500 mb-2">{book.GenreName}</p>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-600">
                    {book.PublicationYear && (
                      <span>{book.PublicationYear}</span>
                    )}
                    {book.PageCount && book.PublicationYear && <span> • </span>}
                    {book.PageCount && <span>{book.PageCount} pages</span>}
                  </div>

                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-gray-700">
                      New
                    </span>
                  </div>
                </div>

                {book.Description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {book.Description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {books.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Recent Books
          </h3>
          <p className="text-gray-500">
            Recent books will appear here as they are added to the library.
          </p>
        </div>
      )}

      {/* Recent Activity Timeline */}
      {books.length > 0 && (
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-3">
            {sortedBooks.slice(0, 5).map((book) => (
              <div
                key={book.BookId}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  <img
                    src={book.CoverImageUrl}
                    alt={book.Title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="48" height="64" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f97316"/>
                          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif">
                            📖
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/books/${book.BookId}`}
                    className="font-medium text-gray-900 hover:text-orange-600 transition-colors truncate block"
                  >
                    {book.Title}
                  </Link>
                  <p className="text-sm text-gray-600">
                    by {book.AuthorName} • {book.GenreName}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm text-gray-500">
                    {formatDate(book.CreatedAt)}
                  </p>
                  <div
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${
                      getFreshnessBadge(book.CreatedAt).color
                    }`}
                  >
                    {getFreshnessBadge(book.CreatedAt).label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default BookRecent;
