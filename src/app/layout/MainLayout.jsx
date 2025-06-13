// src/app/layouts/MainLayout.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import Sidebar from "./partials/Sidebar";

export default function MainLayout({
  children,
  showSidebar = false,
  className = "",
  containerMaxWidth = "max-w-7xl",
  sidebarWidth = "w-64",
}) {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Header - Fixed at top */}
      <Header />

      {/* Main Content Area */}
      <div className="flex flex-1 pt-16">
        {" "}
        {/* pt-16 để tránh overlap với fixed header */}
        {/* Sidebar - Conditional rendering */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div
              className={`hidden lg:block ${sidebarWidth} bg-base-100 shadow-lg border-r border-base-300 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto`}
            >
              <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay - Có thể mở rộng sau */}
            <div className="lg:hidden">
              {/* Mobile sidebar drawer sẽ được implement sau nếu cần */}
            </div>
          </>
        )}
        {/* Main Content */}
        <main className={`flex-1 ${className}`}>
          {/* Content Container */}
          <div
            className={`${containerMaxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6`}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
