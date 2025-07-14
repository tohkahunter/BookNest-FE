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
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-error">Delete Book</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-error/20 p-4 rounded-full">
            <svg
              className="w-12 h-12 text-error"
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
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-neutral mb-3">
            Are you sure you want to delete this book?
          </p>

          {bookData && (
            <div className="bg-base-200 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 h-20 rounded">
                    <img
                      src={bookData.CoverImageUrl || "/api/placeholder/64/80"}
                      alt="Book cover"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-neutral">{bookData.Title}</h4>
                  <p className="text-sm text-neutral/70">
                    by {bookData.AuthorName}
                  </p>
                  <p className="text-xs text-neutral/50">
                    ID: {bookData.BookId} • ISBN: {bookData.Isbn13}
                  </p>
                  <div className="mt-2">
                    <span className="badge badge-outline badge-sm">
                      {bookData.GenreName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-error mt-0.5 flex-shrink-0"
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
                <p className="text-sm font-medium text-error mb-1">
                  This action cannot be undone
                </p>
                <p className="text-xs text-neutral/70">
                  The book will be permanently removed from the database along
                  with all related data (reviews, user bookshelf entries, etc.).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-action justify-center gap-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-error text-white ${loading ? "loading" : ""}`}
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
        <div className="mt-4 pt-4 border-t border-base-300">
          <p className="text-xs text-center text-neutral/50">
            This will also remove the book from all user bookshelves and reading
            lists.
          </p>
        </div>
      </div>
    </div>
  );
}
