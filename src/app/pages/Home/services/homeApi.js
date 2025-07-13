const url = "http://localhost:5067/api";

export const getUserBooks = async (page, size) => {
  try {
    const response = await fetch(`${url}/books?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
}