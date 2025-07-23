// src/app/components/BookShelf/ShelvesList.jsx (Fixed Navigation)
import React, { useState, useMemo } from "react";
import { useMyShelves, useDeleteShelf, useMyBooks } from "../../hooks/index";
import CreateShelfModal from "./CreateShelfModal";

const ShelvesList = () => {
  // ✅ Mock navigate for demo - replace with: const navigate = useNavigate();
  const navigate = (path) => {
    console.log("🚀 Navigating to:", path);
    window.location.href = path;
  };

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingShelfId, setDeletingShelfId] = useState(null);

  const { data: shelves, isLoading, error } = useMyShelves();
  const { data: allBooks } = useMyBooks();
  const deleteShelfMutation = useDeleteShelf();

  // Calculate correct book counts
  const shelvesWithCorrectBookCount = useMemo(() => {
    if (!shelves || !allBooks) return shelves;

    return shelves.map((shelf) => {
      const booksInThisShelf = allBooks.filter(
        (book) => book.ShelfId === shelf.ShelfId
      );

      return {
        ...shelf,
        BookCount: booksInThisShelf.length,
      };
    });
  }, [shelves, allBooks]);

  const handleDeleteShelf = async (shelfId, shelfName) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn xóa kệ sách "${shelfName}"?\n\nCác sách trong kệ sẽ không bị xóa, chỉ bỏ khỏi kệ này.`
      )
    ) {
      return;
    }

    try {
      setDeletingShelfId(shelfId);
      await deleteShelfMutation.mutateAsync(shelfId);
    } catch (error) {
      console.error("Delete shelf error:", error);
    } finally {
      setDeletingShelfId(null);
    }
  };

  const handleCreateSuccess = (result) => {
    console.log("Shelf created successfully:", result);
  };

  // ✅ Fixed navigation function
  const handleViewBooks = (shelf) => {
    console.log("🔍 Navigating to shelf:", shelf.ShelfId);
    navigate(`/bookshelf/${shelf.ShelfId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>❌ Lỗi khi tải danh sách kệ sách: {error.message}</span>
      </div>
    );
  }

  const customShelves =
    shelvesWithCorrectBookCount?.filter((shelf) => !shelf.IsDefault) || [];
  const defaultShelves =
    shelvesWithCorrectBookCount?.filter((shelf) => shelf.IsDefault) || [];

  return (
    <div className="space-y-6">
      {/* Header with create button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-gray-700 text-2xl font-bold">
            📚 Kệ sách của tôi
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý và tổ chức thư viện cá nhân
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tạo kệ mới
        </button>
      </div>

      {/* Default/System shelves */}
      {defaultShelves.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Kệ hệ thống
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultShelves.map((shelf) => (
              <ShelfCard
                key={shelf.ShelfId}
                shelf={shelf}
                isDefault={true}
                onViewBooks={() => handleViewBooks(shelf)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom shelves */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Kệ tùy chỉnh
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({customShelves.length})
          </span>
        </h3>

        {customShelves.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-lg">
            <div className="text-6xl mb-4">📚</div>
            <h4 className="text-lg font-medium mb-2">
              Chưa có kệ sách tùy chỉnh
            </h4>
            <p className="text-gray-600 mb-4">
              Tạo kệ sách để tổ chức thư viện theo ý thích
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary"
            >
              Tạo kệ đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customShelves.map((shelf) => (
              <ShelfCard
                key={shelf.ShelfId}
                shelf={shelf}
                isDefault={false}
                onDelete={() =>
                  handleDeleteShelf(shelf.ShelfId, shelf.ShelfName)
                }
                isDeleting={deletingShelfId === shelf.ShelfId}
                onViewBooks={() => handleViewBooks(shelf)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create shelf modal */}
      <CreateShelfModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

// ✅ Fixed ShelfCard Component - Remove duplicate navigation logic
const ShelfCard = ({ shelf, isDefault, onDelete, isDeleting, onViewBooks }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border hover:scale-105">
      <div className="card-body p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="card-title text-lg truncate flex-1 mr-2">
            {shelf.ShelfName}
            {isDefault && (
              <div className="badge badge-secondary badge-sm">Hệ thống</div>
            )}
          </h3>

          {!isDefault && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-10"
              >
                <li>
                  <a className="text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Sửa
                  </a>
                </li>
                <li>
                  <a
                    onClick={onDelete}
                    className="text-sm text-error"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Xóa
                      </>
                    )}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Description */}
        {shelf.Description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {shelf.Description}
          </p>
        )}

        {/* Book count and info */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>📖 {shelf.BookCount} sách</span>
          <span>{formatDate(shelf.CreatedAt)}</span>
        </div>

        {/* ✅ Fixed Action button - Only use onViewBooks prop */}
        <div className="card-actions justify-end mt-3">
          <button
            className="btn btn-sm btn-primary gap-2 hover:scale-105 transition-transform"
            onClick={onViewBooks}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Xem sách
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShelvesList;
