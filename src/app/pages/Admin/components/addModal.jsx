import React, { useState } from "react";
import { addAuthor, addGenre, generateRandomISBN } from "../services/adminApi";
import { toast } from "react-toastify";
export default function AddModal({
  isOpen,
  onClose,
  onSubmit,
  authors,
  genres,
  onAuthorAdded, // <- NEW
  onGenreAdded, // <- NEW
}) {
  const [formData, setFormData] = useState({
    title: "",
    isbn13: "",
    authorId: "", // <-- changed
    genreId: "", // <-- changed
    publicationYear: "",
    description: "",
    coverImageUrl: "",
    pageCount: "",
  });

  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [showNewGenre, setShowNewGenre] = useState(false);
  const [newAuthor, setNewAuthor] = useState({ Name: "" });
  const [newGenre, setNewGenre] = useState({ GenreName: "", Description: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewAuthorChange = (e) => {
    const { name, value } = e.target;
    setNewAuthor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewGenreChange = (e) => {
    const { name, value } = e.target;
    setNewGenre((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetNewAuthor = () => {
    setShowNewAuthor(false);
    setNewAuthor({ Name: "" });
  };

  const resetNewGenre = () => {
    setShowNewGenre(false);
    setNewGenre({ GenreName: "", Description: "" });
  };

  const handleGenerateISBN = () => {
    const randomISBN = generateRandomISBN();
    setFormData((prev) => ({
      ...prev,
      isbn13: randomISBN,
    }));
    toast.success("Random ISBN generated!");
  };

  const handleAddAuthor = async () => {
    if (!newAuthor.Name.trim()) {
      toast.error("Author name is required");
      return;
    }

    try {
      const res = await addAuthor(newAuthor);
      if (!res?.Author?.AuthorId) throw new Error("Invalid author response");

      toast.success("Author added successfully!");

      // Notify parent to update dropdown immediately
      if (onAuthorAdded) onAuthorAdded(res.Author);

      // Set the new author as selected
      setFormData((prev) => ({ ...prev, authorId: res.Author.AuthorId }));

      // Reset the form
      resetNewAuthor();
    } catch (err) {
      if (err.message?.includes("already exists")) {
        toast.error("Author already exists!");
      } else if (err.message?.includes("401") || err.message?.includes("403")) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to add author.");
      }
    }
  };

  const handleAddGenre = async () => {
    if (!newGenre.GenreName.trim()) {
      toast.error("Genre name is required");
      return;
    }

    try {
      const res = await addGenre(newGenre);
      if (!res?.Genre?.GenreId) throw new Error("Invalid genre response");

      toast.success("Genre added successfully!");

      // Notify parent to update dropdown immediately
      if (onGenreAdded) onGenreAdded(res.Genre);

      // Set the new genre as selected
      setFormData((prev) => ({ ...prev, genreId: res.Genre.GenreId }));

      // Reset the form
      resetNewGenre();
    } catch (err) {
      if (err.message?.includes("already exists")) {
        toast.error("Genre already exists!");
      } else if (err.message?.includes("401") || err.message?.includes("403")) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to add genre.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate author and genre selection
      if (!showNewAuthor && (!formData.authorId || isNaN(formData.authorId))) {
        toast.error("Please select an author or add a new one");
        return;
      }
      if (!showNewGenre && (!formData.genreId || isNaN(formData.genreId))) {
        toast.error("Please select a genre or add a new one");
        return;
      }

      // If showing new author/genre forms, user must add them first
      if (showNewAuthor) {
        toast.error("Please add the new author first using the Add button");
        return;
      }
      if (showNewGenre) {
        toast.error("Please add the new genre first using the Add button");
        return;
      }

      // Create book payload
      const newBook = {
        Title: formData.title.trim(),
        Isbn13: formData.isbn13.trim(),
        AuthorId: Number(formData.authorId),
        GenreId: Number(formData.genreId),
        PublicationYear:
          Number(formData.publicationYear) || new Date().getFullYear(),
        Description: formData.description?.trim(),
        CoverImageUrl: formData.coverImageUrl?.trim(),
        PageCount: Number(formData.pageCount) || 0,
      };

      // Add book via parent
      const result = await onSubmit(newBook);

      if (result?.error === "DUPLICATE_ISBN") {
        toast.error("ISBN-13 already exists!");
        return;
      }

      toast.success("Book added successfully!");

      // Reset form
      setFormData({
        title: "",
        isbn13: "",
        authorId: "",
        genreId: "",
        publicationYear: "",
        description: "",
        coverImageUrl: "",
        pageCount: "",
      });
      resetNewAuthor();
      resetNewGenre();
      onClose();
    } catch (err) {
      console.error("Unhandled error:", err);
      if (err.message?.includes("401") || err.message?.includes("403")) {
        toast.error("Session expired. Please login again.");
      } else if (
        err.message?.includes("duplicate") ||
        err.message?.includes("exists")
      ) {
        toast.error("This book might already exist.");
      } else {
        toast.error("Failed to add book.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open backdrop-blur-md">
      <div className="modal-box w-11/12 max-w-2xl bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              Add New Book
            </h3>
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
                className="text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
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
                  className="text-gray-700 input input-bordered flex-1 bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
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
              <div className="flex gap-3">
                <select
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleInputChange}
                  className="text-gray-700 select select-bordered flex-1 bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                  required
                >
                  <option value="">Select an author</option>
                  {authors?.map((author) => (
                    <option key={author.AuthorId} value={author.AuthorId}>
                      {author.Name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="text-gray-700 btn btn-outline btn-sm hover:bg-blue-500 hover:text-white hover:border-blue-500 rounded-xl transition-all duration-200"
                  onClick={() => setShowNewAuthor(true)}
                  title="Add New Author"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Genre *
                </span>
              </label>
              <div className="flex gap-3">
                <select
                  name="genreId"
                  value={formData.genreId}
                  onChange={handleInputChange}
                  className="text-gray-700 select select-bordered flex-1 bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                  required
                >
                  <option value="">Select a genre</option>
                  {genres?.map((genre) => (
                    <option key={genre.GenreId} value={genre.GenreId}>
                      {genre.GenreName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-outline btn-sm hover:bg-green-500 hover:text-white hover:border-green-500 rounded-xl transition-all duration-200"
                  onClick={() => setShowNewGenre(true)}
                  title="Add New Genre"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Add New Author Modal */}
          {showNewAuthor && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Add New Author
                </h4>
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                  onClick={resetNewAuthor}
                >
                  ✕
                </button>
              </div>
              <div className="form-control">
                <input
                  type="text"
                  name="Name"
                  value={newAuthor.Name}
                  onChange={handleNewAuthorChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAuthor();
                    }
                  }}
                  placeholder="Enter author name"
                  className="input input-bordered w-full bg-white border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="btn btn-outline btn-sm border-2 border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2 font-semibold transition-all duration-200"
                  onClick={resetNewAuthor}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleAddAuthor}
                >
                  Add Author
                </button>
              </div>
            </div>
          )}

          {/* Add New Genre Modal */}
          {showNewGenre && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-green-900 text-lg flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
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
                  Add New Genre
                </h4>
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost text-green-600 hover:bg-green-200 transition-colors duration-200"
                  onClick={resetNewGenre}
                >
                  ✕
                </button>
              </div>
              <div className="form-control">
                <input
                  type="text"
                  name="GenreName"
                  value={newGenre.GenreName}
                  onChange={handleNewGenreChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGenre();
                    }
                  }}
                  placeholder="Enter genre name"
                  className="input input-bordered w-full bg-white border-2 border-green-200 focus:border-green-500 rounded-xl"
                  required
                />
              </div>
              <div className="form-control">
                <textarea
                  name="Description"
                  value={newGenre.Description}
                  onChange={handleNewGenreChange}
                  placeholder="Genre description (optional)"
                  className="textarea textarea-bordered w-full textarea-sm h-20 resize-none bg-white border-2 border-green-200 focus:border-green-500 rounded-xl"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="btn btn-outline btn-sm border-2 border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2 font-semibold transition-all duration-200"
                  onClick={resetNewGenre}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-xl px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={handleAddGenre}
                >
                  Add Genre
                </button>
              </div>
            </div>
          )}

          {/* Row 3: Publication Year, Page Count, Language */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-control">
              <label className="label ">
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
                className="text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
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
                className="text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
              />
            </div>
          </div>

          {/* Row 4: Cover Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Cover Image URL
              </span>
            </label>
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/book-cover.jpg"
              className=" text-gray-700 input input-bordered w-full bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
            />
          </div>

          {/* Row 5: Description */}
          <div className="form-control">
            <label className="label">
              <span className=" label-text font-semibold text-gray-700">
                Description
              </span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter book description..."
              className="text-gray-700 textarea textarea-bordered h-32 resize-none bg-white border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
            ></textarea>
          </div>

          {/* Modal Actions */}
          <div className="modal-action justify-between pt-6 border-t border-blue-200">
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
                className="text-gray-700 btn btn-outline border-2 border-gray-300 hover:bg-gray-100 rounded-xl px-6 py-3 font-semibold transition-all duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Add Book
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
