import React, { useState } from "react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="admin-container mb-10">
      {/* Header Section */}
      <div className="admin-header bg-neutral/5 py-6 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-neutral">Admin Dashboard</h1>
          <p className="text-neutral/70 mt-2">Manage your book collection</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button className="btn btn-success text-white">+ Add New Book</button>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs mb-6">
          <button
            className={`tab tab-lg ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Books
          </button>
          <button
            className={`tab tab-lg ${
              activeTab === "recent" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("recent")}
          >
            Recent Additions
          </button>
          <button
            className={`tab tab-lg ${
              activeTab === "popular" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("popular")}
          >
            Popular Books
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              className="input input-bordered w-full"
            />
          </div>
          <div className="flex gap-2">
            <select className="select select-bordered">
              <option>All Genres</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Horror</option>
              <option>Romance</option>
              <option>Science Fiction</option>
            </select>
            <select className="select select-bordered">
              <option>Sort by</option>
              <option>Title A-Z</option>
              <option>Title Z-A</option>
              <option>Author A-Z</option>
              <option>Date Added</option>
              <option>Rating</option>
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-success/20 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-neutral/70">Total Books</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-warning/20 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-warning"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-sm text-neutral/70">Authors</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-info/20 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-info"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-sm text-neutral/70">Genres</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="bg-error/20 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-error"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold">4.2</p>
                  <p className="text-sm text-neutral/70">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Books Table */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Rating</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample book rows */}
                  <tr>
                    <td>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src="/api/placeholder/48/48"
                              alt="Book Cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">The First Days</div>
                          <div className="text-sm opacity-50">
                            As the World Dies, #1
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium">Rhiannon Frater</div>
                    </td>
                    <td>
                      <div className="badge badge-ghost badge-sm">Horror</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="text-orange-400">★</span>
                        <span>4.12</span>
                      </div>
                    </td>
                    <td>March 15, 2024</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-xs">
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
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button className="btn btn-ghost btn-xs text-error">
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
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* More rows would be dynamically generated */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {/* <div className="flex justify-center mt-6">
          <div className="btn-group">
            <button className="btn btn-outline">«</button>
            <button className="btn btn-outline">1</button>
            <button className="btn btn-outline btn-active">2</button>
            <button className="btn btn-outline">3</button>
            <button className="btn btn-outline">4</button>
            <button className="btn btn-outline">»</button>
          </div>
        </div> */}

        {/* Bulk Actions */}
        <div className="flex justify-between items-center mt-6 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm">Bulk Actions:</span>
            <button className="btn btn-outline btn-sm">Delete Selected</button>
          </div>
          <div className="text-sm text-neutral/70">
            Showing 1-10 of 1,247 books
          </div>
        </div>
      </div>
    </div>
  );
}
