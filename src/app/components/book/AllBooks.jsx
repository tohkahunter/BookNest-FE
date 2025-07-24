// src/app/pages/AllBooks/AllBooks.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getAllBooks,
  searchBooksWithAuthors,
} from "../../../services/bookService";
import { getAllAuthors } from "../../../services/authorService";
import { genreService } from "../../../services/genreService";
import { QUERY_KEYS } from "../../../lib/queryKeys";

function AllBooks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Fetch all books
  const {
    data: books = [],
    isLoading: isBooksLoading,
    error: booksError,
  } = useQuery({
    queryKey: QUERY_KEYS.BOOKS,
    queryFn: getAllBooks,
  });

  // Fetch authors for filter
  const { data: authors = [] } = useQuery({
    queryKey: QUERY_KEYS.AUTHORS,
    queryFn: getAllAuthors,
  });

  // Fetch genres for filter
  const { data: genres = [] } = useQuery({
    queryKey: QUERY_KEYS.GENRES,
    queryFn: genreService.getAllGenres,
  });

  // Filter and sort books
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        searchTerm === "" ||
        book.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.AuthorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.Isbn13?.includes(searchTerm);

      const matchesGenre =
        selectedGenre === "" || book.GenreId === Number(selectedGenre);
      const matchesAuthor =
        selectedAuthor === "" || book.AuthorId === Number(selectedAuthor);

      return matchesSearch && matchesGenre && matchesAuthor;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return (a.Title || "").localeCompare(b.Title || "");
        case "author":
          return (a.AuthorName || "").localeCompare(b.AuthorName || "");
        case "publication-year":
          return (b.PublicationYear || 0) - (a.PublicationYear || 0);
        case "pages":
          return (b.PageCount || 0) - (a.PageCount || 0);
        case "newest":
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        case "genre":
          return (a.GenreName || "").localeCompare(b.GenreName || "");
        default:
          return 0;
      }
    });

  // Calculate stats
  const stats = {
    totalBooks: books.length,
    filteredBooks: filteredBooks.length,
    totalPages: books.reduce((sum, book) => sum + (book.PageCount || 0), 0),
    uniqueAuthors: [
      ...new Set(books.map((book) => book.AuthorName).filter(Boolean)),
    ].length,
    uniqueGenres: [
      ...new Set(books.map((book) => book.GenreName).filter(Boolean)),
    ].length,
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre("");
    setSelectedAuthor("");
    setSortBy("title");
  };

  // Loading state
  if (isBooksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error state
  if (booksError) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Error Loading Books
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading books. Please try again later.
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
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Books</h1>
            <p className="text-gray-600">
              Discover {stats.totalBooks} amazing books from{" "}
              {stats.uniqueAuthors} authors across {stats.uniqueGenres} genres
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-700 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.GenreId} value={genre.GenreId}>
                {genre.GenreName}
              </option>
            ))}
          </select>

          {/* Author Filter */}
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className=" text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author.AuthorId} value={author.AuthorId}>
                {author.Name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="title">Title A-Z</option>
            <option value="author">Author A-Z</option>
            <option value="publication-year">Publication Year</option>
            <option value="pages">Page Count</option>
            <option value="newest">Recently Added</option>
            <option value="genre">Genre</option>
          </select>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {stats.filteredBooks} of {stats.totalBooks} books
            {(searchTerm || selectedGenre || selectedAuthor) && (
              <button
                onClick={clearFilters}
                className="ml-2 text-orange-600 hover:text-orange-700 underline"
              >
                Clear filters
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Books Display */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Books Found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or filters to find what you're
            looking for.
          </p>
          <button
            onClick={clearFilters}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <Link
              key={book.BookId}
              to={`/books/${book.BookId}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1"
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
                        <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif" opacity="0.6">
                          📖
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
                  <p className="text-sm text-orange-600 font-medium mb-1">
                    by {book.AuthorName}
                  </p>
                )}

                {book.GenreName && (
                  <p className="text-xs text-gray-500 mb-2">{book.GenreName}</p>
                )}

                <div className="text-xs text-gray-600 space-y-1">
                  {book.PublicationYear && (
                    <p>Published: {book.PublicationYear}</p>
                  )}
                  {book.PageCount && <p>Pages: {book.PageCount}</p>}
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
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <Link
              key={book.BookId}
              to={`/books/${book.BookId}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 hover:border-orange-300"
            >
              <div className="flex p-4">
                {/* Book Cover */}
                <div className="flex-shrink-0 w-20 h-28 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={book.CoverImageUrl}
                    alt={book.Title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="80" height="112" xmlns="http://www.w3.org/2000/svg">
                          <rect width="100%" height="100%" fill="#f97316"/>
                          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif">
                            📖
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>

                {/* Book Info */}
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-1">
                    {book.Title}
                  </h3>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    {book.AuthorName && (
                      <span className="text-orange-600 font-medium">
                        by {book.AuthorName}
                      </span>
                    )}
                    {book.GenreName && <span>{book.GenreName}</span>}
                    {book.PublicationYear && (
                      <span>{book.PublicationYear}</span>
                    )}
                    {book.PageCount && <span>{book.PageCount} pages</span>}
                  </div>

                  {book.Description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {book.Description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default AllBooks;
