import axiosInstance from "../config/axios";

// Get all books
export const getAllBooks = async () => {
  const response = await axiosInstance.get("/api/Book");
  return response.data;
};

// Get book by ID
export const getBookById = async (id) => {
  const response = await axiosInstance.get(`/api/Book/${id}`);
  return response.data;
};

// Get books by author ID
export const getBooksByAuthor = async (authorId) => {
  const response = await axiosInstance.get(`/api/Book/author/${authorId}`);
  return response.data;
};

// Search books (client-side filtering - FIXED field names)
export const searchBooks = async (searchTerm) => {
  const books = await getAllBooks();

  if (!searchTerm) return books;

  const term = searchTerm.toLowerCase();
  return books.filter(
    (book) =>
      book.Title?.toLowerCase().includes(term) || // ✅ Title với T hoa
      book.Isbn13?.toLowerCase().includes(term) // ✅ Search by ISBN
    // Note: Author search cần join với authors API
  );
};

// Get books by genre (client-side filtering - FIXED field name)
export const getBooksByGenre = async (genreId) => {
  const books = await getAllBooks();

  if (!genreId) return books;

  return books.filter((book) => book.GenreId === genreId); // ✅ GenreId với G hoa
};

// Get popular books (FIXED - use BookId as fallback sorting)
export const getPopularBooks = async (limit = 10) => {
  const books = await getAllBooks();

  // Since no createdAt field exists, sort by BookId (lower ID = older book)
  // You can change this logic based on your popularity criteria
  return books
    .sort((a, b) => {
      // Option 1: Sort by BookId descending (higher ID = newer)
      return b.BookId - a.BookId;

      // Option 2: If you have a popularity field later, use it:
      // return (b.popularity || 0) - (a.popularity || 0);
    })
    .slice(0, limit);
};

// Get recent books (FIXED - use BookId as sorting criteria)
export const getRecentBooks = async (limit = 10) => {
  const books = await getAllBooks();

  // Sort by BookId descending (assuming higher ID = more recent)
  return books.sort((a, b) => b.BookId - a.BookId).slice(0, limit);
};

// Enhanced search with author names (requires joining with authors)
export const searchBooksWithAuthors = async (searchTerm) => {
  if (!searchTerm) return await getAllBooks();

  // Get both books and authors
  const [books, authors] = await Promise.all([
    getAllBooks(),
    axiosInstance.get("/api/Author").then((res) => res.data),
  ]);

  // Create author lookup map
  const authorMap = authors.reduce((map, author) => {
    map[author.AuthorId] = author.Name;
    return map;
  }, {});

  const term = searchTerm.toLowerCase();

  return books.filter((book) => {
    const authorName = authorMap[book.AuthorId] || "";

    return (
      book.Title?.toLowerCase().includes(term) ||
      book.Isbn13?.toLowerCase().includes(term) ||
      authorName.toLowerCase().includes(term)
    );
  });
};

// Utility function to get books with author and genre info
export const getBooksWithDetails = async () => {
  // Get books and authors in parallel
  const [books, authors] = await Promise.all([
    getAllBooks(),
    axiosInstance.get("/api/Author").then((res) => res.data),
  ]);

  // Create author lookup map
  const authorMap = authors.reduce((map, author) => {
    map[author.AuthorId] = author;
    return map;
  }, {});

  // Enrich books with author info
  return books.map((book) => ({
    ...book,
    Author: authorMap[book.AuthorId] || null,
  }));
};
