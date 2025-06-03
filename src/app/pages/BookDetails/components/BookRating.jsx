// src/app/pages/BookDetail/components/BookRating.jsx
import React from 'react';

const BookRating = ({ rating }) => {
  const { average, count, distribution } = rating;
  
  // Tạo array 5 sao để render
  const stars = Array.from({ length: 5 }, (_, index) => {
    const filled = index < Math.floor(average);
    const halfFilled = index === Math.floor(average) && average % 1 >= 0.5;
    
    return (
      <span key={index} className="text-yellow-400 text-xl">
        {filled ? '★' : halfFilled ? '☆' : '☆'}
      </span>
    );
  });

  const totalRatings = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      {/* Main Rating Display */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          {stars}
        </div>
        <span className="text-2xl font-bold text-gray-800">{average.toFixed(2)}</span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-600">{count.toLocaleString()} ratings</span>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {Object.entries(distribution)
          .reverse()
          .map(([stars, count]) => {
            const percentage = (count / totalRatings) * 100;
            return (
              <div key={stars} className="flex items-center space-x-3 text-sm">
                <span className="w-8 text-gray-600">{stars} star</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-12 text-gray-600 text-right">
                  {count.toLocaleString()}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BookRating;