import React from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile"; // ✅ Fix import path

const ProfilePage = () => {
  const navigate = useNavigate();
  // ✅ Use the custom profile hook
  const {
    user,
    isLoading,
    isAuthenticated,
    error,
    avatarUrl,
    formattedRegistrationDate,
    formattedLastLogin,
    refreshProfile,
  } = useProfile();

  // ✅ Debug log to check data
  console.log("ProfilePage Debug:", {
    user,
    isLoading,
    isAuthenticated,
    error,
    avatarUrl,
    formattedRegistrationDate,
    formattedLastLogin,
  });

  const handleEditProfile = () => {
    // Navigate to edit profile page using React Router
    navigate("/profile/edit");
  };

  // ✅ Handle authentication loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin profile...</p>
        </div>
      </div>
    );
  }

  // ✅ Handle not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bạn cần đăng nhập
          </h2>
          <p className="text-gray-600 mb-4">
            Vui lòng đăng nhập để xem trang profile
          </p>
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Không thể tải thông tin profile
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={refreshProfile}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100">
                <img
                  src={`${avatarUrl}?t=${Date.now()}`} // ✅ Add cache busting to force reload
                  alt={`${user?.FirstName || ""} ${user?.LastName || ""}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to generated avatar if image fails
                    const name = `${user?.FirstName || ""} ${
                      user?.LastName || ""
                    }`.trim();
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      name
                    )}&background=f97316&color=ffffff&size=128&font-size=0.4`;
                  }}
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900 truncate">
                  {user?.FirstName || ""} {user?.LastName || ""}
                </h1>
                <button
                  className="text-sm text-orange-600 hover:text-orange-700 transition-colors font-medium hover:underline"
                  onClick={handleEditProfile}
                >
                  (chỉnh sửa profile)
                </button>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {/* Basic Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Thông tin cơ bản
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-[80px]">
                        Username:
                      </span>
                      <span className="text-gray-900 font-medium">
                        @{user?.Username || "Chưa có"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-[80px]">Email:</span>
                      <span className="text-gray-900">
                        {user?.Email || "Chưa có"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-[80px]">
                        Trạng thái:
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          user?.IsActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user?.IsActive !== false
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {user?.IsActive !== false
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 uppercase tracking-wide text-xs">
                    Hoạt động
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-[100px]">
                        Tham gia:
                      </span>
                      <span className="text-gray-900">
                        {formattedRegistrationDate || "Chưa có thông tin"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-[100px]">
                        Đăng nhập cuối:
                      </span>
                      <span className="text-gray-900">
                        {formattedLastLogin || "Chưa có thông tin"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 min-w-[100px]">
                        Vai trò:
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user?.RoleId === 1
                          ? "Admin"
                          : user?.RoleId === 2
                          ? "User"
                          : "Người dùng"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Hành động nhanh
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
              onClick={() => navigate("/bookshelf")}
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Thư viện sách</div>
                <div className="text-sm text-gray-500">Xem sách của bạn</div>
              </div>
            </button>

            <button
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              onClick={handleEditProfile}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⚙️</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Cài đặt</div>
                <div className="text-sm text-gray-500">Chỉnh sửa thông tin</div>
              </div>
            </button>

            <button
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🔍</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Khám phá</div>
                <div className="text-sm text-gray-500">Tìm sách mới</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
