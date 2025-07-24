// src/app/pages/GenreDetail/GenreDetail.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { genreService } from "../../../services/genreService";
import { getBooksByGenre } from "../../../services/bookService";
import { QUERY_KEYS } from "../../../lib/queryKeys";

function GenreDetail() {
  const { id } = useParams();

  // State for interactive features
  const [isFollowing, setIsFollowing] = useState(false);
  const [sortBy, setSortBy] = useState("publication-year");

  // Fetch genre data
  const {
    data: genre,
    isLoading: isGenreLoading,
    error: genreError,
  } = useQuery({
    queryKey: QUERY_KEYS.GENRE(id),
    queryFn: () => genreService.getGenreById(id),
    enabled: !!id,
  });

  // Fetch books in this genre
  const { data: books = [], isLoading: isBooksLoading } = useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_GENRE(id),
    queryFn: () => getBooksByGenre(Number(id)),
    enabled: !!id,
  });

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement API call to follow/unfollow genre
  };

  // Sort books based on selected option
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "publication-year":
        return (b.PublicationYear || 0) - (a.PublicationYear || 0);
      case "title":
        return (a.Title || "").localeCompare(b.Title || "");
      case "pages":
        return (b.PageCount || 0) - (a.PageCount || 0);
      case "author":
        return (a.AuthorName || "").localeCompare(b.AuthorName || "");
      default:
        return 0;
    }
  });

  // Calculate genre stats
  const genreStats = {
    totalBooks: books.length,
    totalPages: books.reduce((sum, book) => sum + (book.PageCount || 0), 0),
    averagePages:
      books.length > 0
        ? Math.round(
            books.reduce((sum, book) => sum + (book.PageCount || 0), 0) /
              books.length
          )
        : 0,
    publicationSpan:
      books.length > 0
        ? {
            earliest: Math.min(
              ...books.map(
                (book) => book.PublicationYear || new Date().getFullYear()
              )
            ),
            latest: Math.max(
              ...books.map(
                (book) => book.PublicationYear || new Date().getFullYear()
              )
            ),
          }
        : null,
    uniqueAuthors: [
      ...new Set(books.map((book) => book.AuthorName).filter(Boolean)),
    ].length,
  };

  // Get genre icon based on genre name
  const getGenreIcon = (genreName) => {
    const iconMap = {
      Fantasy: "🧙‍♂️",
      "Science Fiction": "🚀",
      Mystery: "🔍",
      Romance: "💖",
      Horror: "👻",
      Biography: "👤",
      History: "📜",
      "Self-Help": "💪",
      Business: "💼",
      Technology: "💻",
      Health: "🏥",
      Fiction: "📚",
      "Non-Fiction": "📖",
    };
    return iconMap[genreName] || "📘";
  };

  // Loading state
  if (isGenreLoading) {
    return (
      <>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </>
    );
  }

  // Error state
  if (genreError) {
    return (
      <>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Genre Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The genre you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </>
    );
  }

  if (!genre) return null;

  return (
    <>
      {/* Genre Header */}
      <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
        <div className="flex items-start space-x-6">
          {/* Genre Icon */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
              {getGenreIcon(genre.GenreName)}
            </div>
          </div>

          {/* Genre Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {genre.GenreName}
              </h1>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                {genreStats.totalBooks} books
              </span>
            </div>

            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {genre.Description}
            </p>

            {/* Genre Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-orange-600">
                  {genreStats.totalBooks}
                </div>
                <div className="text-sm text-gray-600">Total Books</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-orange-600">
                  {genreStats.uniqueAuthors}
                </div>
                <div className="text-sm text-gray-600">Authors</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-orange-600">
                  {genreStats.averagePages}
                </div>
                <div className="text-sm text-gray-600">Avg Pages</div>
              </div>
              {genreStats.publicationSpan && (
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-orange-600">
                    {genreStats.publicationSpan.earliest}-
                    {genreStats.publicationSpan.latest}
                  </div>
                  <div className="text-sm text-gray-600">Publication Years</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFollow}
                className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  isFollowing
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {isFollowing ? "Following Genre" : "Follow Genre"}
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Explore Similar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {genre.GenreName} Books ({genreStats.totalBooks})
          </h2>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="publication-year">Publication Year</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="pages">Page Count</option>
            </select>
          </div>
        </div>

        {isBooksLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{getGenreIcon(genre.GenreName)}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No books in this genre yet
            </h3>
            <p className="text-gray-500">
              Be the first to add a {genre.GenreName.toLowerCase()} book to our
              collection!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedBooks.map((book) => (
              <Link
                key={book.BookId}
                to={`/books/${book.BookId}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                {/* Book Cover */}
                <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
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
                            ${book.AuthorName || "Unknown Author"}
                          </text>
                          <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-family="Arial, sans-serif" opacity="0.6">
                            ${getGenreIcon(genre.GenreName)}
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

                  <div className="space-y-1">
                    {book.PublicationYear && (
                      <p className="text-xs text-gray-600">
                        Published: {book.PublicationYear}
                      </p>
                    )}
                    {book.PageCount && (
                      <p className="text-xs text-gray-600">
                        {book.PageCount} pages
                      </p>
                    )}
                  </div>

                  {book.Description && (
                    <p className="mt-2 text-xs text-gray-600 line-clamp-3">
                      {book.Description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Genre Insights */}
      {books.length > 0 && (
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            {genre.GenreName} Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Popular Authors in this Genre */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Popular Authors
              </h4>
              <div className="space-y-2">
                {[
                  ...new Set(
                    books.map((book) => book.AuthorName).filter(Boolean)
                  ),
                ]
                  .slice(0, 5)
                  .map((authorName, index) => {
                    const authorBookCount = books.filter(
                      (book) => book.AuthorName === authorName
                    ).length;
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-700">
                          {authorName}
                        </span>
                        <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {authorBookCount} book
                          {authorBookCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Publication Timeline */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Recent Publications
              </h4>
              <div className="space-y-2">
                {sortedBooks.slice(0, 5).map((book) => (
                  <div
                    key={book.BookId}
                    className="flex items-center space-x-3"
                  >
                    <span className="text-xs font-medium text-orange-600 w-12">
                      {book.PublicationYear || "N/A"}
                    </span>
                    <Link
                      to={`/books/${book.BookId}`}
                      className="text-xs text-gray-700 hover:text-orange-600 hover:underline truncate"
                    >
                      {book.Title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Page Count Distribution */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Page Count Stats
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Shortest:</span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.min(
                      ...books
                        .map((book) => book.PageCount || 0)
                        .filter((pages) => pages > 0)
                    ) || "N/A"}{" "}
                    pages
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Longest:</span>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.max(...books.map((book) => book.PageCount || 0)) ||
                      "N/A"}{" "}
                    pages
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average:</span>
                  <span className="text-sm font-medium text-gray-700">
                    {genreStats.averagePages} pages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GenreDetail;
