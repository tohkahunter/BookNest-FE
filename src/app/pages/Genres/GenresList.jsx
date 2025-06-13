// src/app/pages/Genres/GenresList.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function GenresList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const genres = [
    // Fiction genres
    {
      name: "Romance",
      category: "fiction",
      count: 1250,
      description: "Love stories and romantic relationships",
      color: "bg-pink-100 text-pink-700 border-pink-200",
      icon: "💕",
    },
    {
      name: "Mystery",
      category: "fiction",
      count: 890,
      description: "Suspenseful stories with puzzles to solve",
      color: "bg-purple-100 text-purple-700 border-purple-200",
      icon: "🔍",
    },
    {
      name: "Science Fiction",
      category: "fiction",
      count: 756,
      description: "Futuristic and speculative fiction",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: "🚀",
    },
    {
      name: "Fantasy",
      category: "fiction",
      count: 634,
      description: "Magical worlds and supernatural elements",
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      icon: "🧙‍♂️",
    },
    {
      name: "Thriller",
      category: "fiction",
      count: 523,
      description: "Fast-paced, suspenseful stories",
      color: "bg-red-100 text-red-700 border-red-200",
      icon: "⚡",
    },
    {
      name: "Historical Fiction",
      category: "fiction",
      count: 445,
      description: "Stories set in the past",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      icon: "🏛️",
    },
    {
      name: "Contemporary Fiction",
      category: "fiction",
      count: 398,
      description: "Modern-day stories and realistic situations",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: "🏙️",
    },
    {
      name: "Horror",
      category: "fiction",
      count: 287,
      description: "Scary and frightening stories",
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: "👻",
    },

    // Non-fiction genres
    {
      name: "Biography",
      category: "nonfiction",
      count: 678,
      description: "Life stories of real people",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: "👤",
    },
    {
      name: "Self-Help",
      category: "nonfiction",
      count: 567,
      description: "Personal development and improvement",
      color: "bg-teal-100 text-teal-700 border-teal-200",
      icon: "💪",
    },
    {
      name: "History",
      category: "nonfiction",
      count: 489,
      description: "Historical events and periods",
      color: "bg-orange-100 text-orange-700 border-orange-200",
      icon: "📜",
    },
    {
      name: "Science",
      category: "nonfiction",
      count: 423,
      description: "Scientific discoveries and research",
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
      icon: "🔬",
    },
    {
      name: "Business",
      category: "nonfiction",
      count: 356,
      description: "Business strategies and entrepreneurship",
      color: "bg-slate-100 text-slate-700 border-slate-200",
      icon: "💼",
    },
    {
      name: "Health & Fitness",
      category: "nonfiction",
      count: 298,
      description: "Wellness, diet, and exercise",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: "🏃‍♂️",
    },
    {
      name: "Travel",
      category: "nonfiction",
      count: 267,
      description: "Travel guides and adventure stories",
      color: "bg-sky-100 text-sky-700 border-sky-200",
      icon: "✈️",
    },
    {
      name: "Cooking",
      category: "nonfiction",
      count: 234,
      description: "Recipes and culinary techniques",
      color: "bg-rose-100 text-rose-700 border-rose-200",
      icon: "👨‍🍳",
    },

    // Other genres
    {
      name: "Poetry",
      category: "other",
      count: 189,
      description: "Poems and verse collections",
      color: "bg-violet-100 text-violet-700 border-violet-200",
      icon: "📝",
    },
    {
      name: "Art",
      category: "other",
      count: 156,
      description: "Art history and visual arts",
      color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
      icon: "🎨",
    },
    {
      name: "Music",
      category: "other",
      count: 134,
      description: "Music theory and musician biographies",
      color: "bg-lime-100 text-lime-700 border-lime-200",
      icon: "🎵",
    },
    {
      name: "Philosophy",
      category: "other",
      count: 123,
      description: "Philosophical thoughts and theories",
      color: "bg-stone-100 text-stone-700 border-stone-200",
      icon: "🤔",
    },
  ];

  const categories = [
    { value: "all", label: "All Genres", count: genres.length },
    {
      value: "fiction",
      label: "Fiction",
      count: genres.filter((g) => g.category === "fiction").length,
    },
    {
      value: "nonfiction",
      label: "Non-Fiction",
      count: genres.filter((g) => g.category === "nonfiction").length,
    },
    {
      value: "other",
      label: "Other",
      count: genres.filter((g) => g.category === "other").length,
    },
  ];

  const filteredGenres = genres.filter((genre) => {
    const matchesSearch =
      genre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      genre.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || genre.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalBooks = genres.reduce((sum, genre) => sum + genre.count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Browse by Genre
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover your next favorite book from our collection of{" "}
          {totalBooks.toLocaleString()} books across all genres
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search genres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              selectedCategory === category.value
                ? "bg-amber-100 text-amber-700 border-2 border-amber-300"
                : "bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="text-center mb-8">
        <p className="text-gray-600">
          Showing {filteredGenres.length} genre
          {filteredGenres.length !== 1 ? "s" : ""}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Genres Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredGenres.map((genre) => (
          <Link
            key={genre.name}
            to={`/genres/${genre.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="group"
          >
            <div
              className={`h-full p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${genre.color}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{genre.icon}</span>
                <span className="text-sm font-medium opacity-75">
                  {genre.count} books
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:underline">
                {genre.name}
              </h3>

              <p className="text-sm opacity-80 line-clamp-2">
                {genre.description}
              </p>

              <div className="mt-4 flex items-center text-sm font-medium opacity-75">
                <span>Explore</span>
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
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
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filteredGenres.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.515-.932-6.172-2.828A7.962 7.962 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8c0 1.306-.315 2.54-.876 3.631z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No genres found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="mt-4 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Popular combinations */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Popular Genre Combinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">
              Romantic Fantasy
            </h3>
            <p className="text-sm text-purple-700">Romance + Fantasy books</p>
            <Link
              to="/genres/romantic-fantasy"
              className="text-purple-600 text-sm font-medium hover:underline"
            >
              Browse collection →
            </Link>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              Sci-Fi Thriller
            </h3>
            <p className="text-sm text-blue-700">
              Science Fiction + Thriller books
            </p>
            <Link
              to="/genres/sci-fi-thriller"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Browse collection →
            </Link>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2">
              Historical Mystery
            </h3>
            <p className="text-sm text-amber-700">
              Historical Fiction + Mystery books
            </p>
            <Link
              to="/genres/historical-mystery"
              className="text-amber-600 text-sm font-medium hover:underline"
            >
              Browse collection →
            </Link>
          </div>
        </div>
      </div>

      {/* Featured genres */}
      <div className="mt-16 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          This Month's Featured Genres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Environmental Science
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Books about climate change and sustainability
            </p>
            <Link
              to="/genres/environmental-science"
              className="text-green-600 font-medium hover:underline"
            >
              Discover books
            </Link>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Psychology</h3>
            <p className="text-sm text-gray-600 mb-3">
              Understanding the human mind and behavior
            </p>
            <Link
              to="/genres/psychology"
              className="text-purple-600 font-medium hover:underline"
            >
              Discover books
            </Link>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Space Exploration
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Journey to the stars and beyond
            </p>
            <Link
              to="/genres/space-exploration"
              className="text-blue-600 font-medium hover:underline"
            >
              Discover books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
