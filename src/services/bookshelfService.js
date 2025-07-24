import axiosInstance from "../config/axios";

// ===== READING STATUS MANAGEMENT =====

// Add book to user's library
export const addBookToShelf = async ({ bookId, statusId, shelfId = null }) => {
  const response = await axiosInstance.post("/api/BookShelf/add-book", {
    BookId: bookId, // Backend expects uppercase
    StatusId: statusId, // Backend expects uppercase
    ShelfId: shelfId, // Backend expects uppercase
  });
  return response.data;
};

// Update book reading status
export const updateBookStatus = async ({ bookId, newStatusId }) => {
  const response = await axiosInstance.put("/api/BookShelf/update-status", {
    BookId: bookId, // Backend expects uppercase
    NewStatusId: newStatusId, // Backend expects uppercase
  });
  return response.data;
};

// Update reading progress
export const updateReadingProgress = async ({
  bookId,
  currentPage = null,
  readingProgress = null,
  notes = null,
}) => {
  const response = await axiosInstance.put("/api/BookShelf/update-progress", {
    BookId: bookId, // Backend expects uppercase
    CurrentPage: currentPage, // Backend expects uppercase
    ReadingProgress: readingProgress, // Backend expects uppercase
    Notes: notes, // Backend expects uppercase
  });
  return response.data;
};

// Remove book from library
export const removeBookFromShelf = async (bookId) => {
  const response = await axiosInstance.delete(
    `/api/BookShelf/remove-book/${bookId}`
  );
  return response.data;
};

// ===== VIEW USER'S BOOKS =====

// Get all user's books (with optional filters)
export const getMyBooks = async ({ statusId = null, shelfId = null } = {}) => {
  const params = new URLSearchParams();
  if (statusId) params.append("statusId", statusId);
  if (shelfId) params.append("shelfId", shelfId);

  const queryString = params.toString();
  const url = `/api/BookShelf/my-books${queryString ? `?${queryString}` : ""}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

// Get books by specific status
export const getBooksByStatus = async (statusId) => {
  const response = await axiosInstance.get(`/api/BookShelf/status/${statusId}`);
  return response.data;
};

// Get books by specific shelf
export const getBooksByShelf = async (shelfId) => {
  const response = await axiosInstance.get(`/api/BookShelf/shelf/${shelfId}`);
  return response.data;
};

// Get specific user book details
export const getUserBook = async (bookId) => {
  const response = await axiosInstance.get(`/api/BookShelf/book/${bookId}`);
  return response.data;
};

// ===== CUSTOM SHELVES MANAGEMENT =====

// Create custom shelf
export const createShelf = async ({ shelfName, description = null }) => {
  const response = await axiosInstance.post("/api/BookShelf/create-shelf", {
    ShelfName: shelfName, // Backend expects uppercase
    Description: description, // Backend expects uppercase
  });
  return response.data;
};

// Update custom shelf
export const updateShelf = async ({
  shelfId,
  shelfName,
  description = null,
  displayOrder = null,
}) => {
  const response = await axiosInstance.put("/api/BookShelf/update-shelf", {
    ShelfId: shelfId, // Backend expects uppercase
    ShelfName: shelfName, // Backend expects uppercase
    Description: description, // Backend expects uppercase
    DisplayOrder: displayOrder, // Backend expects uppercase
  });
  return response.data;
};

// Delete custom shelf
export const deleteShelf = async (shelfId) => {
  const response = await axiosInstance.delete(
    `/api/BookShelf/delete-shelf/${shelfId}`
  );
  return response.data;
};

// Get user's custom shelves
export const getMyShelves = async () => {
  const response = await axiosInstance.get("/api/BookShelf/my-shelves");
  return response.data;
};

// Move book between shelves
export const moveBookToShelf = async ({ bookId, newShelfId }) => {
  const response = await axiosInstance.put("/api/BookShelf/move-book", {
    BookId: bookId, // Backend expects uppercase
    NewShelfId: newShelfId, // Backend expects uppercase
  });
  return response.data;
};

// ===== READING STATUSES =====

// Get all available reading statuses (public endpoint)
export const getReadingStatuses = async () => {
  const response = await axiosInstance.get("/api/BookShelf/reading-statuses");
  return response.data;
};

// ===== UTILITY FUNCTIONS =====

// Check if book exists in user's library
export const checkBookInLibrary = async (bookId) => {
  const response = await axiosInstance.get(
    `/api/BookShelf/check-book/${bookId}`
  );
  return response.data;
};

// Quick add book with default status (Want to Read)
export const quickAddBook = async (bookId) => {
  return await addBookToShelf({
    bookId,
    statusId: 1, // Assuming 1 = "Want to Read"
    shelfId: null,
  });
};

// Mark book as currently reading
export const startReading = async (bookId) => {
  return await updateBookStatus({
    bookId,
    newStatusId: 2, // Assuming 2 = "Currently Reading"
  });
};

// Mark book as finished
export const finishReading = async (bookId) => {
  return await updateBookStatus({
    bookId,
    newStatusId: 3, // Assuming 3 = "Read"
  });
};
