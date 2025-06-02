// src/app/pages/BookDetail/components/BookInfo.jsx
import React from 'react';

const BookInfo = ({ title, subtitle, author }) => {
  return (
    <div className="space-y-3">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>
      
      {/* Subtitle */}
      {subtitle && (
        <h2 className="text-xl md:text-2xl text-gray-600 font-medium">
          {subtitle}
        </h2>
      )}
      
      {/* Author */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-600">by</span>
        <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200">
          {author.name}
        </button>
      </div>
    </div>
  );
};

export default BookInfo;