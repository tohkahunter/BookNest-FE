import React from "react";
import BookCard from "./BookCard";
import { BookGridSkeleton } from "../ui/Loading";

const BookGrid = ({
  books = [],
  loading = false,
  error = null,
  emptyMessage = "Không tìm thấy sách nào",
  emptySubMessage = "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc",
  onBookClick,
  showAddButton = true,
  showProgress = false,
  className = "",
  skeletonCount = 8,
  columns = {
    default: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    "2xl": 5,
  },
  // 🆕 React Query specific props
  isRefetching = false,
  onRefresh,
  refetchError = null,
}) => {
  // Generate grid classes based on columns prop
  const getGridClasses = () => {
    const { default: defaultCols, sm, md, lg, xl } = columns;
    return [
      `grid-cols-${defaultCols}`,
      sm && `sm:grid-cols-${sm}`,
      md && `md:grid-cols-${md}`,
      lg && `lg:grid-cols-${lg}`,
      xl && `xl:grid-cols-${xl}`,
      columns["2xl"] && `2xl:grid-cols-${columns["2xl"]}`,
    ]
      .filter(Boolean)
      .join(" ");
  };

  // 🆕 Helper function to get book ID safely
  const getBookId = (book) => {
    // Handle different possible ID field names from API
    return book.bookId || book.id || book.BookId || book.ID;
  };

  // 🆕 Helper function to validate book object
  const isValidBook = (book) => {
    return book && (book.title || book.Title) && getBookId(book);
  };

  // 🆕 Filter out invalid books and add safety checks
  const validBooks = books?.filter(isValidBook) || [];

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        <BookGridSkeleton count={skeletonCount} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          {/* Error Icon */}
          <svg
            className="w-16 h-16 text-red-400 mx-auto mb-4"
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

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>

          <p className="text-gray-600 mb-4">
            {/* 🔄 Better error message handling */}
            {typeof error === "string"
              ? error
              : error?.message || "Không thể tải dữ liệu"}
          </p>

          <div className="space-x-2">
            {/* 🆕 Refresh button using React Query refetch if available */}
            {onRefresh ? (
              <button
                onClick={onRefresh}
                disabled={isRefetching}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isRefetching ? "Đang tải..." : "Thử lại"}
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tải lại trang
              </button>
            )}
          </div>

          {/* 🆕 Show refetch error if different from main error */}
          {refetchError && refetchError !== error && (
            <p className="text-red-500 text-sm mt-2">
              Lỗi khi tải lại: {refetchError.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (!validBooks || validBooks.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          {/* Empty Icon */}
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {emptyMessage}
          </h3>

          <p className="text-gray-600">{emptySubMessage}</p>

          {/* 🆕 Refresh option for empty state too */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefetching}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {isRefetching ? "Đang tải..." : "Tải lại"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Success state - render books
  return (
    <div className={className}>
      {/* Books Count Info with refresh indicator */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600">
          Hiển thị <span className="font-medium">{validBooks.length}</span> cuốn
          sách
          {/* 🆕 Show total count if different from displayed */}
          {books && books.length !== validBooks.length && (
            <span className="text-gray-400 ml-1">
              (của {books.length} tổng cộng)
            </span>
          )}
        </p>

        {/* 🆕 Refresh indicator/button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefetching}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Tải lại dữ liệu"
          >
            <svg
              className={`w-4 h-4 mr-1 ${isRefetching ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isRefetching ? "Đang tải..." : "Tải lại"}
          </button>
        )}
      </div>

      {/* Background refetch indicator */}
      {isRefetching && !loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700 text-sm">
              Đang cập nhật dữ liệu...
            </span>
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div className={`grid gap-6 ${getGridClasses()}`}>
        {validBooks.map((book) => (
          <BookCard
            key={getBookId(book)} // 🔄 Use safe ID getter
            book={book}
            onBookClick={onBookClick}
            showAddButton={showAddButton}
            showProgress={showProgress}
          />
        ))}
      </div>

      {/* 🆕 Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <div>Total books: {books?.length || 0}</div>
          <div>Valid books: {validBooks.length}</div>
          <div>Loading: {loading.toString()}</div>
          <div>Refetching: {isRefetching.toString()}</div>
          {books?.length > 0 && (
            <div>Sample book keys: {Object.keys(books[0]).join(", ")}</div>
          )}
        </div>
      )}
    </div>
  );
};

// 🔄 Updated specialized grids with React Query optimizations
export const FeaturedBooksGrid = ({
  books,
  loading,
  error,
  onBookClick,
  isRefetching,
  onRefresh,
}) => (
  <BookGrid
    books={books}
    loading={loading}
    error={error}
    onBookClick={onBookClick}
    isRefetching={isRefetching}
    onRefresh={onRefresh}
    emptyMessage="Chưa có sách nổi bật"
    emptySubMessage="Hãy quay lại sau để xem sách mới"
    className="mb-12"
    columns={{
      default: 1,
      sm: 2,
      md: 2,
      lg: 3,
      xl: 4,
    }}
  />
);

export const SearchResultsGrid = ({
  books,
  loading,
  error,
  searchTerm,
  onBookClick,
  isRefetching,
  onRefresh,
}) => (
  <BookGrid
    books={books}
    loading={loading}
    error={error}
    onBookClick={onBookClick}
    isRefetching={isRefetching}
    onRefresh={onRefresh}
    emptyMessage={`Không tìm thấy sách với từ khóa "${searchTerm}"`}
    emptySubMessage="Thử tìm kiếm với từ khóa khác"
    className="mt-6"
  />
);

export const UserLibraryGrid = ({
  books,
  loading,
  error,
  onBookClick,
  isRefetching,
  onRefresh,
}) => (
  <BookGrid
    books={books}
    loading={loading}
    error={error}
    onBookClick={onBookClick}
    isRefetching={isRefetching}
    onRefresh={onRefresh}
    showAddButton={false} // Don't show add button in user's library
    showProgress={true} // Show reading progress
    emptyMessage="Thư viện của bạn còn trống"
    emptySubMessage="Hãy thêm sách vào thư viện để bắt đầu đọc"
    className="mt-6"
  />
);

export const AuthorBooksGrid = ({
  books,
  loading,
  error,
  authorName,
  onBookClick,
  isRefetching,
  onRefresh,
}) => (
  <BookGrid
    books={books}
    loading={loading}
    error={error}
    onBookClick={onBookClick}
    isRefetching={isRefetching}
    onRefresh={onRefresh}
    emptyMessage={`${authorName} chưa có sách nào`}
    emptySubMessage="Thông tin có thể được cập nhật sau"
    className="mt-6"
  />
);

// Compact grid for sidebars or smaller spaces
export const CompactBookGrid = ({
  books,
  loading,
  error,
  maxItems = 4,
  onBookClick,
  isRefetching,
  onRefresh,
}) => (
  <BookGrid
    books={books?.slice(0, maxItems)}
    loading={loading}
    error={error}
    onBookClick={onBookClick}
    isRefetching={isRefetching}
    onRefresh={onRefresh}
    skeletonCount={4}
    columns={{
      default: 1,
      sm: 2,
      md: 2,
      lg: 2,
    }}
    className="space-y-4"
  />
);

export default BookGrid;
