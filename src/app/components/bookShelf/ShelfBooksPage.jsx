import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooksByShelf } from "../../../services/bookshelfService";
import {
  useUpdateBookStatus,
  useRemoveBookFromLibrary,
  useMoveBookToShelf,
  useMyShelves,
} from "../../hooks/index";

const ShelfBooksPage = () => {
  const { shelfId } = useParams();
  const [actioningBookId, setActioningBookId] = useState(null);
  const queryClient = useQueryClient();

  // Use React Query with the actual API service
  const {
    data: booksInShelf,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booksByShelf", parseInt(shelfId)],
    queryFn: () => getBooksByShelf(shelfId),
    enabled: !!shelfId,
  });

  const { data: allShelves } = useMyShelves();
  const updateStatusMutation = useUpdateBookStatus();
  const removeBookMutation = useRemoveBookFromLibrary();
  const moveBookMutation = useMoveBookToShelf();

  // Reading statuses for BookCard
  const readingStatuses = [
    { StatusId: 1, StatusName: "Muốn đọc" },
    { StatusId: 2, StatusName: "Đang đọc" },
    { StatusId: 3, StatusName: "Đã đọc" },
  ];

  // Get current shelf info from the first book
  const currentShelf =
    booksInShelf && booksInShelf.length > 0
      ? {
          ShelfId: booksInShelf[0].ShelfId,
          ShelfName: booksInShelf[0].ShelfName,
          Description: null,
          IsDefault: false,
        }
      : allShelves?.find((shelf) => shelf.ShelfId === parseInt(shelfId));

  const handleUpdateStatus = async (bookId, newStatusId) => {
    try {
      setActioningBookId(bookId);

      const queryKey = ["booksByShelf", parseInt(shelfId)];
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return old.map((book) =>
          book.BookId === bookId ? { ...book, StatusId: newStatusId } : book
        );
      });

      await updateStatusMutation.mutateAsync({ bookId, newStatusId });

      await queryClient.invalidateQueries({
        queryKey: ["booksByShelf", parseInt(shelfId)],
        exact: true,
      });

      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
      queryClient.invalidateQueries({ queryKey: ["myShelves"] });

      await queryClient.refetchQueries({
        queryKey: ["booksByShelf", parseInt(shelfId)],
        exact: true,
      });
    } catch (error) {
      console.error("Update status error:", error);
      if (previousData) {
        queryClient.setQueryData(
          ["booksByShelf", parseInt(shelfId)],
          previousData
        );
      }
    } finally {
      setActioningBookId(null);
    }
  };

  const handleRemoveBook = async (bookId, bookTitle) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa "${bookTitle}" khỏi thư viện?`)) {
      return;
    }

    try {
      setActioningBookId(bookId);

      const queryKey = ["booksByShelf", parseInt(shelfId)];
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return old.filter((book) => book.BookId !== bookId);
      });

      await removeBookMutation.mutateAsync(bookId);

      await queryClient.invalidateQueries({
        queryKey: ["booksByShelf", parseInt(shelfId)],
        exact: true,
      });

      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
      queryClient.invalidateQueries({ queryKey: ["myShelves"] });

      await queryClient.refetchQueries({
        queryKey: ["booksByShelf", parseInt(shelfId)],
        exact: true,
      });
    } catch (error) {
      console.error("Remove book error:", error);
      if (previousData) {
        queryClient.setQueryData(
          ["booksByShelf", parseInt(shelfId)],
          previousData
        );
      }
    } finally {
      setActioningBookId(null);
    }
  };

  if (!currentShelf) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Kệ sách không tồn tại
          </h1>
          <Link
            to="/bookshelf"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay về thư viện
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Trang chủ
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/bookshelf" className="text-gray-500 hover:text-gray-700">
              Thư viện
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {currentShelf.ShelfName}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl border-2 border-white/30">
              📚
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {currentShelf.ShelfName}
              </h1>
              {currentShelf.Description && (
                <p className="text-xl text-blue-100 opacity-90">
                  {currentShelf.Description}
                </p>
              )}
              {currentShelf.IsDefault && (
                <div className="inline-flex items-center mt-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Kệ hệ thống
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-2 left-2"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-bounce">📚</span>
              </div>
            </div>
            <p className="text-xl font-semibold text-gray-700">
              Đang tải danh sách sách...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-6">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-1">
                  Có lỗi xảy ra
                </h3>
                <p className="text-red-600 text-lg">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Tổng số sách
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {booksInShelf?.length || 0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Muốn đọc
                    </p>
                    <p className="text-4xl font-bold text-yellow-600">
                      {booksInShelf?.filter((b) => b.StatusId === 1).length ||
                        0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Đang đọc
                    </p>
                    <p className="text-4xl font-bold text-blue-600">
                      {booksInShelf?.filter((b) => b.StatusId === 2).length ||
                        0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">📖</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Đã đọc
                    </p>
                    <p className="text-4xl font-bold text-green-600">
                      {booksInShelf?.filter((b) => b.StatusId === 3).length ||
                        0}
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-3xl">📖</span>
                  Danh sách sách
                </h2>
              </div>

              <div className="p-8">
                {!booksInShelf || booksInShelf.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8 shadow-lg">
                      <span className="text-6xl opacity-50">📚</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      Kệ sách trống
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
                      Chưa có cuốn sách nào trong kệ này. Hãy thêm sách để bắt
                      đầu xây dựng thư viện!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {booksInShelf.map((book) => (
                      <BookCard
                        key={book.UserBookId}
                        book={book}
                        readingStatuses={readingStatuses}
                        shelves={allShelves}
                        onUpdateStatus={handleUpdateStatus}
                        onRemove={handleRemoveBook}
                        isUpdatingStatus={
                          actioningBookId === book.BookId &&
                          updateStatusMutation.isPending
                        }
                        isRemoving={
                          actioningBookId === book.BookId &&
                          removeBookMutation.isPending
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Use the same BookCard component with FIXED image styling
const BookCard = ({
  book,
  readingStatuses,
  shelves,
  onUpdateStatus,
  onRemove,
  isUpdatingStatus,
  isRemoving,
}) => {
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const navigate = useNavigate();

  // Constants for reading statuses
  const READING_STATUS = {
    WANT_TO_READ: 1,
    CURRENTLY_READING: 2,
    READ: 3,
  };

  // Check if book allows progress updates
  const canUpdateProgress = () => {
    return book.StatusId === READING_STATUS.CURRENTLY_READING;
  };

  // Get status badge color
  const getStatusBadgeColor = (statusId) => {
    switch (statusId) {
      case 1:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case 2:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case 3:
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Calculate reading progress percentage
  const getProgressPercentage = () => {
    if (book.CurrentPage && book.PageCount && book.CurrentPage > 0) {
      return Math.round((book.CurrentPage / book.PageCount) * 100);
    }

    if (typeof book.ReadingProgress === "number") {
      if (
        book.ReadingProgress === 100 &&
        (!book.CurrentPage || book.CurrentPage === 0)
      ) {
        return 0;
      }
      return book.ReadingProgress;
    }

    return 0;
  };

  const progressPercentage = getProgressPercentage();

  // Get status name
  const statusName =
    readingStatuses?.find((s) => s.StatusId === book.StatusId)?.StatusName ||
    "Unknown";

  // Get shelf name
  const shelfName = book.ShelfId
    ? shelves?.find((s) => s.ShelfId === book.ShelfId)?.ShelfName ||
      "Unknown Shelf"
    : "Không có kệ";

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col relative">
      {/* Book Cover Section - Fixed Aspect Ratio */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-2xl">
        {book.CoverImageUrl ? (
          <img
            src={book.CoverImageUrl}
            alt={book.BookTitle}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
            onClick={() => navigate(`/books/${book.BookId}`)}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center text-gray-400 ${
            book.CoverImageUrl ? "hidden" : "flex"
          }`}
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-xs font-medium">No Cover</span>
          </div>
        </div>

        {/* Status Badge - Positioned on cover */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
              book.StatusId
            )}`}
          >
            {statusName}
          </span>
        </div>

        {/* Shelf Badge - Positioned on cover */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-gray-700 border border-gray-200 backdrop-blur-sm">
            📚 {shelfName}
          </span>
        </div>
      </div>

      {/* Content Section - Flexible but controlled */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Book Info - Fixed Height */}
        <div className="h-20 mb-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">
            {book.BookTitle}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1">
            {book.AuthorName}
          </p>
          {book.GenreName && (
            <p className="text-xs text-gray-500 line-clamp-1 mt-1">
              {book.GenreName}
            </p>
          )}
        </div>

        {/* Progress Section - Dynamic Height */}
        <div className="mb-4">
          {book.StatusId === READING_STATUS.CURRENTLY_READING && (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-blue-800">
                  Reading Progress
                </span>
                <span className="text-xs font-semibold text-blue-800">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              {book.CurrentPage && book.PageCount && (
                <div className="text-xs text-blue-700">
                  Page {book.CurrentPage} of {book.PageCount}
                </div>
              )}
            </div>
          )}

          {book.StatusId === READING_STATUS.READ && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <div className="flex items-center justify-center">
                <span className="text-green-800 text-xs font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Completed{" "}
                  {book.FinishDate ? `on ${formatDate(book.FinishDate)}` : ""}
                </span>
              </div>
            </div>
          )}

          {book.StatusId === READING_STATUS.WANT_TO_READ && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <div className="flex items-center justify-center">
                <span className="text-amber-800 text-xs font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Want to Read
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dates Section - Fixed Height */}
        <div className="h-12 mb-4">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Added:</span>
              <span className="font-medium">{formatDate(book.DateAdded)}</span>
            </div>
            {book.StartDate && (
              <div className="flex justify-between">
                <span>Started:</span>
                <span className="font-medium">
                  {formatDate(book.StartDate)}
                </span>
              </div>
            )}
            {book.FinishDate && (
              <div className="flex justify-between">
                <span>Finished:</span>
                <span className="font-medium">
                  {formatDate(book.FinishDate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section - Fixed Height */}
        {book.Notes && (
          <div className="h-12 mb-4">
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
              <p className="text-xs text-gray-600 line-clamp-2">
                <span className="text-gray-400">💭</span> {book.Notes}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons - Fixed at bottom */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            {/* Status Update Button */}
            <div className="dropdown flex-1">
              <label
                tabIndex={0}
                className="text-gray-700 btn btn-sm btn-outline w-full text-xs normal-case font-medium"
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5 mr-1"
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
                    Status
                  </>
                )}
              </label>
              {!isUpdatingStatus && (
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow-lg bg-white rounded-lg w-48 z-50 border border-gray-200"
                >
                  {readingStatuses?.map((status) => (
                    <li key={status.StatusId}>
                      <a
                        onClick={() =>
                          onUpdateStatus(book.BookId, status.StatusId)
                        }
                        className={`text-xs ${
                          book.StatusId === status.StatusId
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {status.StatusName}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemove(book.BookId, book.BookTitle)}
              className="btn btn-sm btn-ghost text-red-600 hover:bg-red-50 p-2"
              disabled={isRemoving}
            >
              {isRemoving ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelfBooksPage;
