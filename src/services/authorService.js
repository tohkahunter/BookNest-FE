import axiosInstance from "../config/axios";

// Get all authors
export const getAllAuthors = async () => {
  const response = await axiosInstance.get("/api/Author");
  return response.data;
};

// Get author by ID
export const getAuthorById = async (id) => {
  const response = await axiosInstance.get(`/api/Author/${id}`);
  return response.data;
};

// Get all books by an author
export const getBooksByAuthor = async (authorId) => {
  const response = await axiosInstance.get(`/api/Author/${authorId}/books`);
  return response.data;
};

// Search authors by name (client-side filtering)
export const searchAuthors = async (searchTerm) => {
  const authors = await getAllAuthors();

  if (!searchTerm) return authors;

  const term = searchTerm.toLowerCase();
  return authors.filter((author) => author.name?.toLowerCase().includes(term));
};

// Get popular authors (based on number of books)
export const getPopularAuthors = async (limit = 10) => {
  // For now, just get all authors and return first {limit} authors
  // TODO: Backend should provide popular authors endpoint
  const authors = await getAllAuthors();
  return authors.slice(0, limit).map((author) => ({
    ...author,
    bookCount: 0, // Placeholder
  }));
};

// Get authors with book counts (utility function)
export const getAuthorsWithBookCounts = async () => {
  const authors = await getAllAuthors();

  // Instead of calling API for each author (which causes undefined errors),
  // return authors with bookCount set to 0 for now
  // TODO: Backend should provide book counts in the authors API response
  return authors.map((author) => ({
    ...author,
    bookCount: 0, // Placeholder - backend should provide this
  }));
};
