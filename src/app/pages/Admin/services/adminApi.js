const url = "http://localhost:5067/api";

export const getAllBooks = async () => {
    const response = await fetch(`${url}/Book`);
    if (!response.ok) {
        throw new Error("Failed to fetch books");
    }
    return response.json();
}

export const getAllAuthors = async () => {
    const response = await fetch(`${url}/Author`);
    if (!response.ok) {
        throw new Error("Failed to fetch authors");
    }
    return response.json();
}