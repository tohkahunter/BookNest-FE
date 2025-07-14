import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../../lib/queryClient";

// Pages imports
import Home from "../pages/Home";
import Login from "../pages/Log In";
import BookDetail from "../pages/BookDetails/BookDetail";
import ProfilePage from "../pages/Profile/ProfilePage";
import GenresList from "../pages/Genres";
import Admin from "../pages/Admin";

// Layout imports
import MainLayout from "../layout/MainLayout";
import AuthContainer, { AuthLayout } from "../components/Auth";

// 🆕 Error Boundary for React Query
import { ErrorBoundary } from "react-error-boundary";
import Categories from "../pages/Categories/Categories";

// 🆕 Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <svg
          className="w-16 h-16 text-red-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Có lỗi xảy ra
        </h2>
        <p className="text-gray-600 mb-4">
          {error?.message || "Ứng dụng gặp lỗi không mong đợi"}
        </p>
        <div className="space-x-2">
          <button
            onClick={resetErrorBoundary}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Tải lại trang
          </button>
        </div>

        {/* 🆕 Show error details in development */}
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Chi tiết lỗi (Development)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {error?.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// 🆕 Protected Route wrapper (for future use)
function ProtectedRoute({ children }) {
  // TODO: Add authentication check here when needed
  // const { isAuthenticated } = useAuth();
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  return children;
}

export default function MainRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          // 🆕 Log errors in development
          if (process.env.NODE_ENV === "development") {
            console.error(
              "React Error Boundary caught an error:",
              error,
              errorInfo
            );
          }

          // TODO: In production, send error to monitoring service
          // logErrorToService(error, errorInfo);
        }}
        onReset={() => {
          // 🆕 Reset React Query cache on error reset
          queryClient.clear();
        }}
      >
        <BrowserRouter>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            {/* Authentication Routes */}
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <AuthContainer />
                </AuthLayout>
              }
            />
            {/* 🆕 Additional auth routes for consistency */}
            <Route
              path="/register"
              element={
                <AuthLayout>
                  <AuthContainer />
                </AuthLayout>
              }
            />
            {/* Book Routes */}
            <Route
              path="/book/:id"
              element={
                <MainLayout>
                  <BookDetail />
                </MainLayout>
              }
            />
            {/* 🆕 Alternative book routes */}
            <Route
              path="/books/:id"
              element={
                <MainLayout>
                  <BookDetail />
                </MainLayout>
              }
            />
            {/* 🆕 Books listing page */}
            <Route
              path="/books"
              element={
                <MainLayout>
                  {/* TODO: Create BooksPage component */}
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Tất cả sách</h1>
                    <p className="text-gray-600">
                      Trang này đang được phát triển
                    </p>
                  </div>
                </MainLayout>
              }
            />
            Category/Genre Routes - Consolidated
            <Route
              path="/categories"
              element={
                <MainLayout>
                  <GenresList />
                </MainLayout>
              }
            />
            <Route
              path="/categories/:genre"
              element={
                <MainLayout>
                  <Categories />
                </MainLayout>
              }
            />
            <Route
              path="/genres"
              element={
                <MainLayout>
                  <GenresList />
                </MainLayout>
              }
            />
            <Route
              path="/genres/:genre"
              element={
                <MainLayout>
                  <Categories />
                </MainLayout>
              }
            />
            <Route
              path="/browse/genres"
              element={
                <MainLayout>
                  <GenresList />
                </MainLayout>
              }
            />
            {/* User Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            {/* 🆕 User library routes */}
            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    {/* TODO: Create MyBooksPage component */}
                    <div className="p-8 text-center">
                      <h1 className="text-2xl font-bold">Thư viện của tôi</h1>
                      <p className="text-gray-600">
                        Trang này đang được phát triển
                      </p>
                    </div>
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            {/* 🆕 Authors routes */}
            <Route
              path="/authors"
              element={
                <MainLayout>
                  {/* TODO: Create AuthorsPage component */}
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Tác giả</h1>
                    <p className="text-gray-600">
                      Trang này đang được phát triển
                    </p>
                  </div>
                </MainLayout>
              }
            />
            <Route
              path="/author/:id"
              element={
                <MainLayout>
                  {/* TODO: Create AuthorDetailPage component */}
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Chi tiết tác giả</h1>
                    <p className="text-gray-600">
                      Trang này đang được phát triển
                    </p>
                  </div>
                </MainLayout>
              }
            />
            {/* 🆕 Additional utility routes */}
            <Route
              path="/popular"
              element={
                <MainLayout>
                  {/* TODO: Create PopularBooksPage component */}
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Sách phổ biến</h1>
                    <p className="text-gray-600">
                      Trang này đang được phát triển
                    </p>
                  </div>
                </MainLayout>
              }
            />
            <Route
              path="/new-releases"
              element={
                <MainLayout>
                  {/* TODO: Create NewReleasesPage component */}
                  <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold">Sách mới</h1>
                    <p className="text-gray-600">
                      Trang này đang được phát triển
                    </p>
                  </div>
                </MainLayout>
              }
            />
            {/* 🆕 404 Not Found */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-400 mb-4">
                        404
                      </h1>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Trang không tồn tại
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Trang bạn đang tìm kiếm không được tìm thấy
                      </p>
                      <a
                        href="/"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Về trang chủ
                      </a>
                    </div>
                  </div>
                </MainLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <MainLayout>
                  <Admin />
                </MainLayout>
              }
            />
          </Routes>
        </BrowserRouter>

        {/* React Query DevTools - Enhanced */}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom-right"
            toggleButtonProps={{
              style: {
                marginLeft: "5px",
                transform: "scale(0.7)",
                transformOrigin: "bottom right",
              },
            }}
          />
        )}

        {/* 🆕 Global loading indicator for network requests */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed top-4 right-4 z-50">
            <div id="global-loading-indicator" className="hidden">
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            </div>
          </div>
        )}
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
