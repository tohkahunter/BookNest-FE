// src/hooks/queries/useProfile.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../lib/queryKeys";
import { useAuth } from "./useAuth";
import axiosInstance from "../../config/axios"; // ✅ Import axios instance

// ==================== API SERVICES ====================

// Get user profile by ID
const getUserProfile = async (userId) => {
  console.log("getUserProfile called with userId:", userId);

  if (!userId) {
    throw new Error("Missing userId");
  }

  // ✅ Check token availability
  const token = localStorage.getItem("token");
  console.log("Token check:", {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + "..." : "null",
  });

  const response = await axiosInstance.get(`/api/User/${userId}`);
  return response.data;
};

// Update user profile
const updateUserProfile = async (userId, userData) => {
  if (!userId) {
    throw new Error("Missing userId");
  }

  console.log("updateUserProfile called with:", {
    userId,
    userData,
  });

  // ✅ FIXED: Include ALL required fields that API expects
  const apiData = {
    Username: userData.Username || "", // ✅ ADDED - Required by API
    Email: userData.Email?.trim() || "",
    FirstName: userData.FirstName?.trim() || "",
    LastName: userData.LastName?.trim() || "",
    ProfilePictureUrl: userData.ProfilePictureUrl?.trim() || "",
  };

  // Handle empty ProfilePictureUrl
  if (!apiData.ProfilePictureUrl) {
    apiData.ProfilePictureUrl = ""; // Keep as empty string
  }

  console.log("📤 Sending complete data to API:", apiData);

  try {
    const response = await axiosInstance.put(`/api/User/${userId}`, apiData);
    console.log("✅ Profile update successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Profile update failed:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestData: apiData,
      url: error.config?.url,
    });
    throw error;
  }
};

// Update user password
const updateUserPassword = async (userId, newPassword) => {
  if (!userId) {
    throw new Error("Missing userId");
  }

  if (!newPassword) {
    throw new Error("New password is required");
  }

  console.log("updateUserPassword called with userId:", userId);

  try {
    const response = await axiosInstance.put(
      `/api/User/${userId}/password`,
      JSON.stringify(newPassword), // API chỉ nhận newPassword string
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Password update successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Password update failed:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

// ==================== QUERY HOOKS ====================

// Hook to get current user profile
export const useUserProfile = (userId, options = {}) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

// Hook to get current user's own profile
export const useMyProfile = (options = {}) => {
  const { user, isAuthenticated } = useAuth();

  // ✅ Debug auth state
  console.log("useMyProfile - Auth state:", {
    user,
    userId: user?.id,
    isAuthenticated,
    hasToken: !!localStorage.getItem("token"),
  });

  return useQuery({
    queryKey: QUERY_KEYS.MY_PROFILE,
    queryFn: () => {
      console.log("Profile query executing with user:", user);
      return getUserProfile(user?.id);
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      console.log("Profile query retry:", {
        failureCount,
        error: error?.message,
        status: error?.response?.status,
      });

      // Don't retry on auth errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
    onError: (error) => {
      console.error("Profile query error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    },
    ...options,
  });
};

// ==================== MUTATION HOOKS ====================

// ✅ FIXED: Hook to update user profile with proper sync
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuth();

  return useMutation({
    mutationFn: (userData) => {
      console.log("🔄 Profile update mutation called:", {
        userData,
        userId: user?.id,
      });
      return updateUserProfile(user?.id, userData);
    },

    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.MY_PROFILE });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData(QUERY_KEYS.MY_PROFILE);

      // Optimistically update profile cache
      queryClient.setQueryData(QUERY_KEYS.MY_PROFILE, (old) => ({
        ...old,
        ...newData,
      }));

      return { previousProfile };
    },

    onSuccess: async (updatedProfile) => {
      console.log("✅ Profile updated successfully:", updatedProfile);

      // ✅ CRITICAL: Update React Query cache first
      queryClient.setQueryData(QUERY_KEYS.MY_PROFILE, updatedProfile);

      // ✅ CRITICAL: Update useAuth localStorage + state
      const authUpdateData = {
        FirstName: updatedProfile.FirstName,
        LastName: updatedProfile.LastName,
        Email: updatedProfile.Email,
        ProfilePictureUrl: updatedProfile.ProfilePictureUrl,
      };

      console.log("🔄 Syncing with useAuth:", authUpdateData);
      await updateUser(authUpdateData);

      // ✅ CRITICAL: Force invalidate to trigger re-renders
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PROFILE });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_PROFILE });

      // ✅ CRITICAL: Trigger custom event for immediate header update
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: {
            ...user,
            ...authUpdateData,
          },
        })
      );
    },

    onError: (error, newData, context) => {
      console.error("❌ Profile update failed:", error);

      // Rollback optimistic update
      if (context?.previousProfile) {
        queryClient.setQueryData(
          QUERY_KEYS.MY_PROFILE,
          context.previousProfile
        );
      }
    },
  });
};

