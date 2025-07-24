import React from "react";
import { toast } from "react-toastify";
export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  bookData,
  loading = false,
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!bookData?.BookId) {
      toast.error("Invalid book. Cannot delete.");
      return;
    }
    onConfirm(bookData.BookId);
  };

  return (
    <div className="modal modal-open backdrop-blur-md">
      <div className="modal-box max-w-md bg-gradient-to-br from-white to-red-50 border border-red-200 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-red-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-xl">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <h3 className="font-bold text-xl bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent">
              Delete Book
            </h3>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-red-100 to-red-200 p-6 rounded-full shadow-lg">
            <svg
              className="w-16 h-16 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* Modal Body */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold text-gray-800 mb-4">
            Are you sure you want to delete this book?
          </p>

          {bookData && (
            <div className="bg-gradient-to-r from-gray-50 to-red-50 border-2 border-red-200 p-6 rounded-2xl mb-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-20 h-24 rounded-xl shadow-md">
                    <img
                      src={bookData.CoverImageUrl || "/api/placeholder/80/96"}
                      alt="Book cover"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-lg text-gray-800">
                    {bookData.Title}
                  </h4>
                  <p className="text-sm text-gray-600 font-medium">
                    by {bookData.AuthorName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ID: {bookData.BookId} • ISBN: {bookData.Isbn13}
                  </p>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 shadow-sm">
                      {bookData.GenreName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div className="text-left">
                <p className="text-sm font-bold text-red-800 mb-2">
                  This action cannot be undone
                </p>
                <p className="text-xs text-red-700">
                  The book will be permanently removed from the database along
                  with all related data (reviews, user bookshelf entries, etc.).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-action justify-center gap-4 pt-6 border-t border-red-200">
          <button
            type="button"
            className="btn btn-outline border-2 border-gray-300 hover:bg-gray-100 rounded-xl px-6 py-3 font-semibold transition-all duration-200"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
              loading ? "loading" : ""
            }`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              "Delete Book"
            )}
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-4 border-t border-red-200">
          <p className="text-xs text-center text-red-600 font-medium">
            This will also remove the book from all user bookshelves and reading
            lists.
          </p>
        </div>
      </div>
    </div>
  );
}
