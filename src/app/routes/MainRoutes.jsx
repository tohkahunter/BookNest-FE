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

// Layout imports
import MainLayout from "../layout/MainLayout";
import AuthContainer, { AuthLayout } from "../components/Auth";

// 🆕 Error Boundary for React Query
import { ErrorBoundary } from "react-error-boundary";
import Categories from "../pages/Categories/Categories";
import SearchResults from "../pages/SearchResults";
import ScrollToTop from "../components/SrcollToTop/srcollToTop";
import AuthorDetail from "../pages/Author/AuthorDetail";
import GenreDetail from "../pages/Genres/GenresDetail";
import AuthorList from "../pages/Author/AuthorList";
import BookPopular from "../components/book/BookPopular";
import BookRecent from "../components/book/BookRecent";
import AllBooks from "../components/book/AllBooks";
import BookShelfPage from "../pages/BookShelf";
import ShelfBooksPage from "../components/bookShelf/ShelfBooksPage";
import EditProfilePage from "../pages/Profile/EditProfilePage";
import LoginPage from "../pages/Log In/Login";
import RegisterPage from "../pages/Register/Register";

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
          <ScrollToTop smooth={true} />
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
                  <LoginPage />
                </AuthLayout>
              }
            />
            {/* 🆕 Additional auth routes for consistency */}
            <Route
              path="/register"
              element={
                <AuthLayout>
                  <RegisterPage />
                </AuthLayout>
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
                  <AllBooks />
                </MainLayout>
              }
            />
            {/* 🆕 Search Results Page */}
            <Route
              path="/search"
              element={
                <MainLayout>
                  <SearchResults />
                </MainLayout>
              }
            />

            <Route
              path="/recent-books"
              element={
                <MainLayout>
                  <BookRecent />
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
              path="/genres/:id"
              element={
                <MainLayout>
                  <GenreDetail />
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
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EditProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* BookShelf */}
            <Route
              path="/bookshelf"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BookShelfPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookshelf/:shelfId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ShelfBooksPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 🆕 Authors routes */}

            <Route
              path="/authors/:id"
              element={
                <MainLayout>
                  <AuthorDetail />
                </MainLayout>
              }
            />

            <Route
              path="/authors/"
              element={
                <MainLayout>
                  <AuthorList />
                </MainLayout>
              }
            />

            {/* 🆕 Additional utility routes */}
            <Route
              path="/popular-books"
              element={
                <MainLayout>
                  <BookPopular />
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
