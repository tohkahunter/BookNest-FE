// src/app/pages/Categories/Categories.jsx
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function Categories() {
  const { genre } = useParams();
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");

  // Mock data for biography books (replace with actual API data)
  const biographyBooks = [
    {
      id: 1,
      title: "Steve Jobs",
      author: "Walter Isaacson",
      cover:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=300&fit=crop",
      rating: 4.5,
      ratingsCount: 125000,
      description:
        "The exclusive biography of Steve Jobs based on extraordinary interviews...",
      isFavorited: false,
    },
    {
      id: 2,
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      cover:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=300&fit=crop",
      rating: 4.7,
      ratingsCount: 89000,
      description:
        "The moving and inspiring story of a young girl's journey...",
      isFavorited: true,
    },
    {
      id: 3,
      title: "Becoming",
      author: "Michelle Obama",
      cover:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop",
      rating: 4.6,
      ratingsCount: 156000,
      description:
        "A deeply personal reckoning of a woman of soul and substance...",
      isFavorited: false,
    },
    {
      id: 4,
      title: "Elon Musk",
      author: "Ashlee Vance",
      cover:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&h=300&fit=crop",
      rating: 4.3,
      ratingsCount: 67000,
      description:
        "The first authorized biography of the visionary entrepreneur...",
      isFavorited: false,
    },
    {
      id: 5,
      title: "Educated",
      author: "Tara Westover",
      cover:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop",
      rating: 4.8,
      ratingsCount: 234000,
      description:
        "A memoir about the struggle for self-invention and education...",
      isFavorited: true,
    },
    {
      id: 6,
      title: "Unbroken",
      author: "Laura Hillenbrand",
      cover:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop",
      rating: 4.4,
      ratingsCount: 178000,
      description:
        "A World War II story of survival, resilience, and redemption...",
      isFavorited: false,
    },
  ];

  const mostReadThisWeek = [
    {
      id: 7,
      title: "I'm Glad My Mom Died",
      author: "Jennette McCurdy",
      cover:
        "https://images.unsplash.com/photo-1614544048536-0d28caf77200?w=200&h=300&fit=crop",
      rating: 4.5,
      isNew: true,
    },
    {
      id: 8,
      title: "From Here to the Great Unknown",
      author: "Lisa Marie Presley",
      cover:
        "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=200&h=300&fit=crop",
      rating: 4.2,
      isNew: true,
    },
    {
      id: 9,
      title: "A Promised Land",
      author: "Barack Obama",
      cover:
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=200&h=300&fit=crop",
      rating: 4.6,
      isNew: false,
    },
  ];

  const newReleases = [
    {
      id: 10,
      title: "Mark Twain",
      author: "Ron Chernow",
      cover:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=300&fit=crop",
      rating: 4.3,
      releaseDate: "2024-01-15",
    },
    {
      id: 11,
      title: "The True Happy",
      author: "Keena Duncanoly",
      cover:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=300&fit=crop",
      rating: 4.1,
      releaseDate: "2024-02-20",
    },
  ];

  const genreInfo = {
    title: "Biography",
    description:
      'A biography (from the Greek words bios meaning "life", and graphos meaning "write") is a non-fictional account of a person\'s life. Biographies are written by an author who is not the subject/focus of the book.',
    relatedGenres: ["Autobiography", "Memoir"],
    totalBooks: "2,847 books",
    breadcrumb: ["Genres", "Nonfiction", "Biography"],
  };

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "title", label: "Title A-Z" },
    { value: "author", label: "Author A-Z" },
  ];

  const toggleFavorite = (bookId) => {
    // Handle favorite toggle logic here
    console.log("Toggle favorite for book:", bookId);
  };

  const BookCard = ({ book, size = "normal" }) => (
    <div
      className={`group cursor-pointer ${size === "small" ? "w-32" : "w-full"}`}
    >
      <div className="relative">
        <img
          src={book.cover}
          alt={book.title}
          className={`w-full ${
            size === "small" ? "h-44" : "h-64"
          } object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105`}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(book.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
        >
          <svg
            className={`w-4 h-4 ${
              book.isFavorited ? "text-red-500 fill-current" : "text-gray-600"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        {book.isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            New
          </span>
        )}
      </div>
      <div className="mt-3">
        <h3
          className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors ${
            size === "small" ? "text-sm" : "text-base"
          }`}
        >
          {book.title}
        </h3>
        <p
          className={`text-gray-600 mt-1 ${
            size === "small" ? "text-xs" : "text-sm"
          }`}
        >
          by {book.author}
        </p>
        {book.rating && (
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(book.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {book.rating}{" "}
              {book.ratingsCount && `(${book.ratingsCount.toLocaleString()})`}
            </span>
          </div>
        )}
        {size === "normal" && book.description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {book.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        {genreInfo.breadcrumb.map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 && <span className="text-gray-400">></span>}
            <Link
              to={index === 0 ? "/genres" : `/genres/${item.toLowerCase()}`}
              className="hover:text-amber-600 transition-colors"
            >
              {item}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {genreInfo.title}
            </h1>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
              Favorited
            </button>
          </div>
          <p className="text-gray-700 text-lg max-w-4xl mb-4">
            {genreInfo.description}
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {genreInfo.totalBooks}
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">See also:</span>
              {genreInfo.relatedGenres.map((related, index) => (
                <React.Fragment key={related}>
                  <Link
                    to={`/genres/${related.toLowerCase()}`}
                    className="text-sm text-amber-600 hover:text-amber-700 underline"
                  >
                    {related}
                  </Link>
                  {index < genreInfo.relatedGenres.length - 1 && (
                    <span className="text-gray-400">,</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Most Read This Week */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            MOST READ THIS WEEK
          </h2>
          <Link
            to="/genres/biography/trending"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            More most read this week...
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {mostReadThisWeek.map((book) => (
            <BookCard key={book.id} book={book} size="small" />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            NEW RELEASES TAGGED "BIOGRAPHY"
          </h2>
          <Link
            to="/genres/biography/new-releases"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            More new releases...
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {newReleases.map((book) => (
            <BookCard key={book.id} book={book} size="small" />
          ))}
        </div>
      </section>

      {/* All Biography Books */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">BIOGRAPHY BOOKS</h2>
          <div className="flex items-center space-x-4">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View mode toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "grid"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-white text-gray-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 text-sm ${
                  viewMode === "list"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-white text-gray-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "space-y-4"
          }
        >
          {biographyBooks.map((book) =>
            viewMode === "grid" ? (
              <BookCard key={book.id} book={book} />
            ) : (
              <div
                key={book.id}
                className="flex space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(book.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {book.rating} ({book.ratingsCount.toLocaleString()}{" "}
                      ratings)
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {book.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleFavorite(book.id)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <svg
                    className={`w-5 h-5 ${
                      book.isFavorited
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            )
          )}
        </div>

        {/* Load more button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium rounded-lg transition-colors">
            Load More Books
          </button>
        </div>
      </section>
    </div>
  );
}
