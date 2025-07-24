// Fixed Header.jsx - Remove cache busting and debug user data

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SimpleBookSearch from "../book/SimpleBookSearch";

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showBrowseDropdown, setShowBrowseDropdown] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Refs for dropdown containers
  const browseDropdownRef = useRef(null);
  const communityDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
<<<<<<< HEAD
=======
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
>>>>>>> ba427cfed1db01b241d6433094a219e7b3c8e646

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setShowUserDropdown(false);
      navigate("/");
    }
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
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ DECLARE ALL VARIABLES FIRST
  const username = user?.Username || user?.username || "";
  const userEmail = user?.Email || user?.email || "";
  const firstName = user?.FirstName || user?.firstName || "";
  const lastName = user?.LastName || user?.lastName || "";
  const displayName =
    firstName && lastName ? `${firstName} ${lastName}` : username;

  // ✅ DEBUG: Log user data to see if it's updated
  console.log("🔍 Header user data:", {
    user: user,
    firstName: firstName,
    lastName: lastName,
    profilePictureUrl: user?.ProfilePictureUrl,
    displayName: displayName,
  });

  // ✅ FIXED: UserAvatar component without excessive cache busting
  const UserAvatar = ({ user, size = "w-8 h-8" }) => {
    const profilePicture = user?.ProfilePictureUrl || user?.profilePictureUrl;
    const userFirstName = user?.FirstName || user?.firstName || "";
    const userLastName = user?.LastName || user?.lastName || "";
    const userUsername = user?.Username || user?.username || "";

    const userDisplayName =
      userFirstName && userLastName
        ? `${userFirstName} ${userLastName}`
        : userUsername;

    console.log("👤 UserAvatar data:", {
      user: user,
      profilePicture: profilePicture,
      userFirstName: userFirstName,
      userLastName: userLastName,
      userDisplayName: userDisplayName,
      hasProfilePicture: !!profilePicture,
    });

    // ✅ FIXED: Remove constant cache busting
    let avatarSrc;

    if (profilePicture && profilePicture.trim()) {
      console.log("✅ Using profile picture:", profilePicture);
      avatarSrc = profilePicture.startsWith("/")
        ? `http://localhost:5067${profilePicture}`
        : profilePicture;

      // ❌ REMOVED: Cache busting that causes constant refresh
      // avatarSrc = `${avatarSrc}${avatarSrc.includes("?") ? "&" : "?"}t=${Date.now()}`;
    } else {
      console.log("❌ No profile picture, using generated avatar");
      const fullName = `${userFirstName} ${userLastName}`.trim();
      const nameForAvatar = fullName || userUsername;

      console.log("🖼️ Generated avatar name:", nameForAvatar);

      avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nameForAvatar
      )}&background=f97316&color=ffffff&size=128&font-size=0.4`;
    }

    console.log("🔗 Final avatar URL:", avatarSrc);

    return (
      <img
        src={avatarSrc}
        alt={`${userDisplayName} avatar`}
        className={`${size} rounded-full object-cover border-2 border-gray-200 shadow-sm`}
        onError={(e) => {
          console.log("❌ Avatar image failed to load:", e.target.src);
          const fullName = `${userFirstName} ${userLastName}`.trim();
          const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            fullName || userUsername
          )}&background=f97316&color=ffffff&size=128&font-size=0.4`;

          if (e.target.src !== fallback) {
            e.target.src = fallback;
          }
        }}
        onLoad={() => {
          console.log("✅ Avatar loaded successfully:", avatarSrc);
        }}
      />
    );
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                  <svg
                    className="w-5 h-5 text-white"
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
                </div>
                <span className="text-2xl font-bold group-hover:scale-105 transition-transform duration-200">
                  <span className="text-gray-800">Book</span>
                  <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                    Nest
                  </span>
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1 ml-10">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              Home
            </Link>

            {isAuthenticated && (
              <Link
                to="/bookshelf"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                My Books
              </Link>
            )}

            {/* Browse Dropdown */}
            <div className="relative" ref={browseDropdownRef}>
              <button
                onClick={() => setShowBrowseDropdown(!showBrowseDropdown)}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center hover:scale-105"
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
                <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <Link
                      to="/books"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-gray-900 transition-colors duration-200"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-amber-500"
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
                      All Books
                    </Link>
                    <Link
                      to="/authors"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-gray-900 transition-colors duration-200"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Authors
                    </Link>
                    <Link
                      to="/genres"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-gray-900 transition-colors duration-200"
                      onClick={() => setShowBrowseDropdown(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Genres
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8">
            <SimpleBookSearch
              placeholder="Search for books, authors..."
              className="w-full"
            />
          </div>

          {/* Right side - User/Sign In */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  {/* ✅ REMOVED: avatarKey to prevent constant re-rendering */}
                  <UserAvatar user={user} />
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-700">
                      {displayName}
                    </span>
                    {userEmail && (
                      <span className="text-xs text-gray-500">{userEmail}</span>
                    )}
                  </div>
                  <svg
                    className={`hidden md:block h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      showUserDropdown ? "rotate-180" : ""
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

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/bookshelf"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
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
                        My Library
                      </Link>

                      {currentUser?.roleId === 3 && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7h18M3 12h18M3 17h18"
                            />
                          </svg>
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <svg
                          className="w-4 h-4 mr-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-3">
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none rounded-lg p-2 transition-all duration-200"
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
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 space-y-1">
            {/* Mobile Search */}
            <div className="pb-3 border-b border-gray-100">
              <SimpleBookSearch
                placeholder="Search books..."
                className="w-full"
              />
            </div>

            {/* Mobile user section */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <UserAvatar user={user} />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {displayName}
                    </p>
                    {userEmail && (
                      <p className="text-xs text-gray-500">{userEmail}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    My Profile
                  </Link>

                  {currentUser?.roleId === 3 && (
                    <Link
                      to="/admin"
                      className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <svg
                        className="w-4 h-4 mr-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7h18M3 12h18M3 17h18"
                        />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/settings"
                    className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="flex items-center w-full text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Sign In/Sign Up Buttons */}
            {!isAuthenticated && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center w-full text-gray-700 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
