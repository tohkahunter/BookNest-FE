// src/app/pages/BookDetail/BookDetail.jsx - Updated with Real API
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../../../services/bookService";
import { getAuthorById } from "../../../services/authorService";
import { genreService } from "../../../services/genreService";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import "./styles/BookDetail.css";

function BookDetail() {
  const { id } = useParams();

  // State for interactive features
  const [userRating, setUserRating] = useState(0);
  const [readingStatus, setReadingStatus] = useState("want-to-read");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);

  // Fetch book data
  const {
    data: book,
    isLoading: isBookLoading,
    error: bookError,
  } = useQuery({
    queryKey: QUERY_KEYS.BOOK(id),
    queryFn: () => getBookById(id),
    enabled: !!id,
  });

  // Fetch author data
  const { data: author, isLoading: isAuthorLoading } = useQuery({
    queryKey: QUERY_KEYS.AUTHOR(book?.AuthorId),
    queryFn: () => getAuthorById(book?.AuthorId),
    enabled: !!book?.AuthorId,
  });

  // Fetch genre data
  const { data: genre, isLoading: isGenreLoading } = useQuery({
    queryKey: QUERY_KEYS.GENRE(book?.GenreId),
    queryFn: () => genreService.getGenreById(book?.GenreId),
    enabled: !!book?.GenreId,
  });

  const statusOptions = {
    "want-to-read": {
      label: "Want to Read",
      color: "bg-green-600 hover:bg-green-700",
    },
    "currently-reading": {
      label: "Currently Reading",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    read: { label: "Read", color: "bg-gray-600 hover:bg-gray-700" },
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    // TODO: Implement API call to save user rating
  };

  const handleFollowAuthor = () => {
    setIsFollowingAuthor(!isFollowingAuthor);
    // TODO: Implement API call to follow/unfollow author
  };

  const handleStatusChange = (newStatus) => {
    setReadingStatus(newStatus);
    // TODO: Implement API call to save reading status
  };

  // Loading state
  if (isBookLoading) {
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
  if (bookError) {
    return (
      <div className="min-h-screen bg-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Book Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The book you're looking for doesn't exist or has been removed.
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

  // Don't render if no book data
  if (!book) return null;

  const truncatedDescription =
    book.Description && book.Description.length > 300
      ? book.Description.slice(0, 300) + "..."
      : book.Description;

  const displayRating = book.AverageRating || 0;
  const displayReviewCount = book.ReviewCount || 0;

  return (
    <div className="min-h-screen bg-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 w-80">
              {/* Book Cover */}
              <div className="mb-6">
                <div className="w-full max-w-sm mx-auto sticky top-4">
                  <img
                    src={book.CoverImageUrl}
                    alt={book.Title}
                    className="w-full rounded-xl shadow-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = `
                        <div class="w-full h-96 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg flex items-center justify-center text-white text-center p-4">
                          <div>
                            <h3 class="text-3xl font-bold mb-2">${
                              book.Title
                            }</h3>
                            <p class="text-sm opacity-80">${
                              book.AuthorName || "Unknown Author"
                            }</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>

              {/* Reading Actions */}
              <div className="bg-white rounded-lg p-2 space-y-4 text-center flex flex-col items-center">
                {/* Status Dropdown */}
                <div className="relative w-[200px]">
                  <select
                    value={readingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className={`text-center w-full text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${statusOptions[readingStatus].color} appearance-none cursor-pointer`}
                  >
                    {Object.entries(statusOptions).map(([key, option]) => (
                      <option key={key} value={key} className="text-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Interactive Rating */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingClick(star)}
                        className={`text-2xl transition-all duration-200 hover:scale-110 transform ${
                          star <= userRating
                            ? "text-orange-400"
                            : "text-gray-300 hover:text-orange-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rate this book
                  </label>
                  {userRating > 0 && (
                    <p className="text-sm text-gray-600">
                      Your rating: {userRating}/5
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Book Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Info */}
            <div className="bg-white rounded-lg p-2">
              <h1 className="text-5xl text-gray-900 mb-2">{book.Title}</h1>
              <p className="text-gray-600 mb-4">
                by{" "}
                <Link
                  to={`/author/${book.AuthorId}`}
                  className="text-orange-600 text-2xl hover:text-orange-700 hover:underline font-medium"
                >
                  {book.AuthorName ||
                    (isAuthorLoading ? "Loading..." : "Unknown Author")}
                </Link>
              </p>

              {/* Rating Display */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-4xl ${
                        star <= Math.floor(displayRating)
                          ? "text-orange-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {displayRating.toFixed(2)}
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-600">
                  {displayReviewCount.toLocaleString()} ratings
                </span>
              </div>
            </div>

            {/* Description */}
            {book.Description && (
              <div className="bg-white rounded-lg p-2">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {showFullDescription
                    ? book.Description
                    : truncatedDescription}
                </p>
                {book.Description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-orange-600 hover:text-orange-700 font-medium hover:underline"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {/* Genre */}
            {genre && (
              <div className="bg-white rounded-lg p-2">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/genre/${genre.GenreId}`}
                    className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors duration-200"
                  >
                    {genre.GenreName}
                  </Link>
                </div>
                {genre.Description && (
                  <p className="text-gray-600 text-sm mt-2">
                    {genre.Description}
                  </p>
                )}
              </div>
            )}

            {/* Book Details */}
            <div className="bg-white rounded-lg p-2">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Book Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.PageCount && (
                  <div>
                    <span className="font-medium text-gray-600">Pages:</span>
                    <span className="ml-2 text-gray-900">{book.PageCount}</span>
                  </div>
                )}
                {book.PublicationYear && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Published:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {book.PublicationYear}
                    </span>
                  </div>
                )}
                {book.Isbn13 && (
                  <div>
                    <span className="font-medium text-gray-600">ISBN:</span>
                    <span className="ml-2 text-gray-900">{book.Isbn13}</span>
                  </div>
                )}
                {book.CreatedAt && (
                  <div>
                    <span className="font-medium text-gray-600">Added:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(book.CreatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* About the Author */}
            {!isAuthorLoading && author && (
              <div className="bg-white rounded-lg p-2">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  About the author
                </h3>

                <div className="flex items-start space-x-4 mb-6">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        author.Name
                      )}&background=f97316&color=ffffff&size=64`}
                      alt={author.Name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>

                  {/* Author Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {author.Name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{author.BookCount || 0} books</span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleFollowAuthor}
                      className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                        isFollowingAuthor
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {isFollowingAuthor ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>

                {/* Author Action Buttons */}
                <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to={`/author/${author.AuthorId}`}
                    className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                  >
                    View all books by {author.Name}
                  </Link>
                </div>
              </div>
            )}

            {/* Community Reviews */}
            <div className="bg-white rounded-lg p-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Community Reviews
                </h3>
                <button className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                  Write a Review
                </button>
              </div>

              {displayReviewCount > 0 ? (
                <div className="space-y-6">
                  {/* Sample review placeholder */}
                  <div className="text-center py-8 text-gray-500">
                    <p>No reviews available yet.</p>
                    <button className="mt-2 text-orange-600 hover:text-orange-700 font-medium hover:underline">
                      Be the first to review this book
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews available yet.</p>
                  <button className="mt-2 text-orange-600 hover:text-orange-700 font-medium hover:underline">
                    Be the first to review this book
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
