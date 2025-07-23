// src/app/components/BookShelf/MyBooksList.jsx
import React, { useState, useMemo } from "react";
import {
  useMyBooks,
  useReadingStatuses,
  useMyShelves,
  useUpdateBookStatus,
  useRemoveBookFromLibrary,
} from "../../hooks/index";
import BookCard from "./BookCard";
import AddBookModal from "./AddBookModal";

const MyBooksList = () => {
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [selectedShelfFilter, setSelectedShelfFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data
  const {
    data: books,
    isLoading: booksLoading,
    error: booksError,
  } = useMyBooks();
  const { data: readingStatuses } = useReadingStatuses();
  const { data: shelves } = useMyShelves();

  // Mutations
  const updateStatusMutation = useUpdateBookStatus();
  const removeBookMutation = useRemoveBookFromLibrary();

  // Filter books based on selected filters and search
  const filteredBooks = useMemo(() => {
    if (!books) return [];

    let filtered = [...books];

    // Filter by status
    if (selectedStatusFilter !== "all") {
      const statusId = parseInt(selectedStatusFilter);
      filtered = filtered.filter((book) => book.StatusId === statusId);
    }

    // Filter by shelf
    if (selectedShelfFilter !== "all") {
      const shelfId = parseInt(selectedShelfFilter);
      filtered = filtered.filter((book) => book.ShelfId === shelfId);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.BookTitle?.toLowerCase().includes(term) ||
          book.AuthorName?.toLowerCase().includes(term) ||
          book.GenreName?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [books, selectedStatusFilter, selectedShelfFilter, searchTerm]);

  // Group books by status for statistics
  const bookStats = useMemo(() => {
    if (!books)
      return { total: 0, wantToRead: 0, currentlyReading: 0, read: 0 };

    return {
      total: books.length,
      wantToRead: books.filter((book) => book.StatusId === 1).length,
      currentlyReading: books.filter((book) => book.StatusId === 2).length,
      read: books.filter((book) => book.StatusId === 3).length,
    };
  }, [books]);

  const handleStatusUpdate = async (bookId, newStatusId) => {
    try {
      await updateStatusMutation.mutateAsync({ bookId, newStatusId });
    } catch (error) {
      console.error("Update status error:", error);
    }
  };

  const handleRemoveBook = async (bookId, bookTitle) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa "${bookTitle}" khỏi thư viện?\n\nTất cả tiến độ đọc và ghi chú sẽ bị xóa.`
      )
    ) {
      return;
    }

    try {
      await removeBookMutation.mutateAsync(bookId);
    } catch (error) {
      console.error("Remove book error:", error);
    }
  };

  const handleAddBookSuccess = () => {
    // Books will auto-refresh due to React Query invalidation
    console.log("Book added successfully");
  };

  if (booksLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (booksError) {
    return (
      <div className="alert alert-error">
        <span>❌ Lỗi khi tải danh sách sách: {booksError.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with statistics */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-700 text-2xl font-bold">
            📚 Thư viện của tôi
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý sách và theo dõi tiến độ đọc
          </p>
        </div>
        <button
          onClick={() => setIsAddBookModalOpen(true)}
          className="btn btn-primary gap-2"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm sách
        </button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Tổng số sách</div>
          <div className="stat-value text-2xl text-primary">
            {bookStats.total}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Muốn đọc</div>
          <div className="stat-value text-2xl text-warning">
            {bookStats.wantToRead}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Đang đọc</div>
          <div className="stat-value text-2xl text-info">
            {bookStats.currentlyReading}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Đã đọc</div>
          <div className="stat-value text-2xl text-success">
            {bookStats.read}
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="form-control w-full md:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm sách, tác giả..."
            className="input input-bordered w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="form-control w-full md:w-auto">
          <select
            className="select select-bordered w-full md:w-48"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            {readingStatuses?.map((status) => (
              <option key={status.StatusId} value={status.StatusId}>
                {status.StatusName}
              </option>
            ))}
          </select>
        </div>

        {/* Shelf filter */}
        <div className="form-control w-full md:w-auto">
          <select
            className="select select-bordered w-full md:w-48"
            value={selectedShelfFilter}
            onChange={(e) => setSelectedShelfFilter(e.target.value)}
          >
            <option value="all">Tất cả kệ sách</option>
            {shelves?.map((shelf) => (
              <option key={shelf.ShelfId} value={shelf.ShelfId}>
                {shelf.ShelfName}
              </option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {(selectedStatusFilter !== "all" ||
          selectedShelfFilter !== "all" ||
          searchTerm.trim()) && (
          <button
            onClick={() => {
              setSelectedStatusFilter("all");
              setSelectedShelfFilter("all");
              setSearchTerm("");
            }}
            className="btn btn-ghost btn-sm"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Books list */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <div className="text-6xl mb-4">📖</div>
          {books?.length === 0 ? (
            <>
              <h4 className="text-lg font-medium mb-2">
                Thư viện chưa có sách nào
              </h4>
              <p className="text-gray-600 mb-4">
                Thêm sách đầu tiên vào thư viện để bắt đầu theo dõi việc đọc
              </p>
              <button
                onClick={() => setIsAddBookModalOpen(true)}
                className="btn btn-primary"
              >
                Thêm sách đầu tiên
              </button>
            </>
          ) : (
            <>
              <h4 className="text-lg font-medium mb-2">
                Không tìm thấy sách nào
              </h4>
              <p className="text-gray-600">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.UserBookId}
              book={book}
              readingStatuses={readingStatuses}
              shelves={shelves}
              onUpdateStatus={handleStatusUpdate}
              onRemove={handleRemoveBook}
              isUpdatingStatus={updateStatusMutation.isPending}
              isRemoving={removeBookMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Add book modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onSuccess={handleAddBookSuccess}
      />
    </div>
  );
};

export default MyBooksList;
