// src/app/pages/BookDetail/components/BookReviews.jsx
import React, { useState } from 'react';

const BookReviews = ({ reviews, totalRatingCount }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-sm ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Community Reviews ({totalRatingCount.toLocaleString()})
        </h3>
        
        <button className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200">
          Write a Review
        </button>
      </div>

      <div className="space-y-6">
        {displayedReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="flex items-start space-x-4">
              {/* User Avatar */}
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40x40/e5e7eb/6b7280?text=' + review.user.name.charAt(0);
                }}
              />
              
              <div className="flex-1 space-y-2">
                {/* User Info and Rating */}
                <div className="flex items-center space-x-3">
                  <button className="font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200">
                    {review.user.name}
                  </button>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {formatDate(review.date)}
                  </span>
                </div>
                
                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed">
                  {review.text}
                </p>
                
                {/* Review Actions */}
                <div className="flex items-center space-x-4 pt-2">
                  <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200">
                    <span className="mr-1">👍</span> Helpful
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200">
                    Reply
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200">
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            {showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews`}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookReviews;