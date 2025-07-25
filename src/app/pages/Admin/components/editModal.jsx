import React, { useState, useEffect } from "react";
import { generateRandomISBN } from "../services/adminApi";
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

  const handleGenerateISBN = () => {
    const randomISBN = generateRandomISBN();
    setFormData((prev) => ({
      ...prev,
      isbn13: randomISBN,
    }));
    toast.success("Random ISBN generated!");
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
    <div className="modal modal-open backdrop-blur-md">
      <div className="modal-box w-11/12 max-w-2xl bg-gradient-to-br from-white to-orange-50 border border-orange-200 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-orange-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl">
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent">
                Edit Book
              </h3>
            </div>
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
              <svg
                className="w-4 h-4 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Book ID: {formData.bookId}
            </p>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Title and ISBN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Book Title *
                </span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
                className=" text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  ISBN-13
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="isbn13"
                  value={formData.isbn13}
                  onChange={handleInputChange}
                  placeholder="978-0000000000"
                  className="text-gray-700 input input-bordered flex-1 bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleGenerateISBN}
                  className="btn btn-outline btn-sm hover:bg-green-500 hover:text-white hover:border-green-500 rounded-xl transition-all duration-200"
                  title="Generate Random ISBN"
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
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Author and Genre */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Author *
                </span>
              </label>
              <select
                name="authorId"
                value={formData.authorId}
                onChange={handleInputChange}
                className="text-gray-700 select select-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
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
                <span className="label-text font-semibold text-gray-700">
                  Genre *
                </span>
              </label>
              <select
                name="genreId"
                value={formData.genreId}
                onChange={handleInputChange}
                className="text-gray-700 select select-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Publication Year
                </span>
              </label>
              <input
                type="number"
                name="publicationYear"
                value={formData.publicationYear}
                onChange={handleInputChange}
                placeholder="2024"
                min="1000"
                max={new Date().getFullYear()}
                className="text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Page Count
                </span>
              </label>
              <input
                type="number"
                name="pageCount"
                value={formData.pageCount}
                onChange={handleInputChange}
                placeholder="300"
                min="1"
                className="text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
              />
            </div>
          </div>

          {/* Row 4: Cover Image URL with Preview */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Cover Image URL
              </span>
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  name="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/book-cover.jpg"
                  className="text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Description
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter book description..."
              className="text-gray-700 textarea textarea-bordered h-32 resize-none bg-white border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all duration-200"
            ></textarea>
          </div>

          {/* Changes Summary */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 p-6 rounded-2xl shadow-lg">
            <h4 className="font-bold text-sm text-orange-800 mb-2 flex items-center gap-2">
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              📝 Editing: {bookData?.Title || "Unknown Book"}
            </h4>
            <div className="text-xs text-orange-700">
              Last modified:{" "}
              {bookData?.UpdatedAt
                ? new Date(bookData.UpdatedAt).toLocaleString()
                : "Never"}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-action justify-between pt-6 border-t border-orange-200">
            <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
              <svg
                className="w-4 h-4 text-red-500"
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
              * Required fields
            </div>
            <div className="space-x-3">
              <button
                type="button"
                className=" text-gray-700 btn btn-outline border-2 border-gray-300 hover:bg-gray-100 rounded-xl px-6 py-3 font-semibold transition-all duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-gray-700 btn bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Update Book
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
