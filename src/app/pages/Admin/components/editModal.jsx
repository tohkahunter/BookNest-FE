import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
export default function EditModal({
  isOpen,
  onClose,
  onSubmit,
  bookData,
  authors,
  genres,
}) {
  const [formData, setFormData] = useState({
    bookId: "",
    title: "",
    isbn13: "",
    authorId: "",
    genreId: "",
    publicationYear: "",
    description: "",
    coverImageUrl: "",
    pageCount: "",
    language: "English",
  });

  // Populate form when bookData changes
  useEffect(() => {
    if (bookData) {
      setFormData({
        bookId: bookData.BookId || "",
        title: bookData.Title || "",
        isbn13: bookData.Isbn13 || "",
        authorId: bookData.AuthorId || "",
        genreId: bookData.GenreId || "",
        publicationYear: bookData.PublicationYear || "",
        description: bookData.Description || "",
        coverImageUrl: bookData.CoverImageUrl || "",
        pageCount: bookData.PageCount || "",
        language: bookData.Language || "English",
      });
    }
  }, [bookData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!formData.authorId || !formData.genreId) {
      toast.error("Author and genre must be selected.");
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-xl text-neutral">Edit Book</h3>
            <p className="text-sm text-neutral/60 mt-1">
              Book ID: {formData.bookId}
            </p>
          </div>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title and ISBN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Book Title *</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">ISBN-13</span>
              </label>
              <input
                type="text"
                name="isbn13"
                value={formData.isbn13}
                onChange={handleInputChange}
                placeholder="978-0000000000"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Row 2: Author and Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Author *</span>
              </label>
              <select
                name="authorId"
                value={formData.authorId}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select an author</option>
                {authors?.map((author) => (
                  <option key={author.AuthorId} value={author.AuthorId}>
                    {author.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Genre *</span>
              </label>
              <select
                name="genreId"
                value={formData.genreId}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select a genre</option>
                {genres?.map((genre) => (
                  <option key={genre.GenreId} value={genre.GenreId}>
                    {genre.GenreName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Publication Year, Page Count, Language */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Publication Year</span>
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleInputChange}
                placeholder="2024"
                min="1000"
                max={new Date().getFullYear()}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Page Count</span>
              </label>
              <input
                type="number"
                name="pageCount"
                value={formData.pageCount}
                onChange={handleInputChange}
                placeholder="300"
                min="1"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Row 4: Cover Image URL with Preview */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Cover Image URL</span>
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  name="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/book-cover.jpg"
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter book description..."
              className="textarea textarea-bordered h-24 resize-none"
            ></textarea>
          </div>

          {/* Changes Summary */}
          <div className="bg-base-200 p-4 rounded-lg">
            <h4 className="font-medium text-sm text-neutral/80 mb-2">
              📝 Editing: {bookData?.Title || "Unknown Book"}
            </h4>
            <div className="text-xs text-neutral/60">
              Last modified:{" "}
              {bookData?.UpdatedAt
                ? new Date(bookData.UpdatedAt).toLocaleString()
                : "Never"}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action justify-between">
            <div className="text-sm text-neutral/60">* Required fields</div>
            <div className="space-x-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-warning text-white">
                Update Book
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
