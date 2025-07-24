// src/app/components/BookShelf/BookCard.jsx
import React, { useState } from "react";
import ProgressModal from "./ProgressModal";
import { useMoveBookToShelf } from "../../hooks/index";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const moveBookMutation = useMoveBookToShelf();

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

  // Handle progress modal with status check
  const handleUpdateProgressClick = () => {
    if (canUpdateProgress()) {
      setIsProgressModalOpen(true);
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

        {/* More Actions Button - Top Right Corner */}
        <div className="absolute top-3 right-3">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-xs btn-ghost bg-white/90 hover:bg-white border border-gray-200 backdrop-blur-sm"
            >
              <svg
                className="w-3 h-3 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-lg bg-white rounded-lg w-52 z-50 border border-gray-200"
            >
              {/* Update/View Progress */}
              {canUpdateProgress() ? (
                <li>
                  <a
                    onClick={handleUpdateProgressClick}
                    className="text-gray-700 text-xs hover:bg-blue-50 hover:text-blue-700"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Update Progress
                  </a>
                </li>
              ) : (
                <>
                  {(book.CurrentPage > 0 ||
                    book.ReadingProgress > 0 ||
                    book.Notes) && (
                    <li>
                      <a
                        onClick={() => setIsProgressModalOpen(true)}
                        className="text-gray-700 text-xs hover:bg-gray-50"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Progress
                      </a>
                    </li>
                  )}
                  <li>
                    <div
                      className="tooltip tooltip-left"
                      data-tip="Only available for currently reading books"
                    >
                      <a className="text-xs text-gray-400 cursor-not-allowed">
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
                        Update Progress (Disabled)
                      </a>
                    </div>
                  </li>
                </>
              )}

              <li>
                <hr className="my-1 border-gray-200" />
              </li>

              {/* Move Shelf */}
              <li>
                <details>
                  <summary className=" text-gray-700 text-xs hover:bg-gray-50">
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
                    Move to Shelf
                    {moveBookMutation.isPending && (
                      <span className="loading loading-spinner loading-xs"></span>
                    )}
                  </summary>
                  <ul className="bg-gray-50 rounded-md mt-1">
                    <li>
                      <a
                        onClick={() => handleMoveToShelf(null)}
                        className="text-gray-700 text-xs hover:bg-white"
                        disabled={moveBookMutation.isPending}
                      >
                        🏠 No Shelf
                      </a>
                    </li>
                    {availableShelves.length > 0 ? (
                      availableShelves.map((shelf) => (
                        <li key={shelf.ShelfId}>
                          <a
                            onClick={() => handleMoveToShelf(shelf.ShelfId)}
                            className="text-gray-700 text-xs hover:bg-white"
                            disabled={moveBookMutation.isPending}
                          >
                            📚 {shelf.ShelfName}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className="text-xs text-gray-500 italic px-4 py-2">
                          No Available Shelves
                        </span>
                      </li>
                    )}
                  </ul>
                </details>
              </li>

              <li>
                <hr className="my-1 border-gray-200" />
              </li>

              {/* Remove */}
              <li>
                <a
                  onClick={() => onRemove(book.BookId, book.BookTitle)}
                  className="text-xs text-red-600 hover:bg-red-50"
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Removing...
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
                      Remove from Shelf
                    </>
                  )}
                </a>
              </li>
            </ul>
          </div>
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
            <div className="text-gray-600 dropdown w-full">
              <label
                tabIndex={0}
                className="btn btn-sm btn-outline w-full text-xs normal-case font-medium"
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
                      className="w-3.5 h-3.5 mr-1 text-gray-600"
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
                    Change Status
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
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        book={book}
      />
    </div>
  );
};

export default BookCard;
