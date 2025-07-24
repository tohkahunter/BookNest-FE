import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookById } from "../../../services/bookService";
import { getAuthorById } from "../../../services/authorService";
import { genreService } from "../../../services/genreService";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import "./styles/BookDetail.css";
import ReviewSection from "../../components/review/ReviewSection";

import {
  useBookInLibrary,
  useAddBookToLibrary,
  useUpdateBookStatus,
  useReadingStatuses,
  useMyShelves,
} from "../../hooks/index";
import { toast } from "react-hot-toast";

function BookDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // State for interactive features
  const [userRating, setUserRating] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFollowingAuthor, setIsFollowingAuthor] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(""); // State để kiểm soát <select>

  // Fetch book data
  const {
    data: book,
    isLoading: isBookLoading,
    error: bookError,
  } = useQuery({
    queryKey: QUERY_KEYS.BOOK(id),
    queryFn: () => getBookById(id),
    enabled: !!id,
  });

  // Fetch author data
  const { data: author, isLoading: isAuthorLoading } = useQuery({
    queryKey: QUERY_KEYS.AUTHOR(book?.AuthorId),
    queryFn: () => getAuthorById(book?.AuthorId),
    enabled: !!book?.AuthorId,
  });

  // Fetch genre data
  const { data: genre, isLoading: isGenreLoading } = useQuery({
    queryKey: QUERY_KEYS.GENRE(book?.GenreId),
    queryFn: () => genreService.getGenreById(book?.GenreId),
    enabled: !!book?.GenreId,
  });

  // Library integration hooks
  const { data: bookInLibrary, isLoading: isCheckingLibrary } =
    useBookInLibrary(id);
  const { data: readingStatuses } = useReadingStatuses();
  const { data: shelves } = useMyShelves();
  const addBookMutation = useAddBookToLibrary();
  const updateStatusMutation = useUpdateBookStatus();

  // Đồng bộ selectedStatus với bookInLibrary
  useEffect(() => {
    if (
      !isCheckingLibrary &&
      bookInLibrary?.Exists &&
      bookInLibrary.UserBook?.StatusId
    ) {
      setSelectedStatus(bookInLibrary.UserBook.StatusId);
      console.log("🔍 Synced selectedStatus:", bookInLibrary.UserBook.StatusId);
    } else if (!isCheckingLibrary) {
      setSelectedStatus("");
      console.log("🔍 No status found, resetting selectedStatus");
    }
  }, [bookInLibrary, isCheckingLibrary]);

  // Enhanced add to library handler
  const handleAddToLibrary = async ({ statusId, shelfId }) => {
    try {
      await addBookMutation.mutateAsync({
        bookId: parseInt(id),
        statusId: statusId,
        shelfId: shelfId,
      });

      toast.success("Sách đã được thêm vào thư viện!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOK_IN_LIBRARY(id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAN_REVIEW(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_REVIEW(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_REVIEWS(id) });
    } catch (error) {
      console.error("Add book error:", error);
      toast.error("Có lỗi khi thêm sách vào thư viện");
    }
  };

  // Enhanced update status handler
  const handleUpdateStatus = async (newStatusId) => {
    try {
      setSelectedStatus(newStatusId); // Cập nhật UI ngay lập tức
      await updateStatusMutation.mutateAsync({
        bookId: parseInt(id),
        newStatusId: newStatusId,
      });

      toast.success("Đã cập nhật trạng thái sách!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.BOOK_IN_LIBRARY(id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CAN_REVIEW(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_REVIEW(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOOK_REVIEWS(id) });
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Có lỗi khi cập nhật trạng thái");
      setSelectedStatus(bookInLibrary?.UserBook?.StatusId || "");
    }
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
    // TODO: Implement API call to save user rating
  };

  const handleFollowAuthor = () => {
    setIsFollowingAuthor(!isFollowingAuthor);
    // TODO: Implement API call to follow/unfollow author
  };

  // Get status configuration for styling
  const getStatusConfig = (statusId) => {
    switch (statusId) {
      case 1:
        return {
          color: "bg-yellow-500 hover:bg-yellow-600",
          icon: "📝",
          label: "Want to read",
        };
      case 2:
        return {
          color: "bg-blue-500 hover:bg-blue-600",
          icon: "📖",
          label: "Currently reading",
        };
      case 3:
        return {
          color: "bg-green-500 hover:bg-green-600",
          icon: "✅",
          label: "Read",
        };
      default:
        return {
          color: "bg-gray-500 hover:bg-gray-600",
          icon: "❓",
          label: "Unknown",
        };
    }
  };

  // Loading state
  if (isBookLoading) {
    return (
      <div className="min-h-screen bg-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (bookError) {
    return (
      <div className="min-h-screen bg-white-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Book Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The book you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if no book data
  if (!book) return null;

  const truncatedDescription =
    book.Description && book.Description.length > 300
      ? book.Description.slice(0, 300) + "..."
      : book.Description;

  const displayRating = book.AverageRating || 0;
  const displayReviewCount = book.ReviewCount || 0;

  return (
    <div className="min-h-screen bg-white-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 w-80">
              {/* Book Cover */}
              <div className="mb-6">
                <div className="w-full max-w-sm mx-auto sticky top-4">
                  <img
                    src={book.CoverImageUrl}
                    alt={book.Title}
                    className="w-full rounded-xl shadow-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = `
                        <div class="w-full h-96 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-lg flex items-center justify-center text-white text-center p-4">
                          <div>
                            <h3 class="text-3xl font-bold mb-2">${
                              book.Title
                            }</h3>
                            <p class="text-sm opacity-80">${
                              book.AuthorName || "Unknown Author"
                            }</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>

              {/* Reading Actions */}
              <div className="rounded-lg p-4 space-y-4 text-center">
                {isCheckingLibrary ? (
                  // Loading state
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-full h-8 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ) : !bookInLibrary?.Exists ? (
                  // Book NOT in library - Show Add form
                  <AddToLibraryForm
                    onAdd={handleAddToLibrary}
                    isAdding={addBookMutation.isPending}
                    readingStatuses={readingStatuses}
                    shelves={shelves}
                  />
                ) : (
                  // Book IN library - Show current status and update options
                  <div className="space-y-4">
                    {/* Current Status Display */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-center gap-2 text-green-800">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium">
                          Đã có trong thư viện
                        </span>
                      </div>
                    </div>

                    {/* Current Status */}
                    {bookInLibrary.UserBook && (
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">
                          Trạng thái hiện tại:
                        </p>
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                            getStatusConfig(bookInLibrary.UserBook.StatusId)
                              .color
                          } text-white font-medium`}
                        >
                          <span>
                            {
                              getStatusConfig(bookInLibrary.UserBook.StatusId)
                                .icon
                            }
                          </span>
                          <span>
                            {
                              getStatusConfig(bookInLibrary.UserBook.StatusId)
                                .label
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Update Status Dropdown */}
                    <div className="space-y-2">
                      <label className=" text-sm font-medium text-gray-700">
                        Update Status:
                      </label>
                      {isCheckingLibrary ? (
                        <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      ) : (
                        <select
                          value={selectedStatus}
                          onChange={(e) =>
                            handleUpdateStatus(parseInt(e.target.value))
                          }
                          disabled={updateStatusMutation.isPending}
                          className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                        >
                          <option value="" disabled>
                            {updateStatusMutation.isPending
                              ? "Updating..."
                              : "Select new status"}
                          </option>
                          {readingStatuses?.map((status) => (
                            <option
                              key={status.StatusId}
                              value={status.StatusId}
                            >
                              {getStatusConfig(status.StatusId).label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-2 border-t border-gray-200">
                      <Link
                        to="/bookshelf"
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline"
                      >
                        📚 Xem trong thư viện
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Book Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Info */}
            <div className="bg-white rounded-lg p-6">
              <h1 className="text-5xl text-gray-900 mb-2">{book.Title}</h1>
              <p className="text-gray-600 mb-4">
                by{" "}
                <Link
                  to={`/authors/${book.AuthorId}`}
                  className="text-orange-600 text-2xl hover:text-orange-700 hover:underline font-medium"
                >
                  {book.AuthorName ||
                    (isAuthorLoading ? "Loading..." : "Unknown Author")}
                </Link>
              </p>

              {/* Rating Display */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-4xl ${
                        star <= Math.floor(displayRating)
                          ? "text-orange-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-3xl font-bold text-gray-900">
                  {displayRating.toFixed(2)}
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-600">
                  {displayReviewCount.toLocaleString()} ratings
                </span>
              </div>
            </div>

            {/* Description */}
            {book.Description && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {showFullDescription
                    ? book.Description
                    : truncatedDescription}
                </p>
                {book.Description.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-orange-600 hover:text-orange-700 font-medium hover:underline"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}

            {/* Genre */}
            {genre && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Genre
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/genre/${genre.GenreId}`}
                    className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors duration-200"
                  >
                    {genre.GenreName}
                  </Link>
                </div>
                {genre.Description && (
                  <p className="text-gray-600 text-sm mt-2">
                    {genre.Description}
                  </p>
                )}
              </div>
            )}

            {/* Book Details */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Book Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.PageCount && (
                  <div>
                    <span className="font-medium text-gray-600">Pages:</span>
                    <span className="ml-2 text-gray-900">{book.PageCount}</span>
                  </div>
                )}
                {book.PublicationYear && (
                  <div>
                    <span className="font-medium text-gray-600">
                      Published:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {book.PublicationYear}
                    </span>
                  </div>
                )}
                {book.Isbn13 && (
                  <div>
                    <span className="font-medium text-gray-600">ISBN:</span>
                    <span className="ml-2 text-gray-900">{book.Isbn13}</span>
                  </div>
                )}
                {book.CreatedAt && (
                  <div>
                    <span className="font-medium text-gray-600">Added:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(book.CreatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* About the Author */}
            {!isAuthorLoading && author && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">
                  About the author
                </h3>

                <div className="flex items-start space-x-4 mb-6">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        author.Name
                      )}&background=f97316&color=ffffff&size=64`}
                      alt={author.Name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>

                  {/* Author Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {author.Name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{author.BookCount || 0} books</span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleFollowAuthor}
                      className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 ${
                        isFollowingAuthor
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {isFollowingAuthor ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>

                {/* Author Action Buttons */}
                <div className="flex items-center space-x-4 mt-6 pt-4 border-t border-gray-200">
                  <Link
                    to={`/authors/${author.AuthorId}`}
                    className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                  >
                    View all books by {author.Name}
                  </Link>
                </div>
              </div>
            )}

            {/* Review Section */}
            <ReviewSection bookId={parseInt(id)} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Add to Library Form Component
const AddToLibraryForm = ({ onAdd, isAdding, readingStatuses, shelves }) => {
  const [selectedStatus, setSelectedStatus] = useState(1); // Default: Want to Read
  const [selectedShelf, setSelectedShelf] = useState("");

  const getStatusConfig = (statusId) => {
    switch (statusId) {
      case 1:
        return { color: "bg-yellow-500", icon: "📝", label: "Want to read" };
      case 2:
        return { color: "bg-blue-500", icon: "📖", label: "Currently reading" };
      case 3:
        return { color: "bg-green-500", icon: "✅", label: "Read" };
      default:
        return { color: "bg-gray-500", icon: "❓", label: "Unknown" };
    }
  };

  const currentConfig = getStatusConfig(selectedStatus);

  const handleSubmit = () => {
    onAdd({
      statusId: selectedStatus,
      shelfId: selectedShelf || null,
    });
  };

  return (
    <div className="space-y-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">
        📚 Thêm vào thư viện
      </h4>

      {/* Status Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Trạng thái đọc
        </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
          className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isAdding}
        >
          {readingStatuses?.map((status) => {
            const config = getStatusConfig(status.StatusId);
            return (
              <option
                key={status.StatusId}
                value={status.StatusId}
                className="text-gray-800"
              >
                {config.icon} {config.label}
              </option>
            );
          })}
        </select>
      </div>

      {/* Shelf Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Kệ sách (tùy chọn)
        </label>
        <select
          value={selectedShelf}
          onChange={(e) => setSelectedShelf(e.target.value)}
          className="text-gray-700 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          disabled={isAdding}
        >
          <option value="">🏠 Không chọn kệ</option>
          {shelves?.map((shelf) => (
            <option
              key={shelf.ShelfId}
              value={shelf.ShelfId}
              className="text-gray-800"
            >
              📚 {shelf.ShelfName}
            </option>
          ))}
        </select>
      </div>

      {/* Preview Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-600 mb-2">Tóm tắt lựa chọn:</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium ${currentConfig.color}`}
          >
            {currentConfig.icon} {currentConfig.label}
          </span>
          {selectedShelf && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
              📚{" "}
              {
                shelves?.find((s) => s.ShelfId === parseInt(selectedShelf))
                  ?.ShelfName
              }
            </span>
          )}
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={handleSubmit}
        disabled={isAdding}
        className={`w-full ${currentConfig.color} hover:opacity-90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {isAdding ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Đang thêm vào thư viện...
          </>
        ) : (
          <>
            <span className="text-lg">{currentConfig.icon}</span>
            Thêm vào thư viện
          </>
        )}
      </button>
    </div>
  );
};

export default BookDetail;
