// src/app/pages/BookDetail/components/BookDescription.jsx
import React, { useState } from 'react';

const BookDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Giới hạn ký tự hiển thị khi thu gọn
  const maxLength = 300;
  const shouldShowReadMore = description.length > maxLength;
  
  const displayText = isExpanded ? description : 
    shouldShowReadMore ? `${description.substring(0, maxLength)}...` : description;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Description</h3>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayText}
        </p>
        
        {shouldShowReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 mt-2"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookDescription;