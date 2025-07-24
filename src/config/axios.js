import axios from "axios";

const API_URL = "http://localhost:5067";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Thêm timeout 10 giây
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor - Tự động gắn token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Log request trong development mode (tùy chọn)
    if (process.env.NODE_ENV === "development") {
      console.log("🚀 API Request:", {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý response và errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response trong development mode (tùy chọn)
    if (process.env.NODE_ENV === "development") {
      console.log("✅ API Response:", {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Log error trong development mode
    if (process.env.NODE_ENV === "development") {
      console.error("❌ API Error:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Token hết hạn hoặc không hợp lệ
          console.warn("🔒 Authentication failed - redirecting to login");
          localStorage.removeItem("token");
          localStorage.removeItem("user"); // Xóa thêm user data

          // Chỉ redirect nếu không phải đang ở trang login
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;

        case 403:
          console.warn("🚫 Access forbidden");
          break;

        case 404:
          console.warn("🔍 Resource not found");
          break;

        case 422:
          console.warn("📝 Validation error:", error.response.data);
          break;

        case 500:
          console.error("🔥 Server error");
          break;

        default:
          console.error("❌ Unknown error:", error.message);
      }
    } else if (error.request) {
      console.error("📡 Network error - no response received");
    } else {
      console.error("⚙️ Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
