// src/services/genreService.js
import axiosInstance from "../config/axios";

export const genreService = {
  // 📚 Get all genres
  getAllGenres: async () => {
    try {
      const response = await axiosInstance.get("/api/genre");
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch genres:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch genres"
      );
    }
  },

  // 📖 Get genre by ID
  getGenreById: async (id) => {
    try {
      const response = await axiosInstance.get(`/api/genre/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch genre ${id}:`, error);
      throw new Error(
        error.response?.data?.message || `Failed to fetch genre with ID ${id}`
      );
    }
  },

  // ✅ Create new genre (Admin only)
  createGenre: async (genreData) => {
    try {
      const response = await axiosInstance.post("/api/genre", genreData);
      console.log("✅ Genre created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create genre:", error);

      // Handle validation errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          throw new Error(errorData);
        } else if (errorData.errors) {
          // Model validation errors
          const errorMessages = Object.values(errorData.errors).flat();
          throw new Error(errorMessages.join(", "));
        }
      }

      throw new Error(
        error.response?.data?.message || "Failed to create genre"
      );
    }
  },

  // ✏️ Update genre (Admin only)
  updateGenre: async (id, genreData) => {
    try {
      const response = await axiosInstance.put(`/api/genre/${id}`, {
        ...genreData,
        GenreId: id,
      });
      console.log("✅ Genre updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to update genre ${id}:`, error);

      // Handle validation errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (typeof errorData === "string") {
          throw new Error(errorData);
        } else if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat();
          throw new Error(errorMessages.join(", "));
        }
      }

      throw new Error(
        error.response?.data?.message || "Failed to update genre"
      );
    }
  },

  // 🗑️ Delete genre (Admin only)
  deleteGenre: async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/genre/${id}`);
      console.log("✅ Genre deleted successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to delete genre ${id}:`, error);

      if (error.response?.status === 400) {
        // Genre has books associated
        throw new Error(
          error.response.data?.Message ||
            "Cannot delete genre with associated books"
        );
      }

      throw new Error(
        error.response?.data?.message || "Failed to delete genre"
      );
    }
  },
};

// Export default
export default genreService;
