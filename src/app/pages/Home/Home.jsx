
import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { useBooks, useAuthors, useGenres, useAuth } from "../../hooks/index";
import BookSearch from "../../components/book/BookSearch";

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

  // Derived data
  const featuredBooks = useMemo(() => books.slice(0, 6), [books]);
  const recentBooks = useMemo(() => books.slice(-8), [books]);
  const popularAuthors = useMemo(() => authors.slice(0, 6), [authors]);

  // Combined states
  const isLoading = booksLoading || authorsLoading || genresLoading;
  const error = booksError || authorsError || genresError;

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Search handlers
  const handleSearchResults = useCallback((results, term, searchError) => {
    setSearchResults(results || []);
    setSearchTerm(term || "");
    setIsSearchActive(!!term && term.length > 0);
    if (searchError) console.error("Search error:", searchError);
  }, []);

  const handleSearchTermChange = useCallback((term) => {
    setSearchTerm(term || "");
    setIsSearchActive(!!term && term.length > 0);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchTerm("");
    setIsSearchActive(false);
  }, []);

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
      {/* Header */}
      <section className="bg-white border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover your next great read
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track books you've read, find new ones, and connect with fellow
              book lovers
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-8">
            <BookSearch
              onSearchResults={handleSearchResults}
              onSearchTermChange={handleSearchTermChange}
              placeholder="Tìm kiếm sách theo tên, tác giả..."
              showFilters={true}
              genres={genres}
              className="shadow-lg border-orange-200"
            />
          </div>

          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {books.length}
              </div>
              <div className="text-sm text-gray-600">Books</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {authors.length}
              </div>
              <div className="text-sm text-gray-600">Authors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {genres.length}
              </div>
              <div className="text-sm text-gray-600">Genres</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-gray-600">Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {isAuthenticated && !isSearchActive && (
          <section className="bg-white rounded-lg shadow-sm border border-orange-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome back, {user?.username || user?.Username}!
                </h2>
                <p className="text-gray-600">
                  Ready to discover your next favorite book?
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  to="/my-books"
                  className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors font-medium"
                >
                  My Books
                </Link>
                <Link
                  to="/books"
                  className="border border-orange-600 text-orange-600 px-6 py-2 rounded hover:bg-orange-50 transition-colors font-medium"
                >
                  Browse
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Search Results */}
        {isSearchActive && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results
                </h2>
                <p className="text-gray-600">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} results`
                    : "No results found"}
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              <button
                onClick={clearSearch}
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear search
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {searchResults.map((book) => (
                    <div
                      key={book.BookId || book.bookId}
                      className="group cursor-pointer"
                    >
                      <div className="mb-3">
                        <BookCover
                          src={book.CoverImageUrl || book.coverImageUrl}
                          alt={book.Title || book.title}
                          className="w-full h-48 object-cover rounded shadow-md group-hover:shadow-lg transition-shadow"
                        />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {book.Title || book.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        by{" "}
                        {book.authorName ||
                          book.author?.name ||
                          authors.find((a) => a.AuthorId === book.AuthorId)
                            ?.Name ||
                          "Unknown Author"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No books found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <button
                    onClick={clearSearch}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Browse all books →
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Popular Books */}
        {!isSearchActive && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-6 bg-orange-500 rounded mr-3"></span>
                  Popular This Week
                </h2>
                <p className="text-gray-600 mt-1">
                  Books our community is loving right now
                </p>
              </div>
              <Link
                to="/books"
                className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
              >
                See all →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
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
                    <div key={book.BookId} className="group cursor-pointer">
                      <div className="mb-3">
                        <BookCover
                          src={book.CoverImageUrl}
                          alt={book.Title}
                          className="w-full h-48 object-cover rounded shadow-md group-hover:shadow-lg transition-shadow"
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recently Added */}
        {!isSearchActive && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-6 bg-green-500 rounded mr-3"></span>
                  Recently Added
                </h2>
                <p className="text-gray-600 mt-1">
                  Fresh books just added to our library
                </p>
              </div>
              <Link
                to="/books"
                className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
              >
                See all →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-orange-200">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 animate-pulse"
                    >
                      <div className="bg-gray-200 w-16 h-24 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recentBooks.slice(0, 6).map((book) => (
                    <div
                      key={book.BookId}
                      className="p-6 hover:bg-orange-25 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <BookCover
                            src={book.CoverImageUrl}
                            alt={book.Title}
                            className="w-16 h-24 object-cover rounded shadow-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-1">
                            {book.Title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            by{" "}
                            {authors.find((a) => a.AuthorId === book.AuthorId)
                              ?.Name || "Unknown Author"}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>
                              {genres.find((g) => g.GenreId === book.GenreId)
                                ?.GenreName || `Genre ${book.GenreId}`}
                            </span>
                            {book.Isbn13 && <span>ISBN: {book.Isbn13}</span>}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors">
                            Want to Read
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Popular Authors */}
        {!isSearchActive && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-6 bg-purple-500 rounded mr-3"></span>
                  Popular Authors
                </h2>
                <p className="text-gray-600 mt-1">
                  Authors you might want to follow
                </p>
              </div>
              <Link
                to="/authors"
                className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
              >
                See all →
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse flex items-center space-x-4 p-4"
                    >
                      <div className="bg-gray-200 w-16 h-16 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
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
                      className="group flex items-center space-x-4 p-4 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {author.Name ? author.Name.charAt(0) : "A"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {author.Name || "Unknown Author"}
                        </h3>
                        <p className="text-sm text-gray-600">Author</p>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors"
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No authors available</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Call to Action */}
        {!isAuthenticated && !isSearchActive && (
          <section className="bg-orange-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join BookNest Today</h2>
            <p className="text-xl mb-6 text-orange-100">
              Discover, track, and share the books you love with our community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-orange-600 px-8 py-3 rounded font-bold text-lg hover:bg-orange-50 transition-colors"
              >
                Sign Up for Free
              </Link>
              <Link
                to="/books"
                className="border-2 border-white text-white px-8 py-3 rounded font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors"
              >
                Browse Books
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Debug Panel */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-white border border-orange-200 rounded-lg shadow-lg p-3 text-xs max-w-xs">
          <div className="font-semibold text-orange-600 mb-2">Debug Info</div>
          <div className="space-y-1 text-gray-600">
            <div>Loading: {isLoading.toString()}</div>
            <div>Books: {books.length}</div>
            <div>Authors: {authors.length}</div>
            <div>Genres: {genres.length}</div>
            <div>Search Active: {isSearchActive.toString()}</div>
            <div>Search Results: {searchResults.length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
