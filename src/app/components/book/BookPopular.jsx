// src/app/pages/BookPopular/BookPopular.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPopularBooks } from "../../../services/bookService";
import { QUERY_KEYS } from "../../../lib/queryKeys";

function BookPopular() {
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState("popularity");

  // Fetch popular books
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.BOOKS_POPULAR(limit),
    queryFn: () => getPopularBooks(limit),
  });

  // Sort books based on selected option
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return (b.UserBookCount || 0) - (a.UserBookCount || 0);
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
    totalReaders: books.reduce(
      (sum, book) => sum + (book.UserBookCount || 0),
      0
    ),
    averageReaders:
      books.length > 0
        ? Math.round(
            books.reduce((sum, book) => sum + (book.UserBookCount || 0), 0) /
              books.length
          )
        : 0,
    topGenres: [
      ...new Set(books.map((book) => book.GenreName).filter(Boolean)),
    ].slice(0, 3),
  };

  // Get popularity badge color
  const getPopularityBadge = (userBookCount) => {
    if (userBookCount >= 3) return "bg-red-500 text-white";
    if (userBookCount >= 2) return "bg-orange-500 text-white";
    if (userBookCount >= 1) return "bg-yellow-500 text-white";
    return "bg-gray-500 text-white";
  };

  // Get popularity label
  const getPopularityLabel = (userBookCount) => {
    if (userBookCount >= 3) return "Trending";
    if (userBookCount >= 2) return "Popular";
    if (userBookCount >= 1) return "Rising";
    return "New";
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
          Error Loading Popular Books
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading popular books. Please try again
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
            🔥 Popular Books
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Discover the most loved books by our community. These trending
            titles are being read and added to libraries by readers just like
            you.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalBooks}
            </div>
            <div className="text-sm text-gray-600">Popular Books</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalReaders}
            </div>
            <div className="text-sm text-gray-600">Total Readers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.averageReaders}
            </div>
            <div className="text-sm text-gray-600">Avg Readers/Book</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {stats.topGenres.length}
            </div>
            <div className="text-sm text-gray-600">Top Genres</div>
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
              <option value="popularity">Popularity</option>
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

      {/* Popular Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedBooks.map((book, index) => (
          <Link
            key={book.BookId}
            to={`/books/${book.BookId}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1"
          >
            {/* Book Cover */}
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
              {/* Ranking Badge */}
              {index < 3 && (
                <div className="absolute top-2 left-2 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : "bg-amber-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
              )}

              {/* Popularity Badge */}
              <div className="absolute top-2 right-2 z-10">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPopularityBadge(
                    book.UserBookCount
                  )}`}
                >
                  {getPopularityLabel(book.UserBookCount)}
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
                        🔥
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

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  {book.PublicationYear && <span>{book.PublicationYear}</span>}
                  {book.PageCount && book.PublicationYear && <span> • </span>}
                  {book.PageCount && <span>{book.PageCount} pages</span>}
                </div>

                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">
                    {book.UserBookCount || 0} readers
                  </span>
                </div>
              </div>

              {book.Description && (
                <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                  {book.Description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {books.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Popular Books Yet
          </h3>
          <p className="text-gray-500">
            Popular books will appear here as readers add them to their
            libraries.
          </p>
        </div>
      )}

      {/* Top Genres Section */}
      {stats.topGenres.length > 0 && (
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Most Popular Genres
          </h2>
          <div className="flex flex-wrap gap-2">
            {stats.topGenres.map((genre, index) => (
              <Link
                key={genre}
                to={`/genres/${genre}`}
                className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
              >
                {genre}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default BookPopular;
