// src/app/pages/BookShelf/BookShelfPage.jsx
import React from "react";
import ShelvesList from "../../components/bookShelf/ShelvesList";
import MyBooksList from "../../components/bookShelf/MyBooksList";

const BookShelfPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-12">
          {/* Shelves Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                🗂️ My bookshelf
              </h2>
              <p className="text-gray-600 text-sm">Organize books by genre</p>
            </div>
            <ShelvesList />
          </section>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Books Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                📖 My books
              </h2>
              <p className="text-gray-600 text-sm">All books in the library</p>
            </div>
            <MyBooksList />
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookShelfPage;
