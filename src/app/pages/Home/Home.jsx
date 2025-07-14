import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useBooks, useAuthors, useGenres, useAuth } from "../../hooks/index";
import { useGenreStats } from "../../hooks/useGenres";

// Fallback image component
const BookCover = ({ src, alt, className }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center`}
      >
        <div className="text-center">
          <svg
            className="w-6 h-6 text-gray-400 mx-auto mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span className="text-xs text-gray-500">No Cover</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

// Quick Genre Browser Component
const QuickGenreBrowser = ({ genres }) => {
  const featuredGenres = useMemo(
    () =>
      genres
        .sort((a, b) => (b.BookCount || 0) - (a.BookCount || 0))
        .slice(0, 8),
    [genres]
  );

  const gradients = [
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
    "from-yellow-400 to-yellow-600",
    "from-red-400 to-red-600",
    "from-indigo-400 to-indigo-600",
    "from-teal-400 to-teal-600",
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {featuredGenres.map((genre, index) => {
        const gradient = gradients[index % gradients.length];
        return (
          <Link
            key={genre.GenreId}
            to={`/search?genre=${genre.GenreId}&q=${encodeURIComponent(
              genre.GenreName
            )}&qid=${Math.random().toString(36).substr(2, 10)}`}
            className={`group cursor-pointer bg-gradient-to-br ${gradient} rounded-lg p-4 text-white hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2 group-hover:text-opacity-90">
                {genre.GenreName}
              </h3>
              <div className="flex items-center justify-center text-sm text-white text-opacity-90">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {genre.BookCount || 0} books
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  // Data fetching
  const {
    data: books = [],
    isLoading: booksLoading,
    error: booksError,
  } = useBooks();
  const {
    data: authors = [],
    isLoading: authorsLoading,
    error: authorsError,
  } = useAuthors();
  const {
    data: genres = [],
    isLoading: genresLoading,
    error: genresError,
  } = useGenres();

  // Genre stats
  const genreStats = useGenreStats();

  // Derived data
  const featuredBooks = useMemo(() => books.slice(0, 6), [books]);
  const recentBooks = useMemo(() => books.slice(-8), [books]);
  const popularAuthors = useMemo(() => authors.slice(0, 6), [authors]);

  // Combined states
  const isLoading = booksLoading || authorsLoading || genresLoading;
  const error = booksError || authorsError || genresError;

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-sm border border-orange-200">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || "Unable to load data"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover your next great read
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Track books you've read, find new ones, and connect with fellow
              book lovers
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/search"
                className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg"
              >
                🔍 Start Exploring Books
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors"
                >
                  Join BookNest Free
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {books.length.toLocaleString()}
                </div>
                <div className="text-orange-200">Books</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {authors.length.toLocaleString()}
                </div>
                <div className="text-orange-200">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {genres.length}
                </div>
                <div className="text-orange-200">Genres</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {genreStats.totalBooks?.toLocaleString() || "0"}
                </div>
                <div className="text-orange-200">Total Books</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        {isAuthenticated && (
          <section className="bg-white rounded-xl shadow-sm border border-orange-200 p-8 mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome back, {user?.username || user?.Username}! 👋
                </h2>
                <p className="text-gray-600 text-lg">
                  Ready to discover your next favorite book?
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/my-books"
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-md"
                >
                  📚 My Library
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Popular Books */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-8 bg-orange-500 rounded mr-4"></span>
                Popular This Week
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Books our community is loving right now
              </p>
            </div>
            <Link
              to="/books"
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline text-lg"
            >
              See all →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-8">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 w-full h-48 rounded mb-3"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {featuredBooks.map((book) => (
                  <Link
                    key={book.BookId}
                    to={`/book/${book.BookId}`}
                    className="group cursor-pointer"
                  >
                    <div className="mb-3">
                      <BookCover
                        src={book.CoverImageUrl}
                        alt={book.Title}
                        className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                      />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {book.Title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      by{" "}
                      {authors.find((a) => a.AuthorId === book.AuthorId)
                        ?.Name || "Unknown Author"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {genres.find((g) => g.GenreId === book.GenreId)
                        ?.GenreName || "Unknown Genre"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recently Added */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-8 bg-green-500 rounded mr-4"></span>
                Recently Added
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Fresh books just added to our library
              </p>
            </div>
            <Link
              to="/books?sort=recent"
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline text-lg"
            >
              See all →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-200">
            {isLoading ? (
              <div className="p-8 space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 animate-pulse"
                  >
                    <div className="bg-gray-200 w-20 h-28 rounded"></div>
                    <div className="flex-1 space-y-3">
                      <div className="bg-gray-200 h-5 rounded"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                      <div className="bg-gray-200 h-3 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentBooks.slice(0, 6).map((book) => (
                  <Link
                    key={book.BookId}
                    to={`/book/${book.BookId}`}
                    className="block p-8 hover:bg-orange-25 transition-colors group"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <BookCover
                          src={book.CoverImageUrl}
                          alt={book.Title}
                          className="w-20 h-28 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                          {book.Title}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          by{" "}
                          {authors.find((a) => a.AuthorId === book.AuthorId)
                            ?.Name || "Unknown Author"}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <Link
                            to={`/search?genre=${
                              book.GenreId
                            }&q=${encodeURIComponent(
                              genres.find((g) => g.GenreId === book.GenreId)
                                ?.GenreName || ""
                            )}&qid=${Math.random().toString(36).substr(2, 10)}`}
                            className="hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            📖{" "}
                            {genres.find((g) => g.GenreId === book.GenreId)
                              ?.GenreName || `Genre ${book.GenreId}`}
                          </Link>
                          {book.Isbn13 && <span>📚 ISBN: {book.Isbn13}</span>}
                          <span>🗓️ Recently added</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-md"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle want to read action
                          }}
                        >
                          📖 Want to Read
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Popular Authors */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-8 bg-purple-500 rounded mr-4"></span>
                Popular Authors
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Authors you might want to follow
              </p>
            </div>
            <Link
              to="/authors"
              className="text-orange-600 hover:text-orange-700 font-medium hover:underline text-lg"
            >
              See all →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center space-x-4 p-6"
                  >
                    <div className="bg-gray-200 w-16 h-16 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="bg-gray-200 h-5 rounded"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : popularAuthors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularAuthors.map((author) => (
                  <Link
                    key={author.AuthorId}
                    to={`/author/${author.AuthorId}`}
                    className="group flex items-center space-x-6 p-6 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {author.Name ? author.Name.charAt(0) : "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                        {author.Name || "Unknown Author"}
                      </h3>
                      <p className="text-gray-600">Author</p>
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No authors available</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        {!isAuthenticated && (
          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Join BookNest Today</h2>
            <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
              Discover, track, and share the books you love with our community
              of book enthusiasts
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="bg-white text-orange-600 px-10 py-4 rounded-lg font-bold text-xl hover:bg-orange-50 transition-colors shadow-lg"
              >
                📚 Sign Up for Free
              </Link>
              <Link
                to="/search"
                className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-xl hover:bg-white hover:text-orange-600 transition-colors"
              >
                🔍 Explore Library
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
