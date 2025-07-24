// src/app/pages/BookDetail/components/BookGenres.jsx
import React from 'react';

const BookGenres = ({ genres }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Genres</h3>
      
      <div className="flex flex-wrap gap-2">
        {genres.map((genre, index) => (
          <button
            key={index}
            className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookGenres;