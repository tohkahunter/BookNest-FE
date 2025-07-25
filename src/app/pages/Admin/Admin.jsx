import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  getAllBooks,
  getAllAuthors,
  getAllGenres,
  addBook,
  updateBook,
  deleteBook,
  updateAuthor,
  deleteAuthor,
  updateGenre,
  deleteGenre,
} from "./services/adminApi";
import AddModal from "./components/addModal";
import EditModal from "./components/editModal";
import DeleteModal from "./components/deleteModal";
import AuthorGenreManager from "./components/AuthorGenreManager";
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
  const [isAuthorGenreManagerOpen, setIsAuthorGenreManagerOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const hasLoadedRef = useRef(false);

  const booksPerPage = 10;

  useEffect(() => {
    if (bookTableRef.current) {
      bookTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  // Enhanced retry logic for API calls
  const retryApiCall = useCallback(
    async (apiCall, maxRetries = 3, delay = 1000) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await apiCall();
        } catch (error) {
          if (attempt === maxRetries) {
            throw error;
          }

          console.warn(
            `API call failed (attempt ${attempt}/${maxRetries}):`,
            error.message
          );
          toast.info(`Retrying... (${attempt}/${maxRetries})`, {
            toastId: `retry-${attempt}`,
            autoClose: 2000,
          });

          // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }
    },
    []
  );

  useEffect(() => {
    const loadInitialData = async () => {
      // Prevent multiple simultaneous loads (React 18 strict mode protection)
      if (hasLoadedRef.current) {
        return;
      }

      hasLoadedRef.current = true;
      setIsLoading(true);
      setApiError(null);

      try {
        // Show loading toast for slow APIs
        toast.info("Loading admin data...", {
          autoClose: false,
          toastId: "loading-data",
        });

        // Load all data in parallel with retry logic
        const [booksData, authorsData, genresData] = await Promise.all([
          retryApiCall(getAllBooks),
          retryApiCall(getAllAuthors),
          retryApiCall(getAllGenres),
        ]);

        setBooks(booksData);
        setBookCount(booksData.length);
        setAuthors(authorsData);
        setAuthorCount(authorsData.length);
        setGenres(genresData);

        toast.dismiss("loading-data");
        toast.success("Admin data loaded successfully!");
      } catch (error) {
        console.error("Failed to load initial data:", error);
        setApiError(error.message);
        toast.dismiss("loading-data");
        toast.error("Failed to load admin data. Please refresh the page.");
        hasLoadedRef.current = false; // Reset on error to allow retry
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [retryApiCall]); // Keep dependency but guard against multiple calls

  // Memoized filtered and sorted books for better performance
  const filteredBooks = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();

    return books
      .filter((book) => {
        // Early return if no search term and no genre filter
        if (!searchTerm && selectedGenre === "All") return true;

        const matchesSearch =
          !searchTerm ||
          book.Title.toLowerCase().includes(searchLower) ||
          book.AuthorName.toLowerCase().includes(searchLower) ||
          book.GenreName.toLowerCase().includes(searchLower);

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
  }, [books, searchTerm, selectedGenre, sortOption]);

  // Memoized pagination values
  const { totalPages, currentBooks, indexOfFirstBook, indexOfLastBook } =
    useMemo(() => {
      const indexOfLastBook = currentPage * booksPerPage;
      const indexOfFirstBook = indexOfLastBook - booksPerPage;
      const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
      const currentBooks = filteredBooks.slice(
        indexOfFirstBook,
        indexOfLastBook
      );

      return { totalPages, currentBooks, indexOfFirstBook, indexOfLastBook };
    }, [filteredBooks, currentPage, booksPerPage]);

  const handleAddBook = async (newBookData) => {
    try {
      // Show loading feedback immediately
      toast.info("Adding new book...", {
        autoClose: false,
        toastId: "adding-book",
      });

      const response = await addBook(newBookData);
      const addedBook = response.Book;

      // Update UI immediately (optimistic update)
      setBooks((prevBooks) => [addedBook, ...prevBooks]);
      setBookCount((prev) => prev + 1);
      setIsAddModalOpen(false);

      // Dismiss loading toast and show success
      toast.dismiss("adding-book");
      toast.success("Book added successfully!");

      // Refresh author/genre list in background (don't await)
      Promise.all([getAllAuthors(), getAllGenres()])
        .then(([updatedAuthors, updatedGenres]) => {
          setAuthors(updatedAuthors);
          setGenres(updatedGenres);
        })
        .catch((refreshError) => {
          console.error("Background refresh failed:", refreshError);
        });
    } catch (err) {
      console.error("Failed to add book:", err);
      toast.dismiss("adding-book");
      toast.error("Failed to add book: " + (err.message || "Unknown error"));
    }
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = async (updatedBookData) => {
    try {
      // Show loading feedback immediately
      toast.info("Updating book...", {
        autoClose: false,
        toastId: "updating-book",
      });

      await updateBook(updatedBookData.bookId, updatedBookData);

      // Close modal immediately for better UX
      setIsEditModalOpen(false);
      setSelectedBook(null);

      // Dismiss loading toast and show success
      toast.dismiss("updating-book");
      toast.success("Book updated successfully!");

      // Update UI optimistically first, then refresh in background
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.BookId === updatedBookData.bookId
            ? { ...book, ...updatedBookData }
            : book
        )
      );

      // Re-fetch to ensure AuthorName/GenreName are present (background)
      getAllBooks()
        .then((updatedBooks) => {
          setBooks(updatedBooks);
        })
        .catch((refreshError) => {
          console.error("Background refresh failed:", refreshError);
          // If refresh fails, revert to fresh data fetch
          getAllBooks().then(setBooks).catch(console.error);
        });
    } catch (err) {
      console.error("Failed to update book:", err);
      toast.dismiss("updating-book");
      toast.error("Failed to update book: " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteBook = (book) => {
    setBookToDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (bookId) => {
    setIsDeleting(true);
    try {
      // Show loading feedback immediately
      toast.info("Deleting book...", {
        autoClose: false,
        toastId: "deleting-book",
      });

      await deleteBook(bookId);

      // Update UI immediately (optimistic update)
      setBooks((prevBooks) => prevBooks.filter((b) => b.BookId !== bookId));
      setBookCount((prev) => prev - 1);
      setIsDeleteModalOpen(false);
      setBookToDelete(null);

      // Dismiss loading toast and show success
      toast.dismiss("deleting-book");
      toast.success("Book deleted successfully!");
    } catch (err) {
      console.error("Failed to delete book:", err);
      toast.dismiss("deleting-book");
      toast.error("Failed to delete book: " + (err.message || "Unknown error"));

      // Refresh data to ensure consistency after error
      getAllBooks()
        .then((books) => {
          setBooks(books);
          setBookCount(books.length);
        })
        .catch(console.error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Optimized handlers with useCallback to prevent unnecessary re-renders
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleGenreChange = useCallback((e) => {
    setSelectedGenre(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleAuthorAdded = useCallback((newAuthor) => {
    setAuthors((prev) => [...prev, newAuthor]);
  }, []);

  const handleGenreAdded = useCallback((newGenre) => {
    setGenres((prev) => [...prev, newGenre]);
  }, []);

  const handleUpdateAuthor = async (authorId, authorData) => {
    try {
      // Show loading feedback immediately
      toast.info("Updating author...", {
        autoClose: false,
        toastId: "updating-author",
      });

      // Format the data to match backend expectations
      const requestData = {
        AuthorId: authorId,
        Name: authorData.Name,
      };

      await updateAuthor(authorId, requestData);

      // Update UI optimistically
      setAuthors((prevAuthors) =>
        prevAuthors.map((author) =>
          author.AuthorId === authorId
            ? { ...author, Name: authorData.Name }
            : author
        )
      );

      // Dismiss loading toast and show success
      toast.dismiss("updating-author");
      toast.success("Author updated successfully!");

      // Refresh data in background for consistency
      Promise.all([getAllAuthors(), getAllBooks()])
        .then(([updatedAuthors, updatedBooks]) => {
          setAuthors(updatedAuthors);
          setAuthorCount(updatedAuthors.length);
          setBooks(updatedBooks);
          setBookCount(updatedBooks.length);
        })
        .catch((refreshError) => {
          console.error("Background refresh failed:", refreshError);
        });
    } catch (error) {
      console.error("Failed to update author:", error);
      toast.dismiss("updating-author");
      toast.error("Failed to update author: " + error.message);
    }
  };

  const handleDeleteAuthor = async (authorId) => {
    try {
      console.log("Starting delete author operation for ID:", authorId);

      // First, find books to delete (for user feedback)
      const booksToDelete = books.filter((book) => book.AuthorId == authorId);
      console.log("Books to delete:", booksToDelete.length);

      // Show immediate UI feedback
      toast.info(
        `Deleting author and ${booksToDelete.length} associated books...`,
        {
          autoClose: false,
          toastId: "deleting-author",
        }
      );

      // Delete all books in parallel (faster than sequential)
      if (booksToDelete.length > 0) {
        const deleteBookPromises = booksToDelete.map((book) =>
          deleteBook(book.BookId)
        );
        await Promise.all(deleteBookPromises);
        console.log("All books deleted successfully");
      }

      // Then delete the author
      console.log("Deleting author:", authorId);
      await deleteAuthor(authorId);

      // Update all state at once (batch update to prevent multiple re-renders)
      const remainingBooks = books.filter((book) => book.AuthorId != authorId);
      const remainingAuthors = authors.filter(
        (author) => author.AuthorId != authorId
      );

      // Use a single state update function to batch all changes
      const updateStates = () => {
        setBooks(remainingBooks);
        setBookCount(remainingBooks.length);
        setAuthors(remainingAuthors);
        setAuthorCount(remainingAuthors.length);
      };

      // React will batch these updates automatically in React 18+
      updateStates();

      // Dismiss loading toast and show success
      toast.dismiss("deleting-author");
      toast.success("Author and associated books deleted successfully!");

      // Refresh data in background for consistency (don't await)
      // Use a single Promise.all to reduce the number of re-renders
      // Add a small delay to prevent immediate re-render conflicts
      setTimeout(() => {
        Promise.all([getAllAuthors(), getAllBooks(), getAllGenres()])
          .then(([updatedAuthors, updatedBooks, updatedGenres]) => {
            // Batch all background updates together
            setAuthors(updatedAuthors);
            setAuthorCount(updatedAuthors.length);
            setBooks(updatedBooks);
            setBookCount(updatedBooks.length);
            setGenres(updatedGenres);
          })
          .catch((refreshError) => {
            console.error("Background refresh failed:", refreshError);
          });
      }, 100); // Small delay to prevent immediate re-render
    } catch (error) {
      console.error("Failed to delete author:", error);
      toast.dismiss("deleting-author");
      toast.error("Failed to delete author: " + error.message);

      // Refresh data anyway to ensure consistency
      try {
        const [updatedAuthors, updatedBooks, updatedGenres] = await Promise.all(
          [getAllAuthors(), getAllBooks(), getAllGenres()]
        );
        // Batch error recovery updates
        setAuthors(updatedAuthors);
        setAuthorCount(updatedAuthors.length);
        setBooks(updatedBooks);
        setBookCount(updatedBooks.length);
        setGenres(updatedGenres);
      } catch (refreshError) {
        console.error("Failed to refresh data after error:", refreshError);
      }
    }
  };

  const handleUpdateGenre = async (genreId, genreData) => {
    try {
      // Show loading feedback immediately
      toast.info("Updating genre...", {
        autoClose: false,
        toastId: "updating-genre",
      });

      // Format the data to match backend expectations
      const requestData = {
        GenreId: genreId,
        GenreName: genreData.GenreName,
        Description: genreData.Description || "",
      };

      await updateGenre(genreId, requestData);

      // Update UI optimistically
      setGenres((prevGenres) =>
        prevGenres.map((genre) =>
          genre.GenreId === genreId
            ? {
                ...genre,
                GenreName: genreData.GenreName,
                Description: genreData.Description || "",
              }
            : genre
        )
      );

      // Dismiss loading toast and show success
      toast.dismiss("updating-genre");
      toast.success("Genre updated successfully!");

      // Refresh data in background for consistency
      Promise.all([getAllGenres(), getAllBooks()])
        .then(([updatedGenres, updatedBooks]) => {
          setGenres(updatedGenres);
          setBooks(updatedBooks);
          setBookCount(updatedBooks.length);
        })
        .catch((refreshError) => {
          console.error("Background refresh failed:", refreshError);
        });
    } catch (error) {
      console.error("Failed to update genre:", error);
      toast.dismiss("updating-genre");
      toast.error("Failed to update genre: " + error.message);
    }
  };

  const handleDeleteGenre = async (genreId) => {
    try {
      console.log("=== GENRE DELETE OPERATION START ===");
      console.log("Genre ID to delete:", genreId);

      // First, find books to delete (for user feedback)
      const booksToDelete = books.filter((book) => book.GenreId == genreId);
      console.log("Books to delete:", booksToDelete.length);

      // Show immediate UI feedback
      toast.info(
        `Deleting genre and ${booksToDelete.length} associated books...`,
        {
          autoClose: false,
          toastId: "deleting-genre",
        }
      );

      // Delete all books in parallel (faster than sequential)
      if (booksToDelete.length > 0) {
        const deleteBookPromises = booksToDelete.map((book) =>
          deleteBook(book.BookId)
        );
        await Promise.all(deleteBookPromises);
        console.log("All books deleted successfully");
      }

      // Then delete the genre
      console.log("Deleting genre:", genreId);
      await deleteGenre(genreId);

      // Update all state at once (batch update to prevent multiple re-renders)
      const remainingBooks = books.filter((book) => book.GenreId != genreId);
      const remainingGenres = genres.filter(
        (genre) => genre.GenreId != genreId
      );

      // Use a single state update function to batch all changes
      const updateStates = () => {
        setBooks(remainingBooks);
        setBookCount(remainingBooks.length);
        setGenres(remainingGenres);
      };

      // React will batch these updates automatically in React 18+
      updateStates();

      // Dismiss loading toast and show success
      toast.dismiss("deleting-genre");
      toast.success("Genre and associated books deleted successfully!");

      // Refresh data in background for consistency (don't await)
      // Use a single Promise.all to reduce the number of re-renders
      // Add a small delay to prevent immediate re-render conflicts
      setTimeout(() => {
        Promise.all([getAllGenres(), getAllBooks(), getAllAuthors()])
          .then(([updatedGenres, updatedBooks, updatedAuthors]) => {
            // Batch all background updates together
            setGenres(updatedGenres);
            setBooks(updatedBooks);
            setBookCount(updatedBooks.length);
            setAuthors(updatedAuthors);
            setAuthorCount(updatedAuthors.length);
          })
          .catch((refreshError) => {
            console.error("Background refresh failed:", refreshError);
          });
      }, 100); // Small delay to prevent immediate re-render
    } catch (error) {
      console.error("=== GENRE DELETE OPERATION FAILED ===");
      console.error("Error details:", error);
      toast.dismiss("deleting-genre");
      toast.error("Failed to delete genre: " + error.message);

      // Refresh data anyway to ensure consistency
      try {
        console.log("Refreshing data after error...");
        const [updatedGenres, updatedBooks, updatedAuthors] = await Promise.all(
          [getAllGenres(), getAllBooks(), getAllAuthors()]
        );
        // Batch error recovery updates
        setGenres(updatedGenres);
        setBooks(updatedBooks);
        setBookCount(updatedBooks.length);
        setAuthors(updatedAuthors);
        setAuthorCount(updatedAuthors.length);
        console.log("Data refreshed after error");
      } catch (refreshError) {
        console.error("Failed to refresh data after error:", refreshError);
      }
    }
  };

  return (
    <div className="admin-container mb-10 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-blue-500 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">
              Loading Admin Dashboard...
            </h2>
            <p className="text-gray-500 mt-2">
              {apiError
                ? "Retrying connection..."
                : "Please wait while we fetch your data"}
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="admin-header bg-gradient-to-r from-white to-blue-50 shadow-xl border-b border-blue-100 py-12 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-medium">
                Manage your book collection with ease
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            onClick={() => setIsAddModalOpen(true)}
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
            Add New Book
          </button>

          <button
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
            onClick={() => setIsAuthorGenreManagerOpen(true)}
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            Manage Authors & Genres
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs mb-6 text">
          <button
            className={`tab tab-lg ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          ></button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search & Filter
            </h3>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search books by title, author, or genre..."
                  className=" text-gray-700 w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className=" text-gray-700 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200 min-w-32"
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
                className=" text-gray-700 px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200 min-w-32"
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
                className="px-6 py-4 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-200 flex items-center gap-2 text-gray-600 hover:text-red-600"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("All");
                  setSortOption("None");
                }}
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
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-8 border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-2xl shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
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
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent">
                  {bookCount}
                </p>
                <p className="text-gray-600 font-semibold text-lg">
                  Total Books
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-xl p-8 border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-2xl shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
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
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-orange-600 bg-clip-text text-transparent">
                  {authorCount}
                </p>
                <p className="text-gray-600 font-semibold text-lg">Authors</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-4 rounded-2xl shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
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
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                  {genres.length}
                </p>
                <p className="text-gray-600 font-semibold text-lg">Genres</p>
              </div>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          ref={bookTableRef}
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Book Collection
            </h3>
            <p className="text-gray-600 mt-1">
              Manage and organize your library
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-blue-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    #
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    Cover
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    Book Details
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    Author
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    Genre
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    Year
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    Added
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentBooks.map((book, index) => (
                  <tr
                    key={book.BookId}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                  >
                    <td className="px-6 py-6 text-sm font-semibold text-gray-900 bg-gray-50 group-hover:bg-blue-100 transition-colors duration-200">
                      {index + 1}
                    </td>
                    <td className="px-6 py-6">
                      <div className="w-16 h-20 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                        <img
                          src={book.CoverImageUrl || "/api/placeholder/64/80"}
                          alt="Book Cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div>
                        <div className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors duration-200">
                          {book.Title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                            />
                          </svg>
                          {book.Isbn13 || "No ISBN"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors duration-200">
                        {book.AuthorName}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 whitespace-nowrap shadow-sm hover:shadow-md transition-shadow duration-200">
                        {book.GenreName}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-200">
                          <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
                            {book.PublicationYear}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-sm text-gray-600 font-medium">
                        {new Date(book.CreatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex gap-3">
                        <button
                          className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md group/btn"
                          onClick={() => handleEditBook(book)}
                          title="Edit Book"
                        >
                          <svg
                            className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200"
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
                          className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md group/btn"
                          onClick={() => handleDeleteBook(book)}
                          title="Delete Book"
                        >
                          <svg
                            className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200"
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

        <div className="flex justify-center mt-8">
          <div className="flex gap-2 bg-white rounded-2xl shadow-lg p-2 border border-gray-200">
            <button
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-gray-600 hover:text-blue-600"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-4 py-3 border rounded-xl transition-all duration-200 font-semibold ${
                  currentPage === index + 1
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-500 shadow-lg transform scale-105"
                    : "border-gray-200 hover:bg-blue-50 hover:border-blue-200 text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-gray-600 hover:text-blue-600"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6 px-8 py-6 bg-gradient-to-r from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100">
          <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Page {currentPage} of {totalPages}
          </div>
          <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
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
        onAuthorAdded={handleAuthorAdded}
        onGenreAdded={handleGenreAdded}
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

      <AuthorGenreManager
        isOpen={isAuthorGenreManagerOpen}
        onClose={() => setIsAuthorGenreManagerOpen(false)}
        type="author"
        data={[...authors, ...genres]}
        onUpdate={(id, data) => {
          // Determine if it's author or genre based on the data structure
          if (data.Name !== undefined) {
            return handleUpdateAuthor(id, data);
          } else {
            return handleUpdateGenre(id, data);
          }
        }}
        onDelete={(id, itemType) => {
          console.log("=== DELETE HANDLER CALLED ===");
          console.log("Delete ID:", id, "Type:", typeof id);
          console.log("Item Type:", itemType);

          if (itemType === "author") {
            console.log("Calling handleDeleteAuthor with:", id);
            return handleDeleteAuthor(id);
          } else if (itemType === "genre") {
            console.log("Calling handleDeleteGenre with:", id);
            return handleDeleteGenre(id);
          } else {
            throw new Error("Unknown item type: " + itemType);
          }
        }}
        books={books}
      />
    </div>
  );
}
