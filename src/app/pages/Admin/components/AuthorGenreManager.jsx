import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AuthorGenreManager({
  isOpen,
  onClose,
  data,
  onUpdate,
  onDelete,
  books,
}) {
  const [activeTab, setActiveTab] = useState("author");
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deleteWarning, setDeleteWarning] = useState(null);
  const [localData, setLocalData] = useState(data); // Local copy for immediate updates

  // Update local data when prop data changes
  useEffect(() => {
    console.log("AuthorGenreManager - data prop changed:", {
      oldDataLength: localData.length,
      newDataLength: data.length,
      oldAuthors: localData.filter((item) => item.AuthorId !== undefined)
        .length,
      newAuthors: data.filter((item) => item.AuthorId !== undefined).length,
      oldGenres: localData.filter((item) => item.GenreId !== undefined).length,
      newGenres: data.filter((item) => item.GenreId !== undefined).length,
    });
    setLocalData([...data]); // Create a new array to ensure proper state update
  }, [data]); // Only depend on data prop changes

  // Debug logging to track component re-renders and state changes
  useEffect(() => {
    console.log("AuthorGenreManager data changed:", {
      authors: localData.filter((item) => item.AuthorId !== undefined).length,
      genres: localData.filter((item) => item.GenreId !== undefined).length,
      activeTab,
      isOpen,
    });
  }, [localData, activeTab, isOpen]);

  // Reset editing states when modal closes/opens to prevent stale data
  useEffect(() => {
    if (!isOpen) {
      setEditingItem(null);
      setEditFormData({});
      setDeleteWarning(null);
    }
  }, [isOpen]);

  // Separate authors and genres from the local data
  const authors = localData.filter((item) => item.AuthorId !== undefined);
  const genres = localData.filter((item) => item.GenreId !== undefined);

  const currentItems = activeTab === "author" ? authors : genres;
  const isAuthor = activeTab === "author";
  const itemKey = isAuthor ? "AuthorId" : "GenreId";
  const nameKey = isAuthor ? "Name" : "GenreName";

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
      [nameKey]: item[nameKey],
      ...(activeTab === "genre" && { Description: item.Description || "" }),
    });
  };

  const handleEditSave = async () => {
    if (!editFormData[nameKey]?.trim()) {
      toast.error(`${isAuthor ? "Author" : "Genre"} name is required`);
      return;
    }

    try {
      // Immediately update local data for instant UI feedback
      setLocalData((prevData) =>
        prevData.map((item) => {
          if (item[itemKey] === editingItem[itemKey]) {
            return { ...item, ...editFormData };
          }
          return item;
        })
      );

      await onUpdate(editingItem[itemKey], editFormData);
      toast.success(`${isAuthor ? "Author" : "Genre"} updated successfully!`);
      setEditingItem(null);
      setEditFormData({});
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        `Failed to update ${isAuthor ? "author" : "genre"}: ${error.message}`
      );
      // Revert local data to original data on error
      setLocalData(data);
      setEditingItem(null);
      setEditFormData({});
    }
  };

  const handleDelete = (item) => {
    // Find books that would be affected
    const affectedBooks = books.filter((book) =>
      isAuthor ? book.AuthorId === item.AuthorId : book.GenreId === item.GenreId
    );

    setDeleteWarning({
      item,
      affectedBooks,
    });
  };

  const confirmDelete = async () => {
    try {
      const idToDelete = deleteWarning.item[itemKey];
      const itemType = activeTab; // "author" or "genre"
      console.log("AuthorGenreManager - confirmDelete called");
      console.log("Item to delete:", deleteWarning.item);
      console.log("ID to delete:", idToDelete, "Type:", typeof idToDelete);
      console.log("Item key used:", itemKey);
      console.log("Item type:", itemType);
      console.log("Current active tab:", activeTab);

      // Clear the delete warning immediately to prevent double-clicking
      setDeleteWarning(null);

      // Immediately update local data for instant UI feedback
      setLocalData((prevData) =>
        prevData.filter((item) => {
          if (itemType === "author") {
            return item.AuthorId !== idToDelete;
          } else {
            return item.GenreId !== idToDelete;
          }
        })
      );

      await onDelete(idToDelete, itemType);
      toast.success(`${isAuthor ? "Author" : "Genre"} deleted successfully!`);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        `Failed to delete ${isAuthor ? "author" : "genre"}: ${error.message}`
      );
      // Reset delete warning state on error
      setDeleteWarning(null);
      // Revert local data to original data on error
      setLocalData(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open backdrop-blur-md">
      <div className="modal-box w-11/12 max-w-4xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
              Manage Authors & Genres
            </h3>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="text-gray-700 tabs tabs-boxed mb-6 bg-gray-100 p-1 rounded-xl">
          <button
            className={`tab flex-1 text-gray-700 ${
              activeTab === "author"
                ? "tab-active bg-blue-500 text-white"
                : "hover:bg-gray-200"
            } transition-all duration-600`}
            onClick={() => setActiveTab("author")}
          >
            <div className="text-gray-700"> 👤 Authors ({authors.length}) </div>
          </button>
          <button
            className={`tab flex-1 ${
              activeTab === "genre"
                ? "tab-active bg-green-500 text-gray-200"
                : "hover:bg-gray-200"
            } transition-all duration-600`}
            onClick={() => setActiveTab("genre")}
          >
            <div className="text-gray-700"> 🏷️ Genres ({genres.length}) </div>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          <div className="grid gap-4">
            {currentItems.map((item) => (
              <div
                key={item[itemKey]}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                {editingItem && editingItem[itemKey] === item[itemKey] ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editFormData[nameKey] || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          [nameKey]: e.target.value,
                        }))
                      }
                      className="input input-bordered w-full"
                      placeholder={`${isAuthor ? "Author" : "Genre"} name`}
                    />
                    {activeTab === "genre" && (
                      <textarea
                        value={editFormData.Description || ""}
                        onChange={(e) =>
                          setEditFormData((prev) => ({
                            ...prev,
                            Description: e.target.value,
                          }))
                        }
                        className="textarea textarea-bordered w-full h-20"
                        placeholder="Genre description (optional)"
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handleEditSave}
                        className="btn btn-success btn-sm text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="btn btn-outline btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-800">
                        {item[nameKey]}
                      </h4>
                      {activeTab === "genre" && item.Description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.Description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-2">
                        ID: {item[itemKey]} •
                        {
                          books.filter((book) =>
                            activeTab === "author"
                              ? book.AuthorId === item.AuthorId
                              : book.GenreId === item.GenreId
                          ).length
                        }{" "}
                        books
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className=" text-gray-700 btn btn-outline btn-sm hover:bg-blue-500 hover:text-white"
                        title="Edit"
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
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className=" text-gray-700 btn btn-outline btn-sm hover:bg-red-500 hover:text-white"
                        title="Delete"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-action mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className=" text-gray-700 btn btn-outline px-8"
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Warning Modal */}
      {deleteWarning && (
        <div className="modal modal-open">
          <div className="modal-box bg-gradient-to-br from-white to-red-50 border border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-500 p-3 rounded-xl">
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-red-800">
                Delete {isAuthor ? "Author" : "Genre"}
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Are you sure you want to delete "{deleteWarning.item[nameKey]}"?
              </p>

              {deleteWarning.affectedBooks.length > 0 ? (
                <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                  <p className="font-bold text-red-800 mb-3">
                    ⚠️ Warning: This will also delete{" "}
                    {deleteWarning.affectedBooks.length} book(s):
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {deleteWarning.affectedBooks.map((book) => (
                      <div
                        key={book.BookId}
                        className="text-sm text-red-700 bg-red-50 p-2 rounded"
                      >
                        • {book.Title} (ID: {book.BookId})
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-red-600 mt-3 font-medium">
                    Consider updating these books to use a different{" "}
                    {isAuthor ? "author" : "genre"} before deleting.
                  </p>
                </div>
              ) : (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <p className="text-green-800">
                    ✅ No books are using this {isAuthor ? "author" : "genre"}.
                    Safe to delete.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                onClick={() => setDeleteWarning(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error text-white"
              >
                {deleteWarning.affectedBooks.length > 0
                  ? `Delete ${isAuthor ? "Author" : "Genre"} & ${
                      deleteWarning.affectedBooks.length
                    } Book(s)`
                  : `Delete ${isAuthor ? "Author" : "Genre"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
