// src/app/pages/AuthorList/AuthorList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllAuthors } from "../../../services/authorService";
import { QUERY_KEYS } from "../../../lib/queryKeys";

function AuthorList() {
  const [sortBy, setSortBy] = useState("name");

  // Fetch all authors
  const {
    data: authors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.AUTHORS,
    queryFn: getAllAuthors,
  });

  // Sort authors based on selected option
  const sortedAuthors = [...authors].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.Name.localeCompare(b.Name);
      case "book-count":
        return (b.BookCount || 0) - (a.BookCount || 0);
      default:
        return 0;
    }
  });

  // Calculate total stats
  const totalStats = {
    totalAuthors: authors.length,
    totalBooks: authors.reduce(
      (sum, author) => sum + (author.BookCount || 0),
      0
    ),
    averageBooksPerAuthor:
      authors.length > 0
        ? Math.round(
            authors.reduce((sum, author) => sum + (author.BookCount || 0), 0) /
              authors.length
          )
        : 0,
    activeAuthors: authors.filter((author) => (author.BookCount || 0) > 0)
      .length,
  };

  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Get color for author card based on name
  const getAuthorColor = (name) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-green-400 to-green-600",
      "from-purple-400 to-purple-600",
      "from-pink-400 to-pink-600",
      "from-indigo-400 to-indigo-600",
      "from-yellow-400 to-yellow-600",
      "from-red-400 to-red-600",
      "from-teal-400 to-teal-600",
      "from-orange-400 to-orange-600",
      "from-cyan-400 to-cyan-600",
    ];

    // Use name hash to consistently assign colors
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
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
          Error Loading Authors
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading the authors. Please try again
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
            Discover Amazing Authors
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Meet the brilliant minds behind your favorite books. Explore our
            diverse collection of authors and discover new voices that will
            captivate your imagination.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.totalAuthors}
            </div>
            <div className="text-sm text-gray-600">Total Authors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.totalBooks}
            </div>
            <div className="text-sm text-gray-600">Total Books</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.averageBooksPerAuthor}
            </div>
            <div className="text-sm text-gray-600">Avg Books/Author</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.activeAuthors}
            </div>
            <div className="text-sm text-gray-600">Active Authors</div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className=" text-gray-700 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="name">Author Name</option>
            <option value="book-count">Book Count</option>
          </select>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedAuthors.map((author) => (
          <Link
            key={author.AuthorId}
            to={`/authors/${author.AuthorId}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1"
          >
            {/* Author Header with Avatar */}
            <div className="p-6 text-center">
              <div className="relative mb-4">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${getAuthorColor(
                    author.Name
                  )} rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto shadow-lg`}
                >
                  {getInitials(author.Name)}
                </div>
                {(author.BookCount || 0) > 0 && (
                  <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                    {author.BookCount}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                {author.Name}
              </h3>

              <div className="bg-gray-100 rounded-full px-3 py-1 text-gray-700 text-sm font-medium">
                {author.BookCount || 0} book
                {(author.BookCount || 0) !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Author Stats */}
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {(author.BookCount || 0) > 0
                      ? "Published author"
                      : "Coming soon"}
                  </span>
                  <div className="flex items-center text-orange-600 group-hover:text-orange-700 transition-colors">
                    <span className="font-medium">View Profile</span>
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {authors.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Authors Available
          </h3>
          <p className="text-gray-500">
            Authors will appear here once they are added to the system.
          </p>
        </div>
      )}

      {/* Featured Authors Section */}
      {authors.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Most Prolific Authors
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sortedAuthors
                .filter((author) => (author.BookCount || 0) > 0)
                .slice(0, 6)
                .map((author, index) => (
                  <Link
                    key={author.AuthorId}
                    to={`/authors/${author.AuthorId}`}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${getAuthorColor(
                          author.Name
                        )} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                      >
                        {getInitials(author.Name)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                        {author.Name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {author.BookCount} published book
                        {author.BookCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-lg font-bold">
                        #{index + 1}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>

            {authors.filter((author) => (author.BookCount || 0) > 0).length ===
              0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No published authors yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Call to Action */}
      {authors.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Join Our Community of Readers
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Follow your favorite authors and get notified when they publish new
            books!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse All Books
            </Link>
            <Link
              to="/genres"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition-colors"
            >
              Explore Genres
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default AuthorList;
