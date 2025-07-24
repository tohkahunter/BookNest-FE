// src/hooks/queries/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken,
} from "../../services/authService";
import axiosInstance from "../../config/axios"; // ✅ ADD: Import axiosInstance

// ==================== QUERY HOOKS ====================

// Hook để lấy current user (từ localStorage, có thể extend để call API)
export const useCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: () => {
      const user = getCurrentUser();
      if (!user) {
        throw new Error("No authenticated user");
      }
      return user;
    },
    enabled: isAuthenticated(), // Chỉ chạy khi đã login
    staleTime: 10 * 60 * 1000, // 10 phút
    cacheTime: 15 * 60 * 1000, // 15 phút
    retry: false, // Không retry nếu không có user
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

// Hook để login - match exactly với authService.login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => {
      // ✅ Gọi service với exact signature
      return login({ email, password });
    },

    onSuccess: (data) => {
      console.log("Login success, received data:", data);

      // ✅ authService.login đã tự động save token và user vào localStorage
      // Giờ cập nhật React Query cache

      if (data.user) {
        // Set user data trong cache
        queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, data.user);
      }

      // Invalidate tất cả user-related queries để refetch fresh data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_STATS });

      // Clear any book-in-library cache vì user mới login
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] === "book-in-library",
      });
    },

    onError: (error) => {
      console.error("Login error:", error);
      // Clear any stale auth data
      logout();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
    },
  });
};

// Hook để register - match exactly với authService.register
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, email, password, firstName, lastName }) => {
      // ✅ Gọi service với exact signature từ authService
      return register({ username, email, password, firstName, lastName });
    },

    onSuccess: (data) => {
      console.log("Register success:", data);
      // Register success - có thể auto login hoặc redirect to login
    },

    onError: (error) => {
      console.error("Register error:", error);
    },
  });
};

// Hook để logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      // ✅ Gọi logout từ authService (clear localStorage)
      logout();
      return Promise.resolve();
    },

    onSuccess: () => {
      // Clear tất cả cache liên quan đến user
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_BOOKS });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_SHELVES });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_STATS });
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] === "book-in-library",
      });

      // Optional: Clear entire cache để đảm bảo clean state
      // queryClient.clear();

      console.log("Logout successful, cache cleared");
    },

    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};

// Hook để update user profile (nếu có API endpoint)
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => {
      // Update localStorage (tạm thời - nên có API endpoint)
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // TODO: Thay bằng API call khi có endpoint
      // return updateUserProfile(userData);

      return Promise.resolve(updatedUser);
    },

    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, updatedUser);
      console.log("User profile updated:", updatedUser);
    },

    onError: (error) => {
      console.error("Update user error:", error);
    },
  });
};