// Hook to update password
export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (newPassword) => {
      console.log("🔄 Password update mutation called for userId:", user?.id);
      return updateUserPassword(user?.id, newPassword);
    },

    onSuccess: (data) => {
      console.log("✅ Password updated successfully:", data);

      // Optional: Có thể invalidate user session để force re-login
      // hoặc chỉ show success message

      // Không cần update cache vì password không được cache
    },

    onError: (error) => {
      console.error("❌ Password update failed:", error);

      // Log chi tiết error để debug
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    },
  });
};

// ==================== MAIN PROFILE HOOK ====================

export const useProfile = () => {
  const { user, isAuthenticated, token, loading: authLoading } = useAuth();

  // Get profile data
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useMyProfile({
    // ✅ Don't throw error if API fails, use auth data as fallback
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutations
  const updateProfileMutation = useUpdateProfile();
  const updatePasswordMutation = useUpdatePassword();

  // ==================== COMPUTED VALUES ====================

  // ✅ Map auth user to expected format + merge with profile data
  const normalizedUser = user
    ? {
        UserId: user.id,
        Username: user.username,
        Email: user.email,
        RoleId: user.roleId,
        FirstName: user.firstName || "",
        LastName: user.lastName || "",
        IsActive: user.isActive !== false,
        RegistrationDate: user.registrationDate,
        LastLoginDate: user.lastLoginDate,
        ProfilePictureUrl: user.profilePictureUrl,
        // Arrays for stats - these will be from API data
        Books: [],
        Reviews: [],
        BookShelves: [],
        Comments: [],
      }
    : null;

  // Combined user data (profile API takes priority, but fallback to auth)
  const displayUser = profileData || normalizedUser;

  // ✅ Debug log to see what data we have
  console.log("useProfile Debug:", {
    authUser: user,
    profileData,
    normalizedUser,
    displayUser,
    hasProfileData: !!profileData,
    hasAuthUser: !!user,
    profileError: profileError?.message,
    apiCallEnabled: !!user?.id && isAuthenticated,
  });

  // Loading states - only show loading if we don't have fallback data
  const isLoading = authLoading || (isProfileLoading && !normalizedUser);

  // Error states - only show error if we don't have any user data
  const error = !displayUser
    ? profileError?.message || "No user data available"
    : null;

  // Mutation loading states
  const isUpdating = updateProfileMutation.isPending;
  const isUpdatingPassword = updatePasswordMutation.isPending;

  // ==================== HELPER FUNCTIONS ====================

  // Generate avatar URL
  const getAvatarUrl = (userData = displayUser) => {
    // ✅ Check multiple possible field names
    const avatarUrl =
      userData?.ProfilePictureUrl ||
      userData?.profilePictureUrl ||
      userData?.avatarUrl;

    if (avatarUrl && avatarUrl.trim()) {
      // ✅ Handle relative URLs by adding base URL if needed
      if (avatarUrl.startsWith("/")) {
        return `http://localhost:5067${avatarUrl}`;
      }
      return avatarUrl;
    }

    const name = `${userData?.FirstName || ""} ${
      userData?.LastName || ""
    }`.trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=f97316&color=ffffff&size=128&font-size=0.4`;
  };

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatLastLogin = (dateString) => {
    if (!dateString) return "Chưa đăng nhập";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Last day";
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("vi-VN");
  };

  // ==================== ACTION FUNCTIONS ====================

  // Update profile function (now includes avatar URL)
  const updateProfile = async (userData) => {
    try {
      const result = await updateProfileMutation.mutateAsync(userData);
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Không thể cập nhật profile",
      };
    }
  };

  // Update password function
  const updatePassword = async (newPassword) => {
    try {
      if (!user?.id) {
        throw new Error("No authenticated user found");
      }

      const result = await updatePasswordMutation.mutateAsync(newPassword);
      return {
        success: true,
        data: result,
        message: "Mật khẩu đã được cập nhật thành công",
      };
    } catch (error) {
      let errorMessage = "Cập nhật mật khẩu thất bại";

      if (error.response?.status === 401) {
        errorMessage = "Bạn không có quyền thực hiện thao tác này";
      } else if (error.response?.status === 404) {
        errorMessage = "Không tìm thấy người dùng";
      } else if (error.response?.status === 400) {
        errorMessage = "Mật khẩu hiện tại không đúng";
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Refresh profile data
  const refreshProfile = () => {
    refetchProfile();
  };

  // ==================== RETURN OBJECT ====================

  return {
    // Data
    user: displayUser,
    profileData,

    // States
    isLoading,
    isUpdating,
    isUpdatingPassword,
    isAuthenticated,
    error,

    // Computed values
    avatarUrl: getAvatarUrl(),
    formattedRegistrationDate: formatDate(displayUser?.RegistrationDate),
    formattedLastLogin: formatLastLogin(displayUser?.LastLoginDate),

    // Actions
    updateProfile,
    updatePassword,
    refreshProfile,

    // Utilities
    getAvatarUrl,
    formatDate,
    formatLastLogin,

    // Raw mutations (for advanced usage)
    mutations: {
      updateProfile: updateProfileMutation,
      updatePassword: updatePasswordMutation,
    },
  };
};
