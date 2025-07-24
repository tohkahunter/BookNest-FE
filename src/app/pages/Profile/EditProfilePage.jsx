import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile"; // ✅ Fix import path
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Get profile data and actions
  const {
    user,
    isLoading,
    isAuthenticated,
    isUpdating,
    isUpdatingPassword,
    error,
    avatarUrl,
    updateProfile,
    updatePassword,
  } = useProfile();

  // Form state
  const [formData, setFormData] = useState({
    FirstName: user?.FirstName || "",
    LastName: user?.LastName || "",
    Email: user?.Email || "",
    ProfilePictureUrl: user?.ProfilePictureUrl || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  // Update form when user data loads
  React.useEffect(() => {
    if (user) {
      setFormData({
        FirstName: user.FirstName || "",
        LastName: user.LastName || "",
        Email: user.Email || "",
        ProfilePictureUrl: user.ProfilePictureUrl || "",
      });
    }
  }, [user]);

  // Password strength check
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const passwordStrength = checkPasswordStrength(passwordData.newPassword);

  const getStrengthColor = (score) => {
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (score) => {
    if (score <= 2) return "Yếu";
    if (score <= 3) return "Trung bình";
    if (score <= 4) return "Mạnh";
    return "Rất mạnh";
  };

  // Handle not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            You need to log in to edit your profile
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Login to continue
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading information...</p>
        </div>
      </div>
    );
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password input change
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear confirm password error when either password changes
    if (field === "confirmPassword" || field === "newPassword") {
      if (passwordErrors.confirmPassword) {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Validate password form
  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Please enter your current password";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Please enter your new password";
    } else if (passwordStrength.score < 3) {
      newErrors.newPassword = "Password is not strong enough";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password does not match";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    return newErrors;
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validatePasswordForm();
    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setPasswordErrors({});

    try {
      const result = await updatePassword(passwordData.newPassword);

      if (result.success) {
        toast.success(result.message || "Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.error || "Could not update password");
        if (result.error.includes("current password is incorrect")) {
          setPasswordErrors({ currentPassword: result.error });
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred, please try again");
    }
  };

  // ✅ FIXED: Remove window.location.reload() - Let event system handle updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.FirstName.trim()) {
      toast.error("Please enter your first name");
      return;
    }

    if (!formData.LastName.trim()) {
      toast.error("Please enter your last name");
      return;
    }

    if (!formData.Email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      toast.error("Email is not valid");
      return;
    }

    // Validate ProfilePictureUrl if provided
    if (formData.ProfilePictureUrl && !isValidUrl(formData.ProfilePictureUrl)) {
      toast.error("Profile picture URL is not valid");
      return;
    }

    // ✅ Prepare complete data with Username for API
    const updateData = {
      FirstName: formData.FirstName.trim(),
      LastName: formData.LastName.trim(),
      Email: formData.Email.trim(),
      Username: user?.Username || user?.username || "", // Required by API
    };

    // Only include ProfilePictureUrl if it's not empty
    if (formData.ProfilePictureUrl && formData.ProfilePictureUrl.trim()) {
      updateData.ProfilePictureUrl = formData.ProfilePictureUrl.trim();
    } else {
      updateData.ProfilePictureUrl = ""; // Send empty string
    }

    console.log("📋 Updating profile with data:", updateData);

    try {
      // Update profile
      const result = await updateProfile(updateData);

      console.log("✅ Update result:", result);

      if (result.success) {
        toast.success("Profile updated successfully!");

        // ✅ REMOVED: window.location.reload() - Let the event system handle updates
        // The useProfile mutation will trigger events that update Header automatically

        // Optional: Navigate back to profile after short delay
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      } else {
        console.error("❌ Update failed:", result.error);
        toast.error(result.error || "Could not update profile");
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate("/profile");
  };

  // Current avatar URL with cache busting
  const currentAvatarUrl =
    formData.ProfilePictureUrl || `${avatarUrl}?t=${Date.now()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-600">
            Update your profile information and avatar
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Avatar Settings
              </h2>

              {/* Avatar Display */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200 mb-4">
                  <img
                    src={currentAvatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const name = `${user?.FirstName || ""} ${
                        user?.LastName || ""
                      }`.trim();
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        name
                      )}&background=f97316&color=ffffff&size=128&font-size=0.4`;
                    }}
                  />
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  ✨ Enter a valid image URL
                </p>
              </div>

              {/* Avatar URL Input */}
              <div className="space-y-3">
                <label
                  htmlFor="ProfilePictureUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL avatar
                </label>
                <input
                  type="url"
                  id="ProfilePictureUrl"
                  name="ProfilePictureUrl"
                  value={formData.ProfilePictureUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Forms Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="FirstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="FirstName"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="LastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="LastName"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={`@${user?.Username || ""}`}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Username cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={
                        user?.RoleId === 1
                          ? "Admin"
                          : user?.RoleId === 2
                          ? "User"
                          : "User"
                      }
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-orange-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      className={`text-gray-700 w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        passwordErrors.currentPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      className={`text-gray-700 w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        passwordErrors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordData.newPassword && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">
                          Password strength:
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            passwordStrength.score <= 2
                              ? "text-red-500"
                              : passwordStrength.score <= 3
                              ? "text-yellow-500"
                              : passwordStrength.score <= 4
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {getStrengthText(passwordStrength.score)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                            passwordStrength.score
                          )}`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.length
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordStrength.checks.length ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <X className="w-3 h-3 mr-1" />
                          )}
                          At least 8 characters
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.uppercase
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordStrength.checks.uppercase ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <X className="w-3 h-3 mr-1" />
                          )}
                          Uppercase letter
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.lowercase
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordStrength.checks.lowercase ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <X className="w-3 h-3 mr-1" />
                          )}
                          Lowercase letter
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.number
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {passwordStrength.checks.number ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <X className="w-3 h-3 mr-1" />
                          )}
                          Number
                        </div>
                        <div
                          className={`flex items-center ${
                            passwordStrength.checks.special
                              ? "text-green-600"
                              : "text-gray-400"
                          } col-span-2`}
                        >
                          {passwordStrength.checks.special ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <X className="w-3 h-3 mr-1" />
                          )}
                          Special character (!@#$%^&*...)
                        </div>
                      </div>
                    </div>
                  )}

                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      className={`text-gray-700 w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        passwordErrors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <X className="w-4 h-4 mr-1" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Password Form Actions */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isUpdatingPassword}
                    className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