// ==================== MAIN AUTH HOOK ====================

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Local state cho immediate auth checks (synchronous)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // React Query hooks
  const currentUserQuery = useCurrentUser({
    enabled: isAuthenticated(),
  });

  // Mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  const updateUserMutation = useUpdateUserProfile();

  // ✅ UPDATED: Initialize auth state với profile data fetching
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const currentUser = getCurrentUser();

      if (token && currentUser) {
        console.log("🔄 Initializing auth with user:", currentUser);

        // ✅ NEW: If user data is incomplete, fetch fresh profile data
        const needsProfileData =
          !currentUser.FirstName || !currentUser.LastName;

        if (needsProfileData && currentUser.id) {
          try {
            console.log(
              "📡 Fetching fresh profile data for user:",
              currentUser.id
            );

            const profileResponse = await axiosInstance.get(
              `/api/User/${currentUser.id}`
            );
            const profileData = profileResponse.data;

            const completeUser = {
              ...currentUser,
              FirstName: profileData.FirstName || "",
              LastName: profileData.LastName || "",
              ProfilePictureUrl: profileData.ProfilePictureUrl || null,
              RegistrationDate: profileData.RegistrationDate,
              LastLoginDate: profileData.LastLoginDate,
              IsActive: profileData.IsActive,
            };

            console.log("✅ Updated user with profile data:", completeUser);

            // Update localStorage and state
            localStorage.setItem("user", JSON.stringify(completeUser));
            setUser(completeUser);
            queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, completeUser);
          } catch (profileError) {
            console.error("Failed to fetch profile during init:", profileError);
            // Use existing user data as fallback
            setUser(currentUser);
            queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, currentUser);
          }
        } else {
          // User data is already complete
          setUser(currentUser);
          queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, currentUser);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error initializing auth:", err);
      logout(); // Clear corrupted data
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

  // ✅ UPDATED: Enhanced login function với complete user data
  const loginUser = useCallback(
    async (email, password) => {
      try {
        setError(null);

        const result = await loginMutation.mutateAsync({ email, password });

        if (result.user && result.token) {
          console.log("📝 Basic user from login:", result.user);

          // ✅ NEW: Fetch complete profile data
          try {
            const profileResponse = await axiosInstance.get(
              `/api/User/${result.user.id}`
            );
            const profileData = profileResponse.data;

            console.log("👤 Complete profile data:", profileData);

            // Merge basic login data with complete profile data
            const completeUser = {
              id: result.user.id,
              email: result.user.email,
              username: result.user.username,
              roleId: result.user.roleId,
              FirstName: profileData.FirstName || "",
              LastName: profileData.LastName || "",
              ProfilePictureUrl: profileData.ProfilePictureUrl || null,
              RegistrationDate: profileData.RegistrationDate,
              LastLoginDate: profileData.LastLoginDate,
              IsActive: profileData.IsActive,
            };

            console.log("🎯 Final complete user:", completeUser);

            // Update localStorage with complete data
            localStorage.setItem("user", JSON.stringify(completeUser));
            setUser(completeUser);
            queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, completeUser);

            return { success: true, data: { ...result, user: completeUser } };
          } catch (profileError) {
            console.error("Failed to fetch profile data:", profileError);
            setUser(result.user);
            return {
              success: true,
              data: result,
              warning: "Profile data incomplete",
            };
          }
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Đăng nhập thất bại";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [loginMutation, queryClient]
  );

  // Enhanced register function
  const registerUser = useCallback(
    async (userData) => {
      try {
        setError(null);
        const result = await registerMutation.mutateAsync(userData);
        return { success: true, data: result };
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Đăng ký thất bại";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
          errors: err.response?.data?.errors || null,
        };
      }
    },
    [registerMutation]
  );

  // Enhanced logout function
  const logoutUser = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, error: "Có lỗi khi đăng xuất" };
    }
  }, [logoutMutation]);

  // Enhanced update user function
  const updateUser = useCallback(
    async (newUserData) => {
      try {
        const updatedUser = await updateUserMutation.mutateAsync(newUserData);
        setUser(updatedUser);
        return { success: true, data: updatedUser };
      } catch (err) {
        console.error("Error updating user:", err);
        return { success: false, error: "Không thể cập nhật thông tin user" };
      }
    },
    [updateUserMutation]
  );

  // Utility functions using authService functions
  const hasRole = useCallback(
    (roleName) => {
      return user?.role?.roleName === roleName;
    },
    [user]
  );

  const isAdmin = useCallback(() => {
    return hasRole("Admin");
  }, [hasRole]);

  const clearError = useCallback(() => {
    setError(null);
    loginMutation.reset();
    registerMutation.reset();
    updateUserMutation.reset();
  }, [loginMutation, registerMutation, updateUserMutation]);

  const refreshAuth = useCallback(() => {
    initializeAuth();
    if (isAuthenticated()) {
      currentUserQuery.refetch();
    }
  }, [initializeAuth, currentUserQuery]);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ✅ NEW: Listen for profile updates from useProfile
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedUserData = event.detail;
      console.log(
        "🔄 Profile update event received in useAuth:",
        updatedUserData
      );

      // Update local state immediately
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedUserData,
      }));

      // Update localStorage
      const currentUser = getCurrentUser();
      if (currentUser) {
        const mergedUser = { ...currentUser, ...updatedUserData };
        localStorage.setItem("user", JSON.stringify(mergedUser));
        console.log("💾 Updated localStorage with:", mergedUser);
      }

      // Update React Query cache
      queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, updatedUserData);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [queryClient]);

  // ✅ ENHANCED: Better localStorage sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (!e.newValue) {
          // Token was removed
          setUser(null);
          queryClient.removeQueries({ queryKey: QUERY_KEYS.USER_PROFILE });
        }
      } else if (e.key === "user" && e.newValue) {
        // User data was updated
        try {
          const newUser = JSON.parse(e.newValue);
          console.log("📱 User data changed in localStorage:", newUser);

          // Only update if data actually changed
          if (JSON.stringify(user) !== JSON.stringify(newUser)) {
            setUser(newUser);
            queryClient.setQueryData(QUERY_KEYS.USER_PROFILE, newUser);
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.USER_PROFILE,
            });
          }
        } catch (err) {
          console.error("Error parsing user data from storage:", err);
        }
      }
    };

    // Listen for cross-tab changes
    window.addEventListener("storage", handleStorageChange);

    // ✅ CRITICAL: Also listen for same-tab localStorage changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      const oldValue = localStorage.getItem(key);
      originalSetItem.apply(this, arguments);

      if (key === "user" && value !== oldValue) {
        // Trigger storage event for same tab
        handleStorageChange({ key, newValue: value, oldValue });
      }
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, [queryClient, user]);

  //update password

  // Sync với React Query state khi có data
  useEffect(() => {
    if (currentUserQuery.data && !currentUserQuery.isLoading) {
      setUser(currentUserQuery.data);
    }
  }, [currentUserQuery.data, currentUserQuery.isLoading]);

  // Combined loading state
  const isLoading =
    loading ||
    currentUserQuery.isLoading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending ||
    updateUserMutation.isPending;

  // Combined error state
  const authError =
    error ||
    currentUserQuery.error?.message ||
    loginMutation.error?.message ||
    registerMutation.error?.message ||
    logoutMutation.error?.message ||
    updateUserMutation.error?.message;

  return {
    // Auth state (compatible với old hook)
    user,
    loading: isLoading,
    error: authError,
    isAuthenticated: isAuthenticated(), // ✅ Direct từ authService
    token: getToken(), // ✅ Direct từ authService

    // Auth actions (compatible với old hook)
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    updateUser,

    // Utilities (compatible với old hook)
    hasRole,
    isAdmin,
    clearError,
    refreshAuth,

    // Additional React Query specific
    queries: {
      currentUser: currentUserQuery,
    },

    mutations: {
      login: loginMutation,
      register: registerMutation,
      logout: logoutMutation,
      updateUser: updateUserMutation,
    },

    // Direct access to authService functions
    authService: {
      isAuthenticated,
      getCurrentUser,
      getToken,
    },
  };
};
