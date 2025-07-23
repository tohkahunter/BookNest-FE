// src/app/components/BookShelf/AddBookModal.jsx
import React, { useState, useMemo } from "react";
import { useBooks } from "../../hooks/index"; // Assuming you have this hook
import {
  useAddBookToLibrary,
  useReadingStatuses,
  useMyShelves,
  useCheckBookInLibrary,
} from "../../hooks/index";

const AddBookModal = ({ isOpen, onClose, onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(1); // Default: Want to Read
  const [selectedShelf, setSelectedShelf] = useState("");

  // Fetch data
  const { data: allBooks, isLoading: booksLoading } = useBooks();
  const { data: readingStatuses } = useReadingStatuses();
  const { data: shelves } = useMyShelves();

  // Mutations
  const addBookMutation = useAddBookToLibrary();

  // Filter books based on search term
  const filteredBooks = useMemo(() => {
    if (!allBooks || !searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    return allBooks
      .filter(
        (book) =>
          book.Title?.toLowerCase().includes(term) ||
          book.AuthorName?.toLowerCase().includes(term) ||
          book.Isbn13?.toLowerCase().includes(term)
      )
      .slice(0, 20); // Limit to 20 results for performance
  }, [allBooks, searchTerm]);

  const handleAddBook = async (book) => {
    try {
      await addBookMutation.mutateAsync({
        bookId: book.BookId,
        statusId: selectedStatus,
        shelfId: selectedShelf || null,
      });

      // Reset form
      setSearchTerm("");
      setSelectedStatus(1);
      setSelectedShelf("");

      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Add book error:", error);
    }
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedStatus(1);
    setSelectedShelf("");
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal modal-open"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="modal-box max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">📚 Thêm sách vào thư viện</h3>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Search and filters */}
        <div className="space-y-4 mb-6">
          {/* Search input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Tìm kiếm sách</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên sách, tác giả, hoặc ISBN..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {/* Status and shelf selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reading status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Trạng thái đọc</span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
              >
                {readingStatuses?.map((status) => (
                  <option key={status.StatusId} value={status.StatusId}>
                    {status.StatusName}
                  </option>
                ))}
              </select>
            </div>

            {/* Shelf selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Kệ sách (tùy chọn)
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={selectedShelf}
                onChange={(e) => setSelectedShelf(e.target.value)}
              >
                <option value="">Không chọn kệ</option>
                {shelves?.map((shelf) => (
                  <option key={shelf.ShelfId} value={shelf.ShelfId}>
                    {shelf.ShelfName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search results */}
        <div className="max-h-96 overflow-y-auto">
          {!searchTerm.trim() ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>Nhập từ khóa để tìm kiếm sách</p>
            </div>
          ) : booksLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p>Không tìm thấy sách nào với từ khóa "{searchTerm}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBooks.map((book) => (
                <BookSearchItem
                  key={book.BookId}
                  book={book}
                  onAdd={handleAddBook}
                  isAdding={addBookMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-action">
          <button onClick={handleClose} className="btn btn-ghost">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// Book search item component
const BookSearchItem = ({ book, onAdd, isAdding }) => {
  const { data: bookInLibrary } = useCheckBookInLibrary(book.BookId);

  const isAlreadyInLibrary = bookInLibrary?.Exists;

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-base-200 transition-colors">
      {/* Book cover */}
      <div className="w-16 h-20 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
        {book.CoverImageUrl ? (
          <img
            src={book.CoverImageUrl}
            alt={book.Title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex items-center justify-center text-gray-400 text-xs ${
            book.CoverImageUrl ? "hidden" : "flex"
          }`}
        >
          📖
        </div>
      </div>

      {/* Book info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{book.Title}</h4>
        <p className="text-sm text-gray-600 truncate">{book.AuthorName}</p>
        {book.GenreName && (
          <p className="text-xs text-gray-500">{book.GenreName}</p>
        )}
        {book.PublicationYear && (
          <p className="text-xs text-gray-400">
            Năm xuất bản: {book.PublicationYear}
          </p>
        )}
      </div>

      {/* Add button */}
      <div className="flex-shrink-0">
        {isAlreadyInLibrary ? (
          <div className="badge badge-success">Đã có trong thư viện</div>
        ) : (
          <button
            onClick={() => onAdd(book)}
            className="btn btn-primary btn-sm"
            disabled={isAdding}
          >
            {isAdding ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Đang thêm...
              </>
            ) : (
              "Thêm vào thư viện"
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddBookModal;
