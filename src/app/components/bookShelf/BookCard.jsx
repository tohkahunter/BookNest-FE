// src/app/components/BookShelf/BookCard.jsx
import React, { useState } from "react";
import ProgressModal from "./ProgressModal";
import { useMoveBookToShelf } from "../../hooks/index";

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
  const [isMoveShelfOpen, setIsMoveShelfOpen] = useState(false);

  // Add move book mutation
  const moveBookMutation = useMoveBookToShelf();

  // Get status badge color
  const getStatusBadgeColor = (statusId) => {
    switch (statusId) {
      case 1:
        return "badge-warning"; // Want to Read - yellow
      case 2:
        return "badge-info"; // Currently Reading - blue
      case 3:
        return "badge-success"; // Read - green
      default:
        return "badge-ghost";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Calculate reading progress percentage
  const getProgressPercentage = () => {
    // Nếu có CurrentPage và PageCount, ưu tiên tính từ page
    if (book.CurrentPage && book.PageCount && book.CurrentPage > 0) {
      return Math.round((book.CurrentPage / book.PageCount) * 100);
    }

    // Nếu không có CurrentPage nhưng có ReadingProgress
    if (typeof book.ReadingProgress === "number") {
      // Fix: Nếu ReadingProgress = 100 nhưng không có CurrentPage hoặc CurrentPage = 0
      // thì có thể backend set sai, reset về 0
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

  // Handle move book to shelf
  const handleMoveToShelf = async (newShelfId) => {
    try {
      await moveBookMutation.mutateAsync({
        bookId: book.BookId,
        newShelfId: newShelfId,
      });
      setIsMoveShelfOpen(false);
    } catch (error) {
      console.error("Move book error:", error);
    }
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

  // Get available shelves (exclude current shelf)
  const availableShelves =
    shelves?.filter((shelf) => shelf.ShelfId !== book.ShelfId) || [];

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow border">
      <figure className="px-4 pt-4">
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {book.CoverImageUrl ? (
            <img
              src={book.CoverImageUrl}
              alt={book.BookTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center text-gray-400 ${
              book.CoverImageUrl ? "hidden" : "flex"
            }`}
          >
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </figure>

      <div className="card-body p-4">
        {/* Book title and author */}
        <div className="mb-3">
          <h3 className="card-title text-base font-semibold line-clamp-2 mb-1">
            {book.BookTitle}
          </h3>
          <p className="text-sm text-gray-600">{book.AuthorName}</p>
          {book.GenreName && (
            <p className="text-xs text-gray-500">{book.GenreName}</p>
          )}
        </div>

        {/* Status badge */}
        <div className="flex justify-between items-center mb-3">
          <div
            className={`badge ${getStatusBadgeColor(book.StatusId)} badge-sm`}
          >
            {statusName}
          </div>
          <div className="text-xs text-gray-500">{shelfName}</div>
        </div>

        {/* Reading progress */}
        {book.StatusId === 2 && ( // Currently Reading
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Tiến độ</span>
              <span>{progressPercentage}%</span>
            </div>
            <progress
              className="progress progress-info w-full h-2"
              value={progressPercentage}
              max="100"
            />
            {book.CurrentPage && book.PageCount && (
              <div className="text-xs text-gray-500 mt-1">
                Trang {book.CurrentPage}/{book.PageCount}
              </div>
            )}
          </div>
        )}

        {/* Dates */}
        <div className="text-xs text-gray-500 mb-3 space-y-1">
          <div>Thêm: {formatDate(book.DateAdded)}</div>
          {book.StartDate && <div>Bắt đầu: {formatDate(book.StartDate)}</div>}
          {book.FinishDate && (
            <div>Hoàn thành: {formatDate(book.FinishDate)}</div>
          )}
        </div>

        {/* Notes preview */}
        {book.Notes && (
          <div className="text-xs text-gray-600 mb-3">
            <p className="line-clamp-2">💭 {book.Notes}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="card-actions justify-between">
          {/* Status update dropdown */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-sm btn-outline">
              {isUpdatingStatus ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Đang cập nhật...
                </>
              ) : (
                <>🔄 Trạng thái</>
              )}
            </label>
            {!isUpdatingStatus && (
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 z-10"
              >
                {readingStatuses?.map((status) => (
                  <li key={status.StatusId}>
                    <a
                      onClick={() =>
                        onUpdateStatus(book.BookId, status.StatusId)
                      }
                      className={
                        book.StatusId === status.StatusId ? "active" : ""
                      }
                    >
                      {status.StatusName}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* More actions dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-sm btn-ghost">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 z-10"
            >
              <li>
                <a onClick={() => setIsProgressModalOpen(true)}>
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Cập nhật tiến độ
                </a>
              </li>

              {/* Move shelf dropdown item */}
              <li>
                <details>
                  <summary className="flex items-center">
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
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    Di chuyển kệ
                    {moveBookMutation.isPending && (
                      <span className="loading loading-spinner loading-xs ml-2"></span>
                    )}
                  </summary>
                  <ul className="p-2 bg-base-200 rounded-md">
                    {/* Option to remove from all shelves */}
                    <li>
                      <a
                        onClick={() => handleMoveToShelf(null)}
                        className="text-sm flex items-center gap-2"
                        disabled={moveBookMutation.isPending}
                      >
                        <span>🏠</span>
                        Không có kệ
                      </a>
                    </li>

                    {/* Available shelves */}
                    {availableShelves.length > 0 ? (
                      availableShelves.map((shelf) => (
                        <li key={shelf.ShelfId}>
                          <a
                            onClick={() => handleMoveToShelf(shelf.ShelfId)}
                            className="text-sm flex items-center gap-2"
                            disabled={moveBookMutation.isPending}
                          >
                            <span>📚</span>
                            {shelf.ShelfName}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className="text-sm text-gray-500 italic">
                          Không có kệ khác
                        </span>
                      </li>
                    )}
                  </ul>
                </details>
              </li>

              <li>
                <a
                  onClick={() => onRemove(book.BookId, book.BookTitle)}
                  className="text-error"
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Đang xóa...
                    </>
                  ) : (
                    <>
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
                      Xóa khỏi thư viện
                    </>
                  )}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Progress update modal */}
      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        book={book}
      />
    </div>
  );
};

export default BookCard;
