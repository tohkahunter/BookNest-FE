import React, { useEffect, useState, useRef } from "react";
import {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  addBook,
  updateBook,
  deleteBook,
} from "./services/adminApi";
import AddModal from "./components/addModal";
import EditModal from "./components/editModal";
import DeleteModal from "./components/deleteModal";
import { toast } from "react-toastify";
export default function Admin() {
  const [activeTab, setActiveTab] = useState("all");
  const [books, setBooks] = useState([]);
  const [bookCount, setBookCount] = useState(0);
  const [genres, setGenres] = useState([]);
  const [authorCount, setAuthorCount] = useState(0);
  const [authors, setAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bookTableRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortOption, setSortOption] = useState("None");

  const booksPerPage = 10;

  useEffect(() => {
    if (bookTableRef.current) {
      bookTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  useEffect(() => {
    getAllBooks()
      .then((books) => {
        setBooks(books);
        setBookCount(books.length);
      })
      .catch(console.error);

    getAllAuthors()
      .then((authors) => {
        setAuthors(authors);
        setAuthorCount(authors.length);
      })
      .catch(console.error);

    getAllGenres()
      .then((genres) => {
        setGenres(genres);
      })
      .catch(console.error);
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  // Apply search, filter, and sort
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.AuthorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.GenreName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === "All" || book.GenreName === selectedGenre;

      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "TitleAZ":
          return a.Title.localeCompare(b.Title);
        case "TitleZA":
          return b.Title.localeCompare(a.Title);
        case "AuthorAZ":
          return a.AuthorName.localeCompare(b.AuthorName);
        case "DateAdded":
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        case "PublicationYear":
          return b.PublicationYear - a.PublicationYear;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handleAddBook = async (newBookData) => {
    try {
      const response = await addBook(newBookData);
      const addedBook = response.Book;

      setBooks((prevBooks) => [addedBook, ...prevBooks]);
      setBookCount((prev) => prev + 1);
      setIsAddModalOpen(false);

      // Refresh author/genre list
      const updatedAuthors = await getAllAuthors();
      const updatedGenres = await getAllGenres();
      setAuthors(updatedAuthors);
      setGenres(updatedGenres);
    } catch (err) {
      console.error("Failed to add book:", err);
      toast.error("Failed to add book.");
    }
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = async (updatedBookData) => {
    try {
      await updateBook(updatedBookData.bookId, updatedBookData);

      // Re-fetch to ensure AuthorName/GenreName are present
      const updatedBooks = await getAllBooks();
      setBooks(updatedBooks);

      setIsEditModalOpen(false);
      setSelectedBook(null);
      toast.success("Book updated successfully!");
    } catch (err) {
      console.error("Failed to update book:", err);
      toast.error("Failed to update book.");
    }
  };

  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (bookId) => {
    setIsDeleting(true);
    try {
      await deleteBook(bookId);
      setBooks((prevBooks) => prevBooks.filter((b) => b.BookId !== bookId));
      setBookCount((prev) => prev - 1);
      setIsDeleteModalOpen(false);
      setBookToDelete(null);
      toast.success("Book deleted successfully!");
    } catch (err) {
      console.error("Failed to delete book:", err);
      toast.error("Failed to delete book.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="admin-container mb-10">
      {/* Header Section */}
      <div className="admin-header bg-neutral/5 py-6 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-neutral">Admin Dashboard</h1>
          <p className="text-neutral/70 mt-2">Manage your book collection</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Buttons */}
        <button
          className="btn btn-success text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add New Book
        </button>

        {/* Tabs Navigation */}
        <div className="tabs mb-6">
          <button
            className={`tab tab-lg ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          ></button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex gap-1">
            <select
              className="select select-bordered"
              value={selectedGenre}
              onChange={handleGenreChange}
            >
              <option value="All">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.GenreId} value={genre.GenreName}>
                  {genre.GenreName}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="None">Sort by</option>
              <option value="TitleAZ">Title A-Z</option>
              <option value="TitleZA">Title Z-A</option>
              <option value="AuthorAZ">Author A-Z</option>
              <option value="DateAdded">Date Added</option>
              <option value="PublicationYear">Publication Year</option>
            </select>

            <button
              className="btn btn-outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedGenre("All");
                setSortOption("None");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <div className="flex items-center gap-4">
                <div className="bg-success/20 p-4 rounded-full">
                  <svg
                    className="w-8 h-8 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-neutral">{bookCount}</p>
                  <p className="text-base text-neutral/70 font-medium">
                    Total Books
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <div className="flex items-center gap-4">
                <div className="bg-warning/20 p-4 rounded-full">
                  <svg
                    className="w-8 h-8 text-warning"
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
                </div>
                <div>
                  <p className="text-3xl font-bold text-neutral">
                    {authorCount}
                  </p>
                  <p className="text-base text-neutral/70 font-medium">
                    Authors
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-6">
              <div className="flex items-center gap-4">
                <div className="bg-info/20 p-4 rounded-full">
                  <svg
                    className="w-8 h-8 text-info"
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
                </div>
                <div>
                  <p className="text-3xl font-bold text-neutral">
                    {genres.length}
                  </p>
                  <p className="text-base text-neutral/70 font-medium">
                    Genres
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="card bg-base-100 shadow-md" ref={bookTableRef}>
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Publication Year</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample book rows */}
                  {currentBooks.map((book, index) => (
                    <tr key={book.BookId}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={
                                book.CoverImageUrl || "/api/placeholder/48/48"
                              }
                              alt="Book Cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-bold">{book.Title}</div>
                          <div className="text-sm opacity-50">
                            {book.Isbn13}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">{book.AuthorName}</div>
                      </td>
                      <td>
                        <div className="badge badge-ghost badge-sm">
                          {book.GenreName}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-center">
                          {book.PublicationYear}
                        </div>
                      </td>
                      <td>{new Date(book.CreatedAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => handleEditBook(book)}
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
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => handleDeleteBook(book)}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button
              className="btn btn-outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              «
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`btn btn-outline ${
                  currentPage === index + 1 ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="btn btn-outline"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            >
              »
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 p-4 bg-base-200 rounded-lg">
          <div className="text-sm text-neutral/70">
            Page {currentPage} of {totalPages}
          </div>
          <div className="text-sm text-neutral/70">
            Showing {indexOfFirstBook + 1}–
            {Math.min(indexOfLastBook, books.length)} of {books.length} books
          </div>
        </div>
      </div>
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBook}
        authors={authors}
        genres={genres}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateBook}
        bookData={selectedBook}
        authors={authors}
        genres={genres}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        bookData={bookToDelete}
        loading={isDeleting}
      />
    </div>
  );
}
