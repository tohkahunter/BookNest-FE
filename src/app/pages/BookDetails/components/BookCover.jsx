// src/app/pages/BookDetail/components/BookCover.jsx
import React from 'react';

const BookCover = ({ cover, title, author }) => {
  return (
    <div className="flex-shrink-0">
      <div className="w-48 h-72 relative group">
        <img
          src={cover}
          alt={`${title} by ${author}`}
          className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
      </div>
    </div>
  );
};

export default BookCover;