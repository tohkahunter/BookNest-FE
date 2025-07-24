// src/app/components/BookShelf/ProgressModal.jsx
import React, { useState, useEffect } from "react";
import { useUpdateReadingProgress } from "../../hooks/index";

const ProgressModal = ({ isOpen, onClose, book }) => {
  const [formData, setFormData] = useState({
    currentPage: "",
    readingProgress: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const updateProgressMutation = useUpdateReadingProgress();

  // ✅ Constants for reading statuses
  const READING_STATUS = {
    WANT_TO_READ: 1,
    CURRENTLY_READING: 2,
    READ: 3,
  };

  // ✅ Check if book status allows progress updates
  const canUpdateProgress = (book) => {
    return book?.StatusId === READING_STATUS.CURRENTLY_READING;
  };

  // Fix: Apply same logic as BookCard for handling backend bug
  const getCorrectProgress = (book) => {
    // Ưu tiên CurrentPage nếu có
    if (book.CurrentPage && book.PageCount && book.CurrentPage > 0) {
      return Math.round((book.CurrentPage / book.PageCount) * 100);
    }

    // Fix backend bug: Nếu ReadingProgress = 100 nhưng CurrentPage = null/0
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

  // ✅ Get status display info
  const getStatusInfo = (statusId) => {
    switch (statusId) {
      case READING_STATUS.WANT_TO_READ:
        return { label: "Want to Read", icon: "📝", color: "text-warning" };
      case READING_STATUS.CURRENTLY_READING:
        return { label: "Currently Reading", icon: "📖", color: "text-info" };
      case READING_STATUS.READ:
        return { label: "Read", icon: "✅", color: "text-success" };
      default:
        return { label: "Unknown", icon: "❓", color: "text-gray-500" };
    }
  };

  // Initialize form data when book changes
  useEffect(() => {
    if (book) {
      const correctProgress = getCorrectProgress(book);

      setFormData({
        currentPage: book.CurrentPage?.toString() || "",
        readingProgress: correctProgress.toString(),
        notes: book.Notes || "",
      });
    }
  }, [book]);

  // Calculate reading progress from current page
  const calculateProgressFromPage = (currentPage) => {
    if (!currentPage || !book?.PageCount) return "";
    const page = parseInt(currentPage);
    if (page <= 0 || page > book.PageCount) return "";
    return Math.round((page / book.PageCount) * 100).toString();
  };

  // Calculate current page from progress
  const calculatePageFromProgress = (progress) => {
    if (!progress || !book?.PageCount) return "";
    const progressNum = parseFloat(progress);
    if (progressNum < 0 || progressNum > 100) return "";
    return Math.round((progressNum / 100) * book.PageCount).toString();
  };

  const validateForm = () => {
    const newErrors = {};

    // ✅ Check if updates are allowed
    if (!canUpdateProgress(book)) {
      newErrors.status =
        "Progress can only be updated for books you're currently reading";
      setErrors(newErrors);
      return false;
    }

    // Make currentPage required
    if (!formData.currentPage || formData.currentPage.trim() === "") {
      newErrors.currentPage = "Please enter the current page";
    } else {
      const page = parseInt(formData.currentPage);
      if (isNaN(page) || page < 0) {
        newErrors.currentPage = "Current page must be a positive number";
      } else if (book?.PageCount && page > book.PageCount) {
        newErrors.currentPage = `Current page cannot exceed ${book.PageCount}`;
      }
    }

    // Make readingProgress required
    if (!formData.readingProgress || formData.readingProgress.trim() === "") {
      newErrors.readingProgress = "Please enter the reading progress";
    } else {
      const progress = parseFloat(formData.readingProgress);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        newErrors.readingProgress = "Progress must be between 0 and 100%";
      }
    }

    // Notes validation
    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = "Notes cannot exceed 1000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newFormData = { ...formData, [name]: value };

    // Auto-calculate progress when page changes
    if (name === "currentPage" && value && book?.PageCount) {
      const calculatedProgress = calculateProgressFromPage(value);
      if (calculatedProgress) {
        newFormData.readingProgress = calculatedProgress;
      }
    }

    // Auto-calculate page when progress changes
    if (name === "readingProgress" && value && book?.PageCount) {
      const calculatedPage = calculatePageFromProgress(value);
      if (calculatedPage) {
        newFormData.currentPage = calculatedPage;
      }
    }

    setFormData(newFormData);

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const requestData = {
      bookId: book.BookId,
      currentPage: parseInt(formData.currentPage),
      readingProgress: parseFloat(formData.readingProgress),
      notes: formData.notes.trim() || "",
    };

    console.log("📤 Sending update progress request:", requestData);

    try {
      await updateProgressMutation.mutateAsync(requestData);
      onClose?.();
    } catch (error) {
      console.error("💥 Update progress error:", error);
      console.error("📋 Error response:", error.response?.data);
    }
  };

  const handleClose = () => {
    // Reset form to corrected values
    if (book) {
      const correctProgress = getCorrectProgress(book);

      setFormData({
        currentPage: book.CurrentPage?.toString() || "",
        readingProgress: correctProgress.toString(),
        notes: book.Notes || "",
      });
    }
    setErrors({});
    onClose?.();
  };

  // ✅ Don't render modal if book is not provided
  if (!isOpen || !book) return null;

  const currentProgress = formData.readingProgress
    ? parseFloat(formData.readingProgress)
    : 0;

  const statusInfo = getStatusInfo(book.StatusId);
  const canUpdate = canUpdateProgress(book);

  return (
    <div
      className="modal modal-open"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg">📖 Update Reading Progress</h3>
            <p className="text-sm text-gray-600 mt-1">{book.BookTitle}</p>
            {/* ✅ Show current status */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`badge badge-outline ${statusInfo.color}`}>
                {statusInfo.icon} {statusInfo.label}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* ✅ Show warning if not currently reading */}
        {!canUpdate && (
          <div className="alert alert-warning mb-6">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 shrink-0"
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
              <div className="ml-3">
                <h4 className="font-semibold">
                  Progress updates not available
                </h4>
                <p className="text-sm mt-1">
                  You can only update reading progress for books with status
                  <span className="font-semibold"> "Currently Reading"</span>.
                </p>
                <p className="text-sm mt-2">
                  {book.StatusId === READING_STATUS.WANT_TO_READ &&
                    "Change the book status to 'Currently Reading' to track your progress."}
                  {book.StatusId === READING_STATUS.READ &&
                    "This book is marked as 'Read'. You can view the final progress but cannot update it."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Conditional form rendering */}
        {canUpdate ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current progress display */}
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Current Progress</span>
                <span className="font-semibold">{currentProgress}%</span>
              </div>
              <progress
                className="progress progress-primary w-full h-3"
                value={currentProgress}
                max="100"
              />
              {currentProgress >= 100 && (
                <div className="text-success text-sm mt-2 font-medium">
                  🎉 Congratulations! You have completed this book!
                </div>
              )}
            </div>

            {/* Status error */}
            {errors.status && (
              <div className="alert alert-error">
                <span>{errors.status}</span>
              </div>
            )}

            {/* Current page - Required */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Current Page <span className="text-error">*</span>
                </span>
                {book.PageCount && (
                  <span className="label-text-alt">
                    Total: {book.PageCount} pages
                  </span>
                )}
              </label>
              <input
                type="number"
                name="currentPage"
                value={formData.currentPage}
                onChange={handleInputChange}
                placeholder="Input current page..."
                className={`input input-bordered w-full ${
                  errors.currentPage ? "input-error" : ""
                }`}
                min="0"
                max={book.PageCount || undefined}
                required
              />
              {errors.currentPage && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.currentPage}
                  </span>
                </label>
              )}
            </div>

            {/* Reading progress - Required */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Progress (%) <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="number"
                name="readingProgress"
                value={formData.readingProgress}
                onChange={handleInputChange}
                placeholder="Input reading progress..."
                className={`input input-bordered w-full ${
                  errors.readingProgress ? "input-error" : ""
                }`}
                min="0"
                max="100"
                step="0.1"
                required
              />
              {errors.readingProgress && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.readingProgress}
                  </span>
                </label>
              )}
            </div>

            {/* Notes - Optional */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Notes</span>
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Share your thoughts on the book, interesting things you've learned..."
                className={`textarea textarea-bordered w-full h-24 ${
                  errors.notes ? "textarea-error" : ""
                }`}
                maxLength={1000}
              />
              {errors.notes && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.notes}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  {formData.notes.length}/1000 characters
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="modal-action">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost"
                disabled={updateProgressMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${
                  updateProgressMutation.isPending ? "loading" : ""
                }`}
                disabled={updateProgressMutation.isPending}
              >
                {updateProgressMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Updating...
                  </>
                ) : (
                  "Update Progress"
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ✅ Read-only view for non-currently-reading books */
          <div className="space-y-4">
            {/* Current progress display - Read only */}
            <div className="bg-base-200 p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Final Progress</span>
                <span className="font-semibold">{currentProgress}%</span>
              </div>
              <progress
                className="progress progress-primary w-full h-3"
                value={currentProgress}
                max="100"
              />
              {currentProgress >= 100 && (
                <div className="text-success text-sm mt-2 font-medium">
                  ✅ Book completed!
                </div>
              )}
            </div>

            {/* Read-only info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-base-100 rounded">
                <span className="font-medium">Current Page:</span>
                <span>
                  {book.CurrentPage || 0} / {book.PageCount || "N/A"}
                </span>
              </div>

              {book.Notes && (
                <div className="p-3 bg-base-100 rounded">
                  <span className="font-medium block mb-2">Notes:</span>
                  <p className="text-sm text-gray-600">{book.Notes}</p>
                </div>
              )}
            </div>

            {/* Close button only */}
            <div className="modal-action">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
