// src/app/components/BookShelf/CreateShelfModal.jsx
import React, { useState } from "react";
import { useCreateShelf } from "../../hooks/index";

const CreateShelfModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    shelfName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const createShelfMutation = useCreateShelf();

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.shelfName.trim()) {
      newErrors.shelfName = "Tên kệ sách không được để trống";
    } else if (formData.shelfName.length > 100) {
      newErrors.shelfName = "Tên kệ sách không được quá 100 ký tự";
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = "Mô tả không được quá 255 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    try {
      const result = await createShelfMutation.mutateAsync({
        shelfName: formData.shelfName.trim(),
        description: formData.description.trim() || null,
      });

      // Reset form
      setFormData({ shelfName: "", description: "" });
      setErrors({});

      // Success callback
      onSuccess?.(result);
      onClose?.();
    } catch (error) {
      // Error already handled in hook
      console.error("Create shelf error:", error);
    }
  };

  const handleModalClose = (e) => {
    // Only close modal when clicking backdrop, not content
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setFormData({ shelfName: "", description: "" });
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" onClick={handleModalClose}>
      <div className="modal-box max-w-lg relative">
        {/* Close button */}
        <button
          onClick={handleCancel}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>

        {/* Modal content */}
        <div className="py-4">
          <h2 className="text-lg font-semibold mb-4">📚 Tạo kệ sách mới</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shelf Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Tên kệ sách <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="shelfName"
                value={formData.shelfName}
                onChange={handleInputChange}
                placeholder="VD: Sách yêu thích, Đang đọc 2024, Khoa học viễn tưởng..."
                className={`input input-bordered w-full ${
                  errors.shelfName ? "input-error" : ""
                }`}
                maxLength={100}
                autoFocus
              />
              {errors.shelfName && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.shelfName}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  {formData.shelfName.length}/100 ký tự
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mô tả</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả ngắn về kệ sách này..."
                className={`textarea textarea-bordered w-full h-20 ${
                  errors.description ? "textarea-error" : ""
                }`}
                maxLength={255}
              />
              {errors.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {errors.description}
                  </span>
                </label>
              )}
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  {formData.description.length}/255 ký tự
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="modal-action">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost"
                disabled={createShelfMutation.isPending}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${
                  createShelfMutation.isPending ? "loading" : ""
                }`}
                disabled={
                  createShelfMutation.isPending || !formData.shelfName.trim()
                }
              >
                {createShelfMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Đang tạo...
                  </>
                ) : (
                  <>✨ Tạo kệ sách</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShelfModal;
