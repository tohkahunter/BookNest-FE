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

  // Initialize form data when book changes
  useEffect(() => {
    if (book) {
      const correctProgress = getCorrectProgress(book);

      setFormData({
        currentPage: book.CurrentPage?.toString() || "",
        readingProgress: correctProgress.toString(), // ✅ Use corrected progress
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

    // ✅ Make currentPage required
    if (!formData.currentPage || formData.currentPage.trim() === "") {
      newErrors.currentPage = "Vui lòng nhập trang hiện tại";
    } else {
      const page = parseInt(formData.currentPage);
      if (isNaN(page) || page < 0) {
        newErrors.currentPage = "Trang hiện tại phải là số dương";
      } else if (book?.PageCount && page > book.PageCount) {
        newErrors.currentPage = `Trang hiện tại không được vượt quá ${book.PageCount}`;
      }
    }

    // ✅ Make readingProgress required
    if (!formData.readingProgress || formData.readingProgress.trim() === "") {
      newErrors.readingProgress = "Vui lòng nhập tiến độ đọc";
    } else {
      const progress = parseFloat(formData.readingProgress);
      if (isNaN(progress) || progress < 0 || progress > 100) {
        newErrors.readingProgress = "Tiến độ phải từ 0 đến 100%";
      }
    }

    // Notes có thể để trống, nhưng nếu có thì validate length
    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = "Ghi chú không được quá 1000 ký tự";
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
      currentPage: parseInt(formData.currentPage), // Guaranteed to have value from validation
      readingProgress: parseFloat(formData.readingProgress), // Guaranteed to have value
      notes: formData.notes.trim() || "", // Empty string if no notes
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
    // Reset form to corrected values (not raw backend values)
    if (book) {
      const correctProgress = getCorrectProgress(book);

      setFormData({
        currentPage: book.CurrentPage?.toString() || "",
        readingProgress: correctProgress.toString(), // ✅ Use corrected progress
        notes: book.Notes || "",
      });
    }
    setErrors({});
    onClose?.();
  };

  if (!isOpen || !book) return null;

  const currentProgress = formData.readingProgress
    ? parseFloat(formData.readingProgress)
    : 0;

  return (
    <div
      className="modal modal-open"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-box max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg">📖 Cập nhật tiến độ đọc</h3>
            <p className="text-sm text-gray-600 mt-1">{book.BookTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current progress display */}
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span>Tiến độ hiện tại</span>
              <span className="font-semibold">{currentProgress}%</span>
            </div>
            <progress
              className="progress progress-primary w-full h-3"
              value={currentProgress}
              max="100"
            />
            {currentProgress >= 100 && (
              <div className="text-success text-sm mt-2 font-medium">
                🎉 Chúc mừng! Bạn đã hoàn thành cuốn sách này!
              </div>
            )}
          </div>

          {/* Current page - Required */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Trang hiện tại <span className="text-error">*</span>
              </span>
              {book.PageCount && (
                <span className="label-text-alt">
                  Tổng: {book.PageCount} trang
                </span>
              )}
            </label>
            <input
              type="number"
              name="currentPage"
              value={formData.currentPage}
              onChange={handleInputChange}
              placeholder="Nhập trang đang đọc..."
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
                Tiến độ (%) <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              name="readingProgress"
              value={formData.readingProgress}
              onChange={handleInputChange}
              placeholder="Nhập phần trăm hoàn thành..."
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

          {/* Notes - Required */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Ghi chú <span className="text-error">*</span>
              </span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Chia sẻ cảm nghĩ về cuốn sách, những điều thú vị bạn đã học được..."
              className={`textarea textarea-bordered w-full h-24 ${
                errors.notes ? "textarea-error" : ""
              }`}
              maxLength={1000}
              required
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
                {formData.notes.length}/1000 ký tự
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
              Hủy
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
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật tiến độ"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProgressModal;
