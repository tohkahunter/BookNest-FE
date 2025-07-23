// src/app/pages/GenreList/GenreList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { genreService } from "../../../services/genreService";
import { QUERY_KEYS } from "../../../lib/queryKeys";

function GenreList() {
  const [sortBy, setSortBy] = useState("name");

  // Fetch all genres
  const {
    data: genres = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.GENRES,
    queryFn: genreService.getAllGenres,
  });

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

  // Get genre color based on genre name
  const getGenreColor = (genreName) => {
    const colorMap = {
      Fantasy: "from-purple-400 to-purple-600",
      "Science Fiction": "from-blue-400 to-blue-600",
      Mystery: "from-gray-400 to-gray-600",
      Romance: "from-pink-400 to-pink-600",
      Horror: "from-red-400 to-red-600",
      Biography: "from-green-400 to-green-600",
      History: "from-amber-400 to-amber-600",
      "Self-Help": "from-emerald-400 to-emerald-600",
      Business: "from-indigo-400 to-indigo-600",
      Technology: "from-cyan-400 to-cyan-600",
      Health: "from-teal-400 to-teal-600",
      Fiction: "from-orange-400 to-orange-600",
      "Non-Fiction": "from-slate-400 to-slate-600",
    };
    return colorMap[genreName] || "from-orange-400 to-orange-600";
  };

  // Sort genres based on selected option
  const sortedGenres = [...genres].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.GenreName.localeCompare(b.GenreName);
      case "book-count":
        return (b.BookCount || 0) - (a.BookCount || 0);
      case "description":
        return a.Description.localeCompare(b.Description);
      default:
        return 0;
    }
  });

  // Calculate total stats
  const totalStats = {
    totalGenres: genres.length,
    totalBooks: genres.reduce((sum, genre) => sum + (genre.BookCount || 0), 0),
    averageBooksPerGenre:
      genres.length > 0
        ? Math.round(
            genres.reduce((sum, genre) => sum + (genre.BookCount || 0), 0) /
              genres.length
          )
        : 0,
    popularGenres: genres.filter((genre) => (genre.BookCount || 0) > 0).length,
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
          Error Loading Genres
        </h1>
        <p className="text-gray-600 mb-6">
          Something went wrong while loading the genres. Please try again later.
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
            Explore Book Genres
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Discover your next favorite book by exploring our diverse collection
            of genres. From thrilling mysteries to epic fantasies, find the
            perfect story for every mood.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.totalGenres}
            </div>
            <div className="text-sm text-gray-600">Total Genres</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.totalBooks}
            </div>
            <div className="text-sm text-gray-600">Total Books</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.averageBooksPerGenre}
            </div>
            <div className="text-sm text-gray-600">Avg Books/Genre</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {totalStats.popularGenres}
            </div>
            <div className="text-sm text-gray-600">Active Genres</div>
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
            <option value="name">Genre Name</option>
            <option value="book-count">Book Count</option>
            <option value="description">Description</option>
          </select>
        </div>
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedGenres.map((genre) => (
          <Link
            key={genre.GenreId}
            to={`/genres/${genre.GenreId}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 transform hover:-translate-y-1"
          >
            {/* Genre Header with Icon */}
            <div
              className={`bg-gradient-to-br ${getGenreColor(
                genre.GenreName
              )} p-6 text-center`}
            >
              <div className="text-4xl mb-3">
                {getGenreIcon(genre.GenreName)}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {genre.GenreName}
              </h3>
              {/* <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-gray-700 text-sm font-medium">
                {genre.BookCount || 0} book
                {(genre.BookCount || 0) !== 1 ? "s" : ""}
              </div> */}
            </div>

            {/* Genre Content */}
            <div className="p-6">
              <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {genre.Description}
              </p>

              {/* Genre Stats */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {genre.BookCount > 0 ? "Available books" : "Coming soon"}
                </span>
                <div className="flex items-center text-orange-600 group-hover:text-orange-700 transition-colors">
                  <span className="font-medium">Explore</span>
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
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {genres.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Genres Available
          </h3>
          <p className="text-gray-500">
            Genres will appear here once they are added to the system.
          </p>
        </div>
      )}

      {/* Call to Action */}
      {genres.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Can't Find Your Favorite Genre?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Our collection is always growing. Check back regularly for new
            genres and books!
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/books"
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse All Books
            </Link>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-orange-600 transition-colors">
              Suggest a Genre
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default GenreList;
