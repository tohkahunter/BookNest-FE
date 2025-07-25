const url = "https://booknest-be-yynn.onrender.com";

const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Using token:", token ? "Token present" : "No token found");
  return token;
};

// Generate a random ISBN-13 in correct format
export const generateRandomISBN = () => {
  // ISBN-13 starts with 978 or 979 (standard book identifier)
  const prefix = Math.random() < 0.8 ? "978" : "979";

  // Generate 9 random digits for the middle part
  let digits = prefix;
  for (let i = 0; i < 9; i++) {
    digits += Math.floor(Math.random() * 10);
  }

  // Calculate check digit using ISBN-13 algorithm
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits[i]);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  const isbn = digits + checkDigit;

  return isbn;
};
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

export const deleteAuthor = async (authorId) => {
  console.log("Deleting author:", { authorId }); // Debug log
  const response = await fetch(`${url}/Author/${authorId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Delete author error:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(
        errorJson.message || `Failed to delete author (${response.status})`
      );
    } catch {
      throw new Error(
        `Failed to delete author: ${errorText || response.statusText}`
      );
    }
  }
  return response.json();
};

export const updateAuthor = async (authorId, authorData) => {
  console.log("Updating author:", { authorId, authorData }); // Debug log
  const response = await fetch(`${url}/Author/${authorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(authorData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update author error:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(
        errorJson.message || `Failed to update author (${response.status})`
      );
    } catch {
      throw new Error(
        `Failed to update author: ${errorText || response.statusText}`
      );
    }
  }
  return response.json();
};

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

export const deleteGenre = async (genreId) => {
  console.log("Deleting genre:", { genreId }); // Debug log
  const response = await fetch(`${url}/Genre/${genreId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Delete genre error:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(
        errorJson.message || `Failed to delete genre (${response.status})`
      );
    } catch {
      throw new Error(
        `Failed to delete genre: ${errorText || response.statusText}`
      );
    }
  }
  return response.json();
};

export const updateGenre = async (genreId, genreData) => {
  console.log("Updating genre:", { genreId, genreData }); // Debug log
  const response = await fetch(`${url}/Genre/${genreId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(genreData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update genre error:", errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(
        errorJson.message || `Failed to update genre (${response.status})`
      );
    } catch {
      throw new Error(
        `Failed to update genre: ${errorText || response.statusText}`
      );
    }
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
