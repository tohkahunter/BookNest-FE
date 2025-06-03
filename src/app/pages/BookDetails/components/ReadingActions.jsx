
import React, { useState } from 'react';

const ReadingActions = () => {
  const [readingStatus, setReadingStatus] = useState('want-to-read');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const statusOptions = [
    { value: 'want-to-read', label: 'Want to Read', color: 'bg-green-600 hover:bg-green-700' },
    { value: 'currently-reading', label: 'Currently Reading', color: 'bg-blue-600 hover:bg-blue-700' },
    { value: 'read', label: 'Read', color: 'bg-gray-600 hover:bg-gray-700' }
  ];

  const currentStatus = statusOptions.find(option => option.value === readingStatus);

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  return (
    <div className="space-y-4">
      {/* Reading Status Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full md:w-auto px-6 py-3 text-white font-medium rounded-lg transition-colors duration-200 ${currentStatus.color} flex items-center justify-center space-x-2`}
        >
          <span>{currentStatus.label}</span>
          <svg 
            className={`w-4 h-4 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-full md:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setReadingStatus(option.value);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Rating */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rate this book</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              className="text-2xl transition-colors duration-200 hover:scale-110"
            >
              <span className={star <= userRating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            </button>
          ))}
          {userRating > 0 && (
            <span className="ml-2 text-sm text-gray-600">({userRating}/5)</span>
          )}
        </div>
      </div>

      {/* Additional Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
          Write a Review
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
          Add to List
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
          Share
        </button>
      </div>
    </div>
  );
};

export default ReadingActions;