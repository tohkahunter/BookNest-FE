import React, { useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSearchBooks, useAuthors, useGenres } from "../hooks/index";

// Fallback image component - exactly like in Home
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

const SearchResults = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const searchQuery = urlParams.get("q") || "";
  const genreFilter = urlParams.get("genre") || "";

  // Data fetching - following Home pattern
  const {
    data: books = [],
    isLoading: booksLoading,
    error: booksError,
  } = useSearchBooks(searchQuery);

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

  // Combined states - following Home pattern
  const isLoading = booksLoading || authorsLoading || genresLoading;
  const error = booksError || authorsError || genresError;

  // Filter books by genre if specified
  const filteredBooks = useMemo(() => {
    if (!genreFilter) return books;
    return books.filter((book) => book.GenreId === parseInt(genreFilter));
  }, [books, genreFilter]);

  // Get genre name for display
  const currentGenre = useMemo(() => {
    if (!genreFilter) return null;
    return genres.find((g) => g.GenreId === parseInt(genreFilter));
  }, [genres, genreFilter]);

  // Error state - exactly like Home
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
            {error?.message || "Unable to load search results"}
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

  // Determine title and description
  const getTitle = () => {
    if (currentGenre && searchQuery) {
      return `${currentGenre.GenreName}: "${searchQuery}"`;
    } else if (currentGenre) {
      return currentGenre.GenreName;
    } else if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    } else {
      return "Browse Books";
    }
  };

  const getDescription = () => {
    if (currentGenre && searchQuery) {
      return `Found ${
        filteredBooks.length
      } ${currentGenre.GenreName.toLowerCase()} books matching "${searchQuery}"`;
    } else if (currentGenre) {
      return `Explore ${filteredBooks.length} books in ${currentGenre.GenreName}`;
    } else if (searchQuery) {
      return `Found ${filteredBooks.length} books matching your search`;
    } else {
      return "Discover books in our collection";
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-3 h-8 bg-blue-500 rounded mr-4"></span>
                {getTitle()}
              </h2>
              <p className="text-gray-600 mt-2 text-lg">{getDescription()}</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/books"
                className="text-orange-600 hover:text-orange-700 font-medium hover:underline text-lg"
              >
                Browse All →
              </Link>
            </div>
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
            ) : filteredBooks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No books found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? `We couldn't find any books matching "${searchQuery}"`
                    : "No books available in this category"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/search"
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    🔍 Try New Search
                  </Link>
                  <Link
                    to="/books"
                    className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg hover:bg-orange-50 transition-colors font-medium"
                  >
                    📚 Browse All Books
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredBooks.map((book) => (
                  <Link
                    key={book.BookId || book.id}
                    to={`/book/${book.BookId || book.id}`}
                    className="block p-8 hover:bg-orange-25 transition-colors group"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <BookCover
                          src={book.CoverImageUrl || book.coverImage}
                          alt={book.Title || book.name}
                          className="w-20 h-28 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                          {book.Title || book.name}
                        </h3>
                        <p className="text-gray-600 mb-3">
                          by{" "}
                          {book.Author ||
                            authors.find((a) => a.AuthorId === book.AuthorId)
                              ?.Name ||
                            "Unknown Author"}
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
                              ?.GenreName ||
                              `Genre ${book.GenreId || "Unknown"}`}
                          </Link>
                          {(book.Isbn13 || book.isbn) && (
                            <span>📚 ISBN: {book.Isbn13 || book.isbn}</span>
                          )}
                          <span>🔍 Search result</span>
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

        {/* Related Genres Section - if searching by genre */}
        {currentGenre && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  <span className="w-3 h-8 bg-purple-500 rounded mr-4"></span>
                  Other Genres You Might Like
                </h2>
                <p className="text-gray-600 mt-2 text-lg">
                  Explore related categories
                </p>
              </div>
              <Link
                to="/search?view=genres"
                className="text-orange-600 hover:text-orange-700 font-medium hover:underline text-lg"
              >
                All genres →
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-8">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-24 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {genres
                    .filter((g) => g.GenreId !== parseInt(genreFilter))
                    .slice(0, 4)
                    .map((genre, index) => {
                      const gradients = [
                        "from-blue-400 to-blue-600",
                        "from-green-400 to-green-600",
                        "from-purple-400 to-purple-600",
                        "from-pink-400 to-pink-600",
                      ];
                      const gradient = gradients[index % gradients.length];

                      return (
                        <Link
                          key={genre.GenreId}
                          to={`/search?genre=${
                            genre.GenreId
                          }&q=${encodeURIComponent(
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
              )}
            </div>
          </section>
        )}

        {/* Call to Action - if no search results */}
        {!isLoading && filteredBooks.length === 0 && (
          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
              Try adjusting your search terms or browse our complete collection
              of books
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/search"
                className="bg-white text-orange-600 px-10 py-4 rounded-lg font-bold text-xl hover:bg-orange-50 transition-colors shadow-lg"
              >
                🔍 New Search
              </Link>
              <Link
                to="/books"
                className="border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-xl hover:bg-white hover:text-orange-600 transition-colors"
              >
                📚 Browse All Books
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
