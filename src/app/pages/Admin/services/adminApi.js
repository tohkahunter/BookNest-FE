const url = "http://localhost:5067/api";

const getToken = () => localStorage.getItem("token");
export const getAllBooks = async () => {
  const response = await fetch(`${url}/Book`);
  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }
  return response.json();
};

export const getAllAuthors = async () => {
  const response = await fetch(`${url}/Author`);
  if (!response.ok) {
    throw new Error("Failed to fetch authors");
  }
  return response.json();
};

export const getAllGenres = async () => {
  const response = await fetch(`${url}/Genre`);
  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }
  return response.json();
};

export const addBook = async (bookData) => {
  const response = await fetch(`${url}/Book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(bookData),
  });

  // Read the error message from the response body if it fails
  if (!response.ok) {
    const errorText = await response.text(); // fallback if not JSON
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.message || "Failed to add book");
    } catch {
      throw new Error(errorText || "Failed to add book");
    }
  }

  return response.json();
};

export async function addAuthor(authorData) {
  try {
    const res = await fetch(`${url}/Author`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(authorData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to add author");
    }

    const data = await res.json();
    return data; // Must return { message, author: { authorId, name, ... } }
  } catch (error) {
    console.error("addAuthor error:", error);
    throw error;
  }
}

export const addGenre = async (genreData) => {
  const response = await fetch(`${url}/Genre`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(genreData),
  });
  if (!response.ok) {
    throw new Error("Failed to add genre");
  }
  return response.json();
};

export const updateBook = async (bookId, bookData) => {
  const response = await fetch(`${url}/Book/${bookId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(bookData),
  });
  if (!response.ok) {
    throw new Error("Failed to update book");
  }
  return response.json();
};

export const deleteBook = async (bookId) => {
  const response = await fetch(`${url}/Book/${bookId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete book");
  }
  return response.json();
};
