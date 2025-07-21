import React, { useState } from "react";
import { addAuthor, addGenre } from "../services/adminApi";
import { toast } from "react-toastify";
export default function AddModal({
  isOpen,
  onClose,
  onSubmit,
  authors,
  genres,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let authorId = formData.authorId;
      let genreId = formData.genreId;

      // === Add Author if needed ===
      if (showNewAuthor) {
        try {
          const res = await addAuthor(newAuthor);
          if (!res?.Author?.AuthorId) {
            throw new Error("Invalid author response");
          }
          authorId = res.Author.AuthorId;
        } catch (err) {
          if (err.message?.includes("already exists")) {
            toast.error("Author already exists!");
          } else if (
            err.message?.includes("401") ||
            err.message?.includes("403")
          ) {
            toast.error("Session expired. Please login again.");
          } else {
            toast.error("Failed to add author.");
          }
          return; // Stop submission
        }
      }

      // === Add Genre if needed ===
      if (showNewGenre) {
        try {
          const res = await addGenre(newGenre);
          if (!res?.Genre?.GenreId) {
            throw new Error("Invalid genre response");
          }
          genreId = res.Genre.GenreId;
        } catch (err) {
          if (err.message?.includes("already exists")) {
            toast.error("Genre already exists!");
          } else if (
            err.message?.includes("401") ||
            err.message?.includes("403")
          ) {
            toast.error("Session expired. Please login again.");
          } else {
            toast.error("Failed to add genre.");
          }
          return;
        }
      }

      // Validate author and genre selection
      if (!showNewAuthor && (!formData.authorId || isNaN(formData.authorId))) {
        toast.error("Please select an author or add a new one");
        return;
      }
      if (!showNewGenre && (!formData.genreId || isNaN(formData.genreId))) {
        toast.error("Please select a genre or add a new one");
        return;
      }

      // Create book payload
      const newBook = {
        Title: formData.title.trim(),
        Isbn13: formData.isbn13.trim(),
        AuthorId: Number(authorId),
        GenreId: Number(genreId),
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
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-neutral">Add New Book</h3>
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
              <div className="flex gap-2">
                <select
                  name="authorId"
                  value={formData.authorId}
                  onChange={handleInputChange}
                  className="select select-bordered flex-1"
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
                  className="btn btn-outline btn-sm"
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
                <span className="label-text font-medium">Genre *</span>
              </label>
              <div className="flex gap-2">
                <select
                  name="genreId"
                  value={formData.genreId}
                  onChange={handleInputChange}
                  className="select select-bordered flex-1"
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
                  className="btn btn-outline btn-sm"
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-blue-900">Add New Author</h4>
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost text-blue-600"
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
                  placeholder="Enter author name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
          )}

          {/* Add New Genre Modal */}
          {showNewGenre && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-green-900">Add New Genre</h4>
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-ghost text-green-600"
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
                  placeholder="Enter genre name"
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <textarea
                  name="Description"
                  value={newGenre.Description}
                  onChange={handleNewGenreChange}
                  placeholder="Genre description (optional)"
                  className="textarea textarea-bordered w-full textarea-sm h-16 resize-none"
                />
              </div>
            </div>
          )}

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

          {/* Row 4: Cover Image URL */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Cover Image URL</span>
            </label>
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/book-cover.jpg"
              className="input input-bordered w-full"
            />
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
              <button type="submit" className="btn btn-success text-white">
                Add Book
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
