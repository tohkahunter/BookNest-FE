// src/app/components/bookShelf/ShelfBooksModal.jsx
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useBooksByShelf,
  useUpdateBookStatus,
  useRemoveBookFromLibrary,
  useMoveBookToShelf,
  useMyShelves,
} from "../../hooks/index";

const ShelfBooksModal = ({ isOpen, onClose, shelf }) => {
  const [actioningBookId, setActioningBookId] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: booksInShelf,
    isLoading,
    error,
  } = useBooksByShelf(shelf?.ShelfId);
  const { data: allShelves } = useMyShelves();
  const updateStatusMutation = useUpdateBookStatus();
  const removeBookMutation = useRemoveBookFromLibrary();
  const moveBookMutation = useMoveBookToShelf();

  const handleUpdateStatus = async (bookId, newStatusId) => {
    try {
      setActioningBookId(bookId);

      // 🚀 Optimistic update - Update UI immediately
      const queryKey = ["booksByShelf", shelf?.ShelfId];
      const previousData = queryClient.getQueryData(queryKey);

      // Update cache immediately
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return old.map((book) =>
          book.BookId === bookId ? { ...book, StatusId: newStatusId } : book
        );
      });

      // Make the actual API call
      await updateStatusMutation.mutateAsync({ bookId, newStatusId });

      // Force refresh current shelf data to ensure UI sync
      await queryClient.invalidateQueries({
        queryKey: ["booksByShelf", shelf?.ShelfId],
        exact: true,
      });

      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
      queryClient.invalidateQueries({ queryKey: ["myShelves"] });

      // Refetch current shelf data immediately
      await queryClient.refetchQueries({
        queryKey: ["booksByShelf", shelf?.ShelfId],
        exact: true,
      });
    } catch (error) {
      console.error("Update status error:", error);

      // 🔄 Revert optimistic update on error
      if (previousData) {
        queryClient.setQueryData(
          ["booksByShelf", shelf?.ShelfId],
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

      // 🚀 Optimistic update - Remove book immediately
      const queryKey = ["booksByShelf", shelf?.ShelfId];
      const previousData = queryClient.getQueryData(queryKey);

      // Remove book from cache immediately
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return old.filter((book) => book.BookId !== bookId);
      });

      // Make the actual API call
      await removeBookMutation.mutateAsync(bookId);

      // Force refresh current shelf data
      await queryClient.invalidateQueries({
        queryKey: ["booksByShelf", shelf?.ShelfId],
        exact: true,
      });

      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
      queryClient.invalidateQueries({ queryKey: ["myShelves"] });

      // Refetch current shelf data immediately
      await queryClient.refetchQueries({
        queryKey: ["booksByShelf", shelf?.ShelfId],
        exact: true,
      });
    } catch (error) {
      console.error("Remove book error:", error);

      // 🔄 Revert optimistic update on error
      if (previousData) {
        queryClient.setQueryData(
          ["booksByShelf", shelf?.ShelfId],
          previousData
        );
      }
    } finally {
      setActioningBookId(null);
    }
  };

  const handleMoveBook = async (bookId, newShelfId) => {
    try {
      setActioningBookId(bookId);

      // 🚀 Optimistic update - Remove book from current shelf immediately
      const queryKey = ["booksByShelf", shelf?.ShelfId];
      const previousData = queryClient.getQueryData(queryKey);

      // Remove book from current shelf in cache immediately
      queryClient.setQueryData(queryKey, (old) => {
        if (!old) return old;
        return old.filter((book) => book.BookId !== bookId);
      });

      // Make the actual API call
      await moveBookMutation.mutateAsync({ bookId, newShelfId });

      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["myBooks"] });
      queryClient.invalidateQueries({ queryKey: ["myShelves"] });
      queryClient.invalidateQueries({ queryKey: ["booksByShelf"] }); // Refresh all shelf data
    } catch (error) {
      console.error("Move book error:", error);

      // 🔄 Revert optimistic update on error
      if (previousData) {
        queryClient.setQueryData(
          ["booksByShelf", shelf?.ShelfId],
          previousData
        );
      }
    } finally {
      setActioningBookId(null);
    }
  };

  if (!isOpen || !shelf) return null;

  return (
    <div className="modal modal-open bg-black/70 backdrop-blur-md">
      <div className="modal-box w-11/12 max-w-7xl h-[90vh] p-0 bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-2xl border-2 border-white/20 rounded-3xl overflow-hidden flex flex-col">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600"></div>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
          <div className="relative px-8 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-18 h-18 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl border-2 border-white/30 shadow-xl">
                  📚
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-3 drop-shadow-lg">
                    {shelf.ShelfName}
                  </h1>
                  {shelf.Description && (
                    <p className="text-blue-100 text-xl opacity-90 drop-shadow-sm">
                      {shelf.Description}
                    </p>
                  )}
                  {shelf.IsDefault && (
                    <div className="inline-flex items-center mt-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold border border-white/30 shadow-lg">
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
              <button
                onClick={onClose}
                className="w-14 h-14 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all duration-300 border border-white/30 hover:scale-105 group shadow-lg"
              >
                <svg
                  className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blue-200 rounded-full animate-spin"></div>
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-2 left-2"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl animate-bounce">📖</span>
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-700">
                Đang tải danh sách sách...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mx-8 mt-8">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-3xl p-8 shadow-lg">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-6 shadow-md">
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
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !error && (
            <>
              {/* Enhanced Stats Dashboard */}
              <div className="px-8 py-6">
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Tổng số sách
                        </p>
                        <p className="text-4xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                          {booksInShelf?.length || 0}
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
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

                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Muốn đọc
                        </p>
                        <p className="text-4xl font-bold text-yellow-600 group-hover:scale-110 transition-transform duration-300">
                          {booksInShelf?.filter((b) => b.StatusId === 1)
                            .length || 0}
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-2xl">📝</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Đang đọc
                        </p>
                        <p className="text-4xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">
                          {booksInShelf?.filter((b) => b.StatusId === 2)
                            .length || 0}
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-2xl">📖</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">
                          Đã đọc
                        </p>
                        <p className="text-4xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">
                          {booksInShelf?.filter((b) => b.StatusId === 3)
                            .length || 0}
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Books Grid */}
              <div className="px-8 pb-8">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="text-3xl">📖</span>
                      Danh sách sách
                    </h2>
                  </div>

                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {!booksInShelf || booksInShelf.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8 shadow-lg">
                          <span className="text-6xl opacity-50">📚</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-4">
                          Kệ sách trống
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
                          Chưa có cuốn sách nào trong kệ này. Hãy thêm sách để
                          bắt đầu xây dựng thư viện!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {booksInShelf.map((book) => (
                          <BookCard
                            key={book.UserBookId}
                            book={book}
                            allShelves={allShelves}
                            currentShelf={shelf}
                            onUpdateStatus={handleUpdateStatus}
                            onRemoveBook={handleRemoveBook}
                            onMoveBook={handleMoveBook}
                            isActioning={actioningBookId === book.BookId}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #1e40af);
          }
        `}</style>
      </div>
    </div>
  );
};

// Enhanced Book Card Component
const BookCard = ({
  book,
  allShelves,
  currentShelf,
  onUpdateStatus,
  onRemoveBook,
  onMoveBook,
  isActioning,
}) => {
  const getStatusConfig = (statusId) => {
    switch (statusId) {
      case 1:
        return {
          gradient: "from-yellow-400 to-amber-500",
          bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
          text: "text-yellow-800",
          name: "Muốn đọc",
          icon: "📝",
          border: "border-yellow-200",
        };
      case 2:
        return {
          gradient: "from-blue-400 to-blue-600",
          bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
          text: "text-blue-800",
          name: "Đang đọc",
          icon: "📖",
          border: "border-blue-200",
        };
      case 3:
        return {
          gradient: "from-green-400 to-emerald-500",
          bg: "bg-gradient-to-br from-green-50 to-emerald-50",
          text: "text-green-800",
          name: "Đã đọc",
          icon: "✅",
          border: "border-green-200",
        };
      default:
        return {
          gradient: "from-gray-400 to-gray-500",
          bg: "bg-gray-50",
          text: "text-gray-700",
          name: "Không xác định",
          icon: "❓",
          border: "border-gray-200",
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getProgressPercentage = () => {
    if (book.ReadingProgress) return book.ReadingProgress;
    if (book.CurrentPage && book.PageCount) {
      return Math.round((book.CurrentPage / book.PageCount) * 100);
    }
    return 0;
  };

  const progressPercentage = getProgressPercentage();
  const statusConfig = getStatusConfig(book.StatusId);

  return (
    <div
      className={`group bg-white rounded-3xl ${statusConfig.border} border-2 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6">
        {/* Header with cover and basic info */}
        <div className="flex gap-4 mb-6">
          <div className="relative shrink-0">
            <div className="w-20 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg ring-2 ring-white/50">
              {book.CoverImageUrl ? (
                <img
                  src={book.CoverImageUrl}
                  alt={book.BookTitle}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full flex items-center justify-center text-gray-400 text-2xl ${
                  book.CoverImageUrl ? "hidden" : "flex"
                }`}
              >
                📖
              </div>
            </div>
            {/* Status indicator */}
            <div
              className={`absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br ${statusConfig.gradient} rounded-full flex items-center justify-center shadow-lg ring-3 ring-white`}
            >
              <span className="text-white text-lg">{statusConfig.icon}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
              {book.BookTitle}
            </h3>
            <p className="text-gray-600 font-semibold mb-2 text-lg">
              {book.AuthorName}
            </p>
            {book.GenreName && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                {book.GenreName}
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Status Badge */}
        <div
          className={`inline-flex items-center gap-3 px-4 py-3 ${statusConfig.bg} ${statusConfig.text} rounded-2xl font-semibold text-sm mb-6 shadow-sm`}
        >
          <span className="text-lg">{statusConfig.icon}</span>
          <span>{statusConfig.name}</span>
        </div>

        {/* Progress for currently reading */}
        {book.StatusId === 2 && progressPercentage > 0 && (
          <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <span>📊</span>
                Tiến độ đọc
              </span>
              <span className="text-lg font-bold text-blue-900 bg-white px-3 py-1 rounded-full shadow-sm">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Dates */}
        {(book.StartDate || book.FinishDate) && (
          <div className="flex flex-wrap gap-3 mb-6">
            {book.StartDate && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-800 text-sm font-medium rounded-xl border border-green-100">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" />
                </svg>
                Bắt đầu: {formatDate(book.StartDate)}
              </div>
            )}
            {book.FinishDate && (
              <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-800 text-sm font-medium rounded-xl border border-purple-100">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Hoàn thành: {formatDate(book.FinishDate)}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {book.Notes && (
          <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-xl">
            <div className="flex gap-3">
              <span className="text-amber-600 text-xl shrink-0">💭</span>
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Ghi chú</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {book.Notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="flex gap-3">
          {/* Status Change */}
          <div className="dropdown dropdown-top">
            <label
              tabIndex={0}
              className="btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none flex-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Trạng thái
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-3 shadow-2xl bg-white rounded-3xl w-80 border-2 border-gray-100 z-50 mb-3"
            >
              <li>
                <a
                  onClick={() => onUpdateStatus(book.BookId, 1)}
                  className="flex items-center p-4 hover:bg-yellow-50 rounded-2xl transition-colors"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Muốn đọc</div>
                    <div className="text-xs text-gray-500">
                      Thêm vào danh sách đọc
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  onClick={() => onUpdateStatus(book.BookId, 2)}
                  className="flex items-center p-4 hover:bg-blue-50 rounded-2xl transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                    <span className="text-xl">📖</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Đang đọc</div>
                    <div className="text-xs text-gray-500">
                      Bắt đầu theo dõi tiến độ
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  onClick={() => onUpdateStatus(book.BookId, 3)}
                  className="flex items-center p-4 hover:bg-green-50 rounded-2xl transition-colors"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Đã đọc</div>
                    <div className="text-xs text-gray-500">
                      Đánh dấu hoàn thành
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Move Shelf */}
          <div className="dropdown dropdown-top dropdown-end">
            <label
              tabIndex={0}
              className="btn bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-none flex-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              Chuyển kệ
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-3 shadow-2xl bg-white rounded-3xl w-80 border-2 border-gray-100 z-50 mb-3 max-h-64 overflow-y-auto"
            >
              <li>
                <a
                  onClick={() => onMoveBook(book.BookId, null)}
                  className="flex items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                    <span className="text-xl">🏠</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Không có kệ</div>
                    <div className="text-xs text-gray-500">
                      Bỏ khỏi tất cả kệ sách
                    </div>
                  </div>
                </a>
              </li>
              {allShelves
                ?.filter((s) => s.ShelfId !== currentShelf.ShelfId)
                .map((shelf) => (
                  <li key={shelf.ShelfId}>
                    <a
                      onClick={() => onMoveBook(book.BookId, shelf.ShelfId)}
                      className="flex items-center p-4 hover:bg-purple-50 rounded-2xl transition-colors"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mr-4 shadow-sm">
                        <span className="text-xl">📚</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          {shelf.ShelfName}
                        </div>
                        {shelf.Description && (
                          <div className="text-xs text-gray-500 truncate">
                            {shelf.Description}
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Delete */}
          <button
            onClick={() => onRemoveBook(book.BookId, book.BookTitle)}
            className="btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none w-16 shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isActioning}
          >
            {isActioning ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShelfBooksModal;
