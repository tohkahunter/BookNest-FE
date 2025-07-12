// utils/auth.js
// Helper functions cho authentication

/**
 * Lấy thông tin user từ localStorage
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

/**
 * Lấy token từ localStorage
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Kiểm tra user có đăng nhập không
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Decode JWT token (không verify signature)
 */
export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error parsing JWT:", e);
    return null;
  }
};

/**
 * Lấy username từ nhiều nguồn
 */
export const getUsername = () => {
  // Ưu tiên lấy từ user object
  const user = getCurrentUser();
  if (user?.username) {
    return user.username;
  }

  // Fallback: decode từ JWT
  const token = getToken();
  if (token) {
    const payload = parseJwt(token);
    return (
      payload?.username ||
      payload?.name ||
      payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      payload?.email?.split("@")[0] ||
      ""
    );
  }

  return "";
};

/**
 * Lấy email từ nhiều nguồn
 */
export const getUserEmail = () => {
  // Ưu tiên lấy từ user object
  const user = getCurrentUser();
  if (user?.email) {
    return user.email;
  }

  // Fallback: decode từ JWT
  const token = getToken();
  if (token) {
    const payload = parseJwt(token);
    return (
      payload?.email ||
      payload?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] ||
      ""
    );
  }

  return "";
};

/**
 * Xóa tất cả thông tin authentication
 */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Lưu thông tin authentication
 */
export const saveAuth = (token, user) => {
  if (token) {
    localStorage.setItem("token", token);
  }
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

/**
 * Trigger custom event để thông báo auth state thay đổi
 */
export const triggerAuthChange = () => {
  window.dispatchEvent(new CustomEvent("authStateChange"));
};

/**
 * Listen cho auth state changes
 */
export const onAuthChange = (callback) => {
  const handleAuthChange = () => callback();
  window.addEventListener("authStateChange", handleAuthChange);

  // Return cleanup function
  return () => {
    window.removeEventListener("authStateChange", handleAuthChange);
  };
};
