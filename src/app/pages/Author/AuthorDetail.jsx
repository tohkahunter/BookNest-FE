// src/app/pages/AuthorDetail/AuthorDetail.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import {
  getAuthorById,
  getBooksByAuthor,
} from "../../../services/authorService";
import { QUERY_KEYS } from "../../../lib/queryKeys";

function AuthorDetail() {
  const { id } = useParams();

  // State for interactive features
  const [isFollowing, setIsFollowing] = useState(false);
  const [sortBy, setSortBy] = useState("publication-year");

  // Fetch author data
  const {
    data: author,
    isLoading: isAuthorLoading,
    error: authorError,
  } = useQuery({
    queryKey: QUERY_KEYS.AUTHOR(id),
    queryFn: () => getAuthorById(id),
    enabled: !!id,
  });

  // Fetch author's books
  const { data: books = [], isLoading: isBooksLoading } = useQuery({
    queryKey: QUERY_KEYS.BOOKS_BY_AUTHOR(id),
    queryFn: () => getBooksByAuthor(id),
    enabled: !!id,
  });

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement API call to follow/unfollow author
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
      default:
        return 0;
    }
  });

  // Calculate author stats
  const authorStats = {
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
  };

  // Loading state
  if (isAuthorLoading) {
    return (
      <div className="min-h-screen bg-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (authorError) {
    return (
      <div className="min-h-screen bg-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Author Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The author you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!author) return null;

  return (
    <div className="min-h-screen bg-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Author Header */}
        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="flex items-start space-x-6">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  author.Name
                )}&background=f97316&color=ffffff&size=120`}
                alt={author.Name}
                className="w-30 h-30 rounded-full object-cover shadow-lg"
              />
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  {author.Name}
                </h1>
                <svg
                  className="w-6 h-6 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Author Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-orange-600">
                    {authorStats.totalBooks}
                  </div>
                  <div className="text-sm text-gray-600">Books Published</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-orange-600">
                    {authorStats.totalPages.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Pages</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-orange-600">
                    {authorStats.averagePages}
                  </div>
                  <div className="text-sm text-gray-600">Avg Pages/Book</div>
                </div>
                {authorStats.publicationSpan && (
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-orange-600">
                      {authorStats.publicationSpan.earliest}-
                      {authorStats.publicationSpan.latest}
                    </div>
                    <div className="text-sm text-gray-600">
                      Publication Years
                    </div>
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
                  {isFollowing ? "Following" : "Follow Author"}
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Books by {author.Name} ({authorStats.totalBooks})
            </h2>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className=" text-gray-700 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="publication-year">Publication Year</option>
                <option value="title">Title</option>
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
              <p className="text-gray-500 text-lg">
                No books found for this author.
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
                            <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16" font-family="Arial, sans-serif">
                              ${book.Title}
                            </text>
                            <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="12" font-family="Arial, sans-serif" opacity="0.8">
                              ${author.Name}
                            </text>
                          </svg>
                        `)}`;
                      }}
                    />
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                      {book.Title}
                    </h3>

                    <div className="mt-2 space-y-1">
                      {book.PublicationYear && (
                        <p className="text-sm text-gray-600">
                          Published: {book.PublicationYear}
                        </p>
                      )}
                      {book.PageCount && (
                        <p className="text-sm text-gray-600">
                          {book.PageCount} pages
                        </p>
                      )}
                    </div>

                    {book.Description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {book.Description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            About {author.Name}
          </h3>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              {author.Name} is a published author with {authorStats.totalBooks}{" "}
              book{authorStats.totalBooks !== 1 ? "s" : ""}
              {authorStats.publicationSpan &&
                ` spanning from ${authorStats.publicationSpan.earliest} to ${authorStats.publicationSpan.latest}`}
              .
              {authorStats.totalPages > 0 &&
                ` Their works total ${authorStats.totalPages.toLocaleString()} pages.`}
            </p>

            {/* Timeline */}
            {books.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Publication Timeline
                </h4>
                <div className="space-y-2">
                  {sortedBooks.slice(0, 5).map((book) => (
                    <div
                      key={book.BookId}
                      className="flex items-center space-x-3"
                    >
                      <span className="text-sm font-medium text-orange-600 w-16">
                        {book.PublicationYear || "N/A"}
                      </span>
                      <Link
                        to={`/books/${book.BookId}`}
                        className="text-sm text-gray-700 hover:text-orange-600 hover:underline"
                      >
                        {book.Title}
                      </Link>
                    </div>
                  ))}
                  {books.length > 5 && (
                    <p className="text-sm text-gray-500 italic">
                      And {books.length - 5} more books...
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorDetail;
