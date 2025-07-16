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
      {/* Modern Animated Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100 ">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-200 opacity-20 rounded-full animate-pulse"></div>
          <div
            className="absolute top-20 right-20 w-60 h-60 bg-amber-200 opacity-30 rounded-full animate-bounce"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute bottom-20 left-20 w-40 h-40 bg-amber-200 opacity-40 rounded-full animate-ping"
            style={{ animationDuration: "2s" }}
          ></div>

          {/* Real Book Images with Modern Animations */}
          <div className="absolute top-16 left-12 transform rotate-12 animate-book-float-1">
            <img
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=150&fit=crop"
              alt="Book"
              className="w-16 h-24 rounded shadow-2xl opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-110 hover:rotate-6"
            />
          </div>
          <div
            className="absolute bottom-32 right-16 transform -rotate-6 animate-book-drift"
            style={{ animationDelay: "1s" }}
          >
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=150&fit=crop"
              alt="Book"
              className="w-20 h-30 rounded shadow-2xl opacity-70 hover:opacity-100 transition-all duration-700 hover:scale-125 hover:-rotate-12 filter hover:brightness-110"
            />
          </div>
          <div
            className="absolute top-32 right-1/4 transform rotate-45 animate-book-wobble"
            style={{ animationDelay: "2s" }}
          >
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=80&h=120&fit=crop"
              alt="Book"
              className="w-12 h-18 rounded shadow-2xl opacity-60 hover:opacity-100 transition-all duration-600 hover:scale-150 hover:rotate-90 hover:shadow-purple-500/50"
            />
          </div>
          <div
            className="absolute bottom-48 left-1/3 transform -rotate-12 animate-book-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            <img
              src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=90&h=135&fit=crop"
              alt="Book"
              className="w-14 h-20 rounded shadow-2xl opacity-75 hover:opacity-100 transition-all duration-500 hover:scale-120 hover:rotate-3 hover:shadow-blue-500/30"
            />
          </div>
          <div
            className="absolute top-48 left-1/4 transform rotate-6 animate-book-swing"
            style={{ animationDelay: "1.5s" }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=85&h=128&fit=crop"
              alt="Book"
              className="w-13 h-19 rounded shadow-2xl opacity-65 hover:opacity-100 transition-all duration-800 hover:scale-130 hover:-rotate-15 hover:shadow-indigo-500/40"
            />
          </div>

          {/* Floating Books with Trail Effect */}
          <div
            className="absolute top-20 left-1/2 animate-book-orbit"
            style={{ animationDelay: "0.8s" }}
          >
            <img
              src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=70&h=105&fit=crop"
              alt="Book"
              className="w-10 h-15 rounded shadow-xl opacity-50 hover:opacity-100 transition-all duration-1000 hover:scale-200"
            />
          </div>

          {/* Morphing Book */}
          <div
            className="absolute bottom-40 left-16 animate-book-morph"
            style={{ animationDelay: "2.5s" }}
          >
            <img
              src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=75&h=113&fit=crop"
              alt="Book"
              className="w-11 h-16 rounded shadow-xl opacity-55 hover:opacity-100 transition-all duration-900 hover:scale-175 hover:skew-x-12"
            />
          </div>

          {/* Reading Person with Parallax */}
          <div
            className="absolute bottom-16 right-1/4 animate-parallax-float"
            style={{ animationDelay: "0.8s" }}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces"
              alt="Person reading"
              className="w-24 h-24 rounded-full shadow-2xl opacity-40 hover:opacity-70 transition-all duration-1000 hover:scale-110 filter hover:sepia-0"
            />
          </div>

          {/* Animated Gradient Waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-y-6 animate-pulse"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Main Title with Animation */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-black mb-4 text-slate-700 leading-tight">
                <span
                  className="inline-block animate-fade-in-up"
                  style={{ animationDelay: "0.2s" }}
                >
                  Book
                </span>
                <span
                  className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent animate-fade-in-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  Nest
                </span>
              </h1>
              <div
                className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full animate-scale-in"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>

            {/* Subtitle */}
            <p
              className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.8s" }}
            >
              Your personal reading sanctuary where stories come alive and book
              lovers unite
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up"
              style={{ animationDelay: "1s" }}
            >
              <Link
                to="/books"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-blue-200/50"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-3 group-hover:animate-bounce text-xl">
                    📚
                  </span>
                  Explore Library
                </span>
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="group border-2 border-slate-300 text-slate-700 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-3 group-hover:animate-bounce text-xl">
                      ✨
                    </span>
                    Join BookNest
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-20"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#FEF3F2"
            />
          </svg>
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
                    to={`/books/${book.BookId}`}
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
                    to={`/books/${book.BookId}`}
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
                    to={`/authors/${author.AuthorId}`}
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes book-float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg) scale(1);
          }
          33% {
            transform: translateY(-15px) rotate(18deg) scale(1.05);
          }
          66% {
            transform: translateY(-8px) rotate(6deg) scale(0.98);
          }
        }

        @keyframes book-drift {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(-6deg);
          }
          25% {
            transform: translateX(10px) translateY(-12px) rotate(-12deg);
          }
          50% {
            transform: translateX(-5px) translateY(-8px) rotate(0deg);
          }
          75% {
            transform: translateX(8px) translateY(-15px) rotate(-18deg);
          }
        }

        @keyframes book-wobble {
          0%,
          100% {
            transform: rotate(45deg) scale(1);
          }
          25% {
            transform: rotate(50deg) scale(1.1) translateY(-5px);
          }
          50% {
            transform: rotate(40deg) scale(0.95) translateY(-10px);
          }
          75% {
            transform: rotate(55deg) scale(1.05) translateY(-3px);
          }
        }

        @keyframes book-pulse {
          0%,
          100% {
            transform: rotate(-12deg) scale(1);
            filter: brightness(1);
          }
          50% {
            transform: rotate(-8deg) scale(1.15);
            filter: brightness(1.2);
          }
        }

        @keyframes book-swing {
          0%,
          100% {
            transform: rotate(6deg) translateX(0px);
          }
          25% {
            transform: rotate(12deg) translateX(8px) translateY(-5px);
          }
          50% {
            transform: rotate(-3deg) translateX(-6px) translateY(-12px);
          }
          75% {
            transform: rotate(15deg) translateX(12px) translateY(-8px);
          }
        }

        @keyframes book-orbit {
          0% {
            transform: rotate(0deg) translateX(30px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(30px) rotate(-360deg);
          }
        }

        @keyframes book-morph {
          0%,
          100% {
            transform: rotate(0deg) scaleX(1) scaleY(1);
            border-radius: 4px;
          }
          25% {
            transform: rotate(5deg) scaleX(1.1) scaleY(0.9);
            border-radius: 8px;
          }
          50% {
            transform: rotate(-3deg) scaleX(0.9) scaleY(1.1);
            border-radius: 12px;
          }
          75% {
            transform: rotate(8deg) scaleX(1.05) scaleY(0.95);
            border-radius: 6px;
          }
        }

        @keyframes parallax-float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
          }
          33% {
            transform: translateY(-8px) translateX(-4px) scale(1.02);
          }
          66% {
            transform: translateY(-12px) translateX(6px) scale(0.98);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
          transform: scaleX(0);
        }

        .animate-book-float-1 {
          animation: book-float-1 4s ease-in-out infinite;
        }

        .animate-book-drift {
          animation: book-drift 6s ease-in-out infinite;
        }

        .animate-book-wobble {
          animation: book-wobble 3s ease-in-out infinite;
        }

        .animate-book-pulse {
          animation: book-pulse 2.5s ease-in-out infinite;
        }

        .animate-book-swing {
          animation: book-swing 5s ease-in-out infinite;
        }

        .animate-book-orbit {
          animation: book-orbit 8s linear infinite;
        }

        .animate-book-morph {
          animation: book-morph 4s ease-in-out infinite;
        }

        .animate-parallax-float {
          animation: parallax-float 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
