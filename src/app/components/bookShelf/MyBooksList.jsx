// src/app/components/BookShelf/MyBooksList.jsx - Updated version

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

  // ✅ UPDATED: Filter books with enhanced shelf filtering
  const filteredBooks = useMemo(() => {
    if (!books) return [];

    let filtered = [...books];

    // Filter by status
    if (selectedStatusFilter !== "all") {
      const statusId = parseInt(selectedStatusFilter);
      filtered = filtered.filter((book) => book.StatusId === statusId);
    }

    // ✅ UPDATED: Filter by shelf with "none" option
    if (selectedShelfFilter !== "all") {
      if (selectedShelfFilter === "none") {
        // Show books without shelf assignment
        filtered = filtered.filter(
          (book) =>
            !book.ShelfId ||
            book.ShelfId === null ||
            book.ShelfId === undefined ||
            book.ShelfId === "" ||
            book.ShelfId === 0
        );
      } else {
        // Show books from specific shelf
        const shelfId = parseInt(selectedShelfFilter);
        filtered = filtered.filter((book) => book.ShelfId === shelfId);
      }
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

  // ✅ UPDATED: Enhanced book stats with shelf statistics
  const bookStats = useMemo(() => {
    if (!books)
      return {
        total: 0,
        wantToRead: 0,
        currentlyReading: 0,
        read: 0,
        withoutShelf: 0,
      };

    const withoutShelf = books.filter(
      (book) =>
        !book.ShelfId ||
        book.ShelfId === null ||
        book.ShelfId === undefined ||
        book.ShelfId === "" ||
        book.ShelfId === 0
    ).length;

    return {
      total: books.length,
      wantToRead: books.filter((book) => book.StatusId === 1).length,
      currentlyReading: books.filter((book) => book.StatusId === 2).length,
      read: books.filter((book) => book.StatusId === 3).length,
      withoutShelf,
    };
  }, [books]);

  // ✅ HELPER: Get count of books in specific shelf
  const getShelfBookCount = (shelfId) => {
    if (!books) return 0;
    return books.filter((book) => book.ShelfId === shelfId).length;
  };

  // ✅ HELPER: Get count of books without shelf
  const getBooksWithoutShelfCount = () => {
    if (!books) return 0;
    return books.filter(
      (book) =>
        !book.ShelfId ||
        book.ShelfId === null ||
        book.ShelfId === undefined ||
        book.ShelfId === "" ||
        book.ShelfId === 0
    ).length;
  };

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
        `You want to remove "${bookTitle}" from your library?\n\nAll reading progress and notes will be deleted.`
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
        <span>❌ Error loading books list: {booksError.message}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with statistics */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 mt-1">
            Manage your books and track your reading progress
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
          Add Book
        </button>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Total Books</div>
          <div className="stat-value text-2xl text-primary">
            {bookStats.total}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Want to Read</div>
          <div className="stat-value text-2xl text-warning">
            {bookStats.wantToRead}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Currently Reading</div>
          <div className="stat-value text-2xl text-info">
            {bookStats.currentlyReading}
          </div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title text-sm">Read</div>
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
            <option value="all">All Statuses </option>
            {readingStatuses?.map((status) => {
              const count =
                books?.filter((book) => book.StatusId === status.StatusId)
                  .length || 0;
              return (
                <option key={status.StatusId} value={status.StatusId}>
                  {status.StatusName} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* ✅ UPDATED: Shelf filter with "No shelf" option */}
        <div className="form-control w-full md:w-auto">
          <select
            className="select select-bordered w-full md:w-48"
            value={selectedShelfFilter}
            onChange={(e) => setSelectedShelfFilter(e.target.value)}
          >
            <option value="all">📚 All bookshelves ({bookStats.total})</option>
            <option value="none">
              🏠 No shelf ({getBooksWithoutShelfCount()})
            </option>
            {shelves?.map((shelf) => (
              <option key={shelf.ShelfId} value={shelf.ShelfId}>
                📖 {shelf.ShelfName} ({getShelfBookCount(shelf.ShelfId)})
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
            Clear Filters
          </button>
        )}
      </div>

      {/* ✅ UPDATED: Enhanced empty state messages */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <div className="text-6xl mb-4">📖</div>
          {books?.length === 0 ? (
            <>
              <h4 className="text-lg font-medium mb-2">
                No books in library yet
              </h4>
              <p className="text-gray-600 mb-4">
                Add the first book to your library to start tracking reading
              </p>
              <button
                onClick={() => setIsAddBookModalOpen(true)}
                className="btn btn-primary"
              >
                Add book
              </button>
            </>
          ) : (
            <>
              <h4 className="text-lg font-medium mb-2">
                {selectedShelfFilter === "none"
                  ? "📚 No books without shelf assignment found"
                  : selectedShelfFilter !== "all"
                  ? `📚 No books found in "${
                      shelves?.find(
                        (s) => s.ShelfId === parseInt(selectedShelfFilter)
                      )?.ShelfName
                    }" shelf`
                  : "No books found matching your filters"}
              </h4>
              <p className="text-gray-600">
                {selectedShelfFilter === "none"
                  ? "All your books are organized in shelves. Great job organizing! 🎉"
                  : "Try changing the filters or search keywords"}
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {/* ✅ NEW: Show filter results summary */}
          <div className="flex items-center justify-between bg-base-200 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-primary">
                {filteredBooks.length}
              </span>{" "}
              of {bookStats.total} books
              {selectedStatusFilter !== "all" && (
                <span className="ml-2 badge badge-outline">
                  {
                    readingStatuses?.find(
                      (s) => s.StatusId === parseInt(selectedStatusFilter)
                    )?.StatusName
                  }
                </span>
              )}
              {selectedShelfFilter !== "all" && (
                <span className="ml-2 badge badge-outline">
                  {selectedShelfFilter === "none"
                    ? "No shelf"
                    : shelves?.find(
                        (s) => s.ShelfId === parseInt(selectedShelfFilter)
                      )?.ShelfName}
                </span>
              )}
              {searchTerm.trim() && (
                <span className="ml-2 badge badge-outline">"{searchTerm}"</span>
              )}
            </div>
          </div>

          {/* Books grid */}
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
        </>
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
