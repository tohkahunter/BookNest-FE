import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile"; // ✅ Fix import path
import { toast } from "react-hot-toast";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Get profile data and actions
  const {
    user,
    isLoading,
    isAuthenticated,
    isUpdating,
    error,
    avatarUrl,
    updateProfile,
  } = useProfile();

  // Form state
  const [formData, setFormData] = useState({
    FirstName: user?.FirstName || "",
    LastName: user?.LastName || "",
    Email: user?.Email || "",
    ProfilePictureUrl: user?.ProfilePictureUrl || "",
  });

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

  // Handle not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bạn cần đăng nhập
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Đăng nhập
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
          <p className="text-gray-600">Đang tải thông tin...</p>
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.FirstName.trim()) {
      toast.error("Vui lòng nhập họ và tên đệm");
      return;
    }

    if (!formData.LastName.trim()) {
      toast.error("Vui lòng nhập tên");
      return;
    }

    if (!formData.Email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Validate ProfilePictureUrl if provided
    if (formData.ProfilePictureUrl && !isValidUrl(formData.ProfilePictureUrl)) {
      toast.error("URL ảnh đại diện không hợp lệ");
      return;
    }

    // ✅ FIXED: Prepare complete data with Username for API
    const updateData = {
      FirstName: formData.FirstName.trim(),
      LastName: formData.LastName.trim(),
      Email: formData.Email.trim(),
      Username: user?.Username || user?.username || "", // ✅ ADDED - Required by API
    };

    // Only include ProfilePictureUrl if it's not empty
    if (formData.ProfilePictureUrl && formData.ProfilePictureUrl.trim()) {
      updateData.ProfilePictureUrl = formData.ProfilePictureUrl.trim();
    } else {
      updateData.ProfilePictureUrl = ""; // Send empty string
    }

    console.log("📋 Complete update data with Username:", updateData);

    try {
      // Update profile
      const result = await updateProfile(updateData);

      console.log("✅ Update result:", result);

      if (result.success) {
        toast.success("Cập nhật thông tin thành công!");

        // ✅ OPTION 2: REFRESH PAGE TO ENSURE AVATAR UPDATES EVERYWHERE
        setTimeout(() => {
          window.location.reload(); // This will refresh the entire page
        }, 1500);
      } else {
        console.error("❌ Update failed:", result.error);
        toast.error(result.error || "Không thể cập nhật thông tin");
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      toast.error("Đã xảy ra lỗi không mong muốn");
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
            Chỉnh sửa thông tin cá nhân
          </h1>
          <p className="text-gray-600">
            Cập nhật thông tin profile và ảnh đại diện của bạn
          </p>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ảnh đại diện
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
                  ✨ Nhập URL ảnh để thay đổi ảnh đại diện
                </p>
              </div>

              {/* Avatar URL Input */}
              <div className="space-y-3">
                <label
                  htmlFor="ProfilePictureUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL ảnh đại diện
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

              {/* Guidelines */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  💡 Gợi ý URL ảnh miễn phí:
                </h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>
                    • <strong>Unsplash:</strong> unsplash.com
                  </li>
                  <li>
                    • <strong>Pixabay:</strong> pixabay.com
                  </li>
                  <li>
                    • <strong>Pexels:</strong> pexels.com
                  </li>
                  <li>• Hoặc upload ảnh lên imgur.com, cloudinary.com</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Thông tin cá nhân
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="FirstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Họ và tên đệm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="FirstName"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên đệm"
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
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="LastName"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    placeholder="Nhập tên"
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
                    placeholder="Nhập địa chỉ email"
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
                      Username không thể thay đổi
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Vai trò
                    </label>
                    <input
                      type="text"
                      value={
                        user?.RoleId === 1
                          ? "Admin"
                          : user?.RoleId === 2
                          ? "User"
                          : "Người dùng"
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
                        Đang cập nhật...
                      </>
                    ) : (
                      "Lưu thay đổi"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Hủy bỏ
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
