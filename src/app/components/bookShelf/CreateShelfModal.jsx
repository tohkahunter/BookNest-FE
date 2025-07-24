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
      newErrors.shelfName = "Book shelf name is required";
    } else if (formData.shelfName.length > 100) {
      newErrors.shelfName = "Book shelf name must be at most 100 characters";
    }

    if (formData.description && formData.description.length > 255) {
      newErrors.description = "Description must be at most 255 characters";
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
          <h2 className="text-lg font-semibold mb-4">
            📚 Create New Book Shelf
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Shelf Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Book shelf name <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="text"
                name="shelfName"
                value={formData.shelfName}
                onChange={handleInputChange}
                placeholder="VD: My Favorite Books"
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
                  {formData.shelfName.length}/100 characters
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Short description of this book shelf..."
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
                  {formData.description.length}/255 characters
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
                Cancel
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
                    Creating...
                  </>
                ) : (
                  <>✨ Create Book Shelf</>
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
