import React, { useState } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/index";

const BookCard = ({
  book,
  onBookClick,
  showAddButton = true,
  showProgress = false,
  className = "",
}) => {
  const { isAuthenticated } = useAuth();

  // 🔄 Local state for UI
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // ✅ Helper functions to handle API field names
  const getBookId = () => book?.BookId || book?.bookId || book?.id;
  const getBookTitle = () => book?.Title || book?.title;
  const getAuthorName = () => {
    // Since we don't have author details from API, we'll handle this later
    // For now, just show "Unknown Author"
    return book?.author?.name || book?.Author?.Name || "Unknown Author";
  };

  const handleAddToLibrary = async (e) => {
    e.stopPropagation(); // Prevent card click

    if (!isAuthenticated) {
      // Redirect to login or show login modal
      window.location.href = "/login";
      return;
    }

    setIsAdding(true);

    try {
      // TODO: Implement add to library API call
      console.log("Adding book to library:", getBookId());

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 2000);
    } catch (error) {
      console.error("Failed to add book:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleCardClick = () => {
    if (onBookClick) {
      onBookClick(book);
    } else {
      // Default: navigate to book detail page
      window.location.href = `/book/${getBookId()}`;
    }
  };

  // Default image if no cover
  const defaultCover =
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop";
  const bookCover = book?.coverImageUrl || book?.CoverImageUrl || defaultCover;

  // Calculate rating display
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-fill-${getBookId() || i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-fill-${getBookId() || i})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  // Don't render if no book data
  if (!book || !getBookTitle()) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer overflow-hidden ${className}`}
      onClick={handleCardClick}
    >
      {/* Book Cover */}
      <div className="relative h-64 bg-gray-100">
        <img
          src={bookCover}
          alt={getBookTitle()}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultCover;
          }}
        />

        {/* Genre Badge - simplified for now */}
        {book?.GenreId && (
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Genre {book.GenreId}
            </span>
          </div>
        )}

        {/* Publication Year */}
        {book?.PublicationYear && (
          <div className="absolute top-2 right-2">
            <span className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              {book.PublicationYear}
            </span>
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
          {getBookTitle()}
        </h3>

        {/* Author */}
        <p className="text-gray-600 text-sm mb-2">bởi {getAuthorName()}</p>

        {/* Rating - simplified for now */}
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(book?.AverageRating || book?.averageRating || 0)}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            (
            {(book?.AverageRating || book?.averageRating || 0).toFixed?.(1) ||
              "N/A"}
            )
          </span>
        </div>

        {/* Description */}
        {(book?.Description || book?.description) && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {book.Description || book.description}
          </p>
        )}

        {/* Reading Progress (if in user's library) */}
        {showProgress &&
          (book?.ReadingProgress !== undefined ||
            book?.readingProgress !== undefined) && (
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Tiến độ đọc</span>
                <span>{book?.ReadingProgress || book?.readingProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${book?.ReadingProgress || book?.readingProgress}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

        {/* Page Count */}
        {(book?.PageCount || book?.pageCount) && (
          <p className="text-xs text-gray-500 mb-3">
            {book.PageCount || book.pageCount} trang
          </p>
        )}

        {/* ISBN */}
        {book?.Isbn13 && (
          <p className="text-xs text-gray-500 mb-3">ISBN: {book.Isbn13}</p>
        )}

        {/* Add to Library Button */}
        {showAddButton && (
          <div className="mt-auto">
            {/* Success message */}
            {showSuccessMessage && (
              <div className="flex items-center justify-center text-green-600 text-sm font-medium mb-2 animate-pulse">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Đã thêm thành công!
              </div>
            )}

            <Button
              onClick={handleAddToLibrary}
              loading={isAdding}
              disabled={isAdding}
              variant="primary"
              size="sm"
              className="w-full"
            >
              {isAdding ? "Đang thêm..." : "Thêm vào thư viện"}
            </Button>
          </div>
        )}
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-2 bg-gray-100 text-xs text-gray-600 border-t">
          <div>ID: {getBookId()}</div>
          <div>Title: {getBookTitle()}</div>
          <div>AuthorId: {book?.AuthorId}</div>
          <div>GenreId: {book?.GenreId}</div>
        </div>
      )}
    </div>
  );
};

export default BookCard;
