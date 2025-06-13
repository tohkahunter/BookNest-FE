// src/app/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Refs for dropdown containers
  const browseDropdownRef = useRef(null);
  const communityDropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Handle search logic here
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        browseDropdownRef.current &&
        !browseDropdownRef.current.contains(event.target)
      ) {
        setShowBrowseDropdown(false);
      }
      if (
        communityDropdownRef.current &&
        !communityDropdownRef.current.contains(event.target)
      ) {
        setShowCommunityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-amber-50 border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-gray-800">good</span>
                <span className="text-orange-600">reads</span>
              </span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8 ml-10">
            {/* Home */}
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>

            {/* My Books */}
            <Link
              to="/my-books"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              My Books
            </Link>

            {/* Browse Dropdown */}
            <div className="relative" ref={browseDropdownRef}>
              <button
                onClick={() => setShowBrowseDropdown(!showBrowseDropdown)}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
              >
                Browse
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    showBrowseDropdown ? "rotate-180" : ""
                  }`}
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
              </button>

              {showBrowseDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link
                      to="/browse/books"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      Books
                    </Link>
                    <Link
                      to="/browse/genres"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      Genres
                    </Link>
                    <Link
                      to="/browse/recommendations"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      Recommendations
                    </Link>
                    <Link
                      to="/browse/new-releases"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      New Releases
                    </Link>
                    <Link
                      to="/browse/deals"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      Deals
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Community Dropdown */}
            <div className="relative" ref={communityDropdownRef}>
              <button
                onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
              >
                Community
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    showCommunityDropdown ? "rotate-180" : ""
                  }`}
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
              </button>

              {showCommunityDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link
                      to="/community/groups"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowCommunityDropdown(false)}
                    >
                      Groups
                    </Link>
                    <Link
                      to="/community/discussions"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowCommunityDropdown(false)}
                    >
                      Discussions
                    </Link>
                    <Link
                      to="/community/quotes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowCommunityDropdown(false)}
                    >
                      Quotes
                    </Link>
                    <Link
                      to="/community/ask-author"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowCommunityDropdown(false)}
                    >
                      Ask the Author
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books"
                  className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5"
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
                </button>
              </div>
            </form>
          </div>

          {/* Right side - Notification + Sign In */}
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                3
              </span>
            </button>

            {/* Sign In Button */}
            <Link
              to="/login"
              className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200"
            >
              Sign in
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    showMobileMenu
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              to="/my-books"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              My Books
            </Link>
            <Link
              to="/browse"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Browse
            </Link>
            <Link
              to="/community"
              className="block text-gray-700 hover:text-gray-900 py-2"
              onClick={() => setShowMobileMenu(false)}
            >
              Community
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
