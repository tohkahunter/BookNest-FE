import React, { useState, useEffect, useCallback, useMemo } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  useSearchBooks,
  usePopularBooks,
  useRecentBooks,
} from "../../hooks/index"; // 🆕 React Query hooks

const BookSearch = ({
  onSearchResults,
  onSearchTermChange,
  initialSearchTerm = "",
  showFilters = true,
  placeholder = "Tìm kiếm sách theo tên, tác giả...",
  className = "",
  genres = [],
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [quickSearchType, setQuickSearchType] = useState(null);

  // 🆕 Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 🔧 Move applySorting function BEFORE useMemo to fix hoisting issue
  const applySorting = useCallback((books, sortOption) => {
    if (!books || !Array.isArray(books)) return [];

    const sortedBooks = [...books];

    switch (sortOption) {
      case "title":
        return sortedBooks.sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );
      case "author":
        return sortedBooks.sort((a, b) =>
          (a.author?.name || a.authorName || "").localeCompare(
            b.author?.name || b.authorName || ""
          )
        );
      case "year":
        return sortedBooks.sort(
          (a, b) => (b.publicationYear || 0) - (a.publicationYear || 0)
        );
      case "rating":
        return sortedBooks.sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
      case "recent":
        return sortedBooks.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.CreatedAt || 0);
          const dateB = new Date(b.createdAt || b.CreatedAt || 0);
          return dateB - dateA;
        });
      default: // relevance
        return sortedBooks;
    }
  }, []);

  // 🆕 React Query hooks - automatically handle loading states
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useSearchBooks(debouncedSearchTerm, {
    enabled: !!debouncedSearchTerm && debouncedSearchTerm.length > 0,
  });

  const { data: popularBooks, isLoading: isLoadingPopular } = usePopularBooks(
    20,
    {
      enabled: !debouncedSearchTerm || quickSearchType === "popular",
    }
  );

  const { data: recentBooks, isLoading: isLoadingRecent } = useRecentBooks(20, {
    enabled: quickSearchType === "recent",
  });

  // 🆕 Memoized processed results - NOW applySorting is available
  const processedResults = useMemo(() => {
    let results = [];

    // Determine which data to use
    if (quickSearchType === "recent" && recentBooks) {
      results = recentBooks;
    } else if (quickSearchType === "popular" && popularBooks) {
      results = popularBooks;
    } else if (quickSearchType === "top-rated" && popularBooks) {
      results = popularBooks;
    } else if (debouncedSearchTerm && searchResults) {
      results = searchResults;
    } else if (!debouncedSearchTerm && popularBooks) {
      // Default to popular books when no search term
      results = popularBooks;
    }

    if (!results || !Array.isArray(results)) return [];

    // Apply genre filter if selected
    let filteredResults = results;
    if (selectedGenre !== "all") {
      filteredResults = results.filter(
        (book) =>
          book.genre?.genreId === parseInt(selectedGenre) ||
          book.genreId === parseInt(selectedGenre)
      );
    }

    // Apply sorting
    return applySorting(filteredResults, sortBy);
  }, [
    searchResults,
    popularBooks,
    recentBooks,
    quickSearchType,
    debouncedSearchTerm,
    selectedGenre,
    sortBy,
    applySorting, // ✅ Now properly included in dependencies
  ]);

  // 🆕 Combined loading state
  const isLoading = isSearching || isLoadingPopular || isLoadingRecent;

  // 🔄 Effect to notify parent of results changes
  useEffect(() => {
    if (onSearchResults) {
      const searchTermToReport = quickSearchType
        ? `Tìm kiếm: ${quickSearchType}`
        : debouncedSearchTerm;

      onSearchResults(
        processedResults,
        searchTermToReport,
        searchError?.message
      );
    }
  }, [
    processedResults,
    debouncedSearchTerm,
    quickSearchType,
    searchError,
    onSearchResults,
  ]);

  // 🔄 Effect to notify parent of search term changes
  useEffect(() => {
    if (onSearchTermChange) {
      onSearchTermChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearchTermChange]);

  // Handle genre filter change
  const handleGenreChange = useCallback((genreId) => {
    setSelectedGenre(genreId);
    setQuickSearchType(null); // Clear quick search when filtering
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sortOption) => {
    setSortBy(sortOption);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedGenre("all");
    setSortBy("relevance");
    setQuickSearchType(null);
  }, []);

  // Handle form submit
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setQuickSearchType(null); // Clear quick search type when manually searching
    // debouncedSearchTerm will automatically trigger search
  }, []);

  // Handle quick search
  const handleQuickSearch = useCallback((type) => {
    setQuickSearchType(type);
    setSearchTerm(""); // Clear search term for quick searches

    // Set appropriate sorting for quick search types
    switch (type) {
      case "recent":
        setSortBy("recent");
        break;
      case "popular":
        setSortBy("relevance");
        break;
      case "top-rated":
        setSortBy("rating");
        break;
    }
  }, []);

  // Quick search buttons configuration
  const quickSearches = useMemo(
    () => [
      {
        label: "Sách mới",
        type: "recent",
        active: quickSearchType === "recent",
      },
      {
        label: "Phổ biến",
        type: "popular",
        active: quickSearchType === "popular",
      },
      {
        label: "Cao điểm",
        type: "top-rated",
        active: quickSearchType === "top-rated",
      },
    ],
    [quickSearchType]
  );

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {/* Main Search Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={placeholder}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            loading={isLoading}
            variant="primary"
            className="px-6"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Tìm kiếm
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thể loại
              </label>
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="all">Tất cả thể loại</option>
                {genres.map((genre) => (
                  <option
                    key={genre.genreId || genre.id}
                    value={genre.genreId || genre.id}
                  >
                    {genre.genreName || genre.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp theo
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="relevance">Độ liên quan</option>
                <option value="title">Tên sách (A-Z)</option>
                <option value="author">Tác giả (A-Z)</option>
                <option value="year">Năm xuất bản</option>
                <option value="rating">Đánh giá cao</option>
                <option value="recent">Mới nhất</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                type="button"
                onClick={clearFilters}
                variant="secondary"
                size="sm"
                className="w-full"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        )}

        {/* Quick Search Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-sm text-gray-600 self-center mr-2">
            Tìm nhanh:
          </span>
          {quickSearches.map((quick, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleQuickSearch(quick.type)}
              disabled={isLoading}
              className={`px-3 py-1 text-xs rounded-full transition-colors disabled:opacity-50 ${
                quick.active
                  ? "bg-blue-100 text-blue-700 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {quick.label}
            </button>
          ))}
        </div>
      </form>

      {/* Search Status & Results Info */}
      <div className="mt-4">
        {isLoading && (
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
            Đang tìm kiếm...
          </div>
        )}

        {searchError && (
          <div className="flex items-center text-sm text-red-600">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {searchError.message || "Có lỗi xảy ra khi tìm kiếm"}
          </div>
        )}

        {!isLoading && processedResults && (
          <div className="text-sm text-gray-600">
            Tìm thấy{" "}
            <span className="font-medium">{processedResults.length}</span> kết
            quả
            {debouncedSearchTerm && <span> cho "{debouncedSearchTerm}"</span>}
            {quickSearchType && (
              <span>
                {" "}
                - {quickSearches.find((q) => q.type === quickSearchType)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 🆕 Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div>Search term: "{debouncedSearchTerm}"</div>
          <div>Quick search: {quickSearchType || "none"}</div>
          <div>Genre filter: {selectedGenre}</div>
          <div>Sort by: {sortBy}</div>
          <div>Results: {processedResults?.length || 0}</div>
          <div>Loading: {isLoading.toString()}</div>
        </div>
      )}
    </div>
  );
};

// 🔄 Updated simplified search component
export const SimpleBookSearch = ({
  onSearch,
  placeholder = "Tìm kiếm sách...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchTerm);
      }
    },
    [searchTerm, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="text"
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" variant="primary" size="sm">
        <svg
          className="w-4 h-4"
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
      </Button>
    </form>
  );
};

export default BookSearch;
