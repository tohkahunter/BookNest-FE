import axiosInstance from "../config/axios";

export const login = async ({ email, password }) => {
  const res = await axiosInstance.post("/login", {
    Email: email, // Backend expect uppercase
    Password: password, // Backend expect uppercase
  });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);

    // Lưu thêm user info để sử dụng sau này
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
  }

  return res.data;
};

export const register = async ({
  username,
  email,
  password,
  firstName,
  lastName,
}) => {
  // Convert frontend data (lowercase) to backend format (uppercase)
  const requestData = {
    Username: username, // Backend expect Username (uppercase U)
    Email: email, // Backend expect Email (uppercase E)
    Password: password, // Backend expect Password (uppercase P)
    FirstName: firstName, // Backend expect FirstName (uppercase F)
    LastName: lastName, // Backend expect LastName (uppercase L)
  };

  console.log("Frontend data received:", {
    username,
    email,
    password,
    firstName,
    lastName,
  });
  console.log("Sending to backend:", requestData);

  const response = await axiosInstance.post("/register", requestData);
  return response.data;
};

// Thêm các utility functions hữu ích
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};
