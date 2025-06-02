// src/app/pages/BookDetail/components/BookDetails.jsx
import React from 'react';

const BookDetails = ({ details }) => {
  const detailItems = [
    { label: 'Pages', value: details.pages },
    { label: 'Format', value: details.format },
    { label: 'Published', value: details.published },
    { label: 'Publisher', value: details.publisher },
    { label: 'ISBN', value: details.isbn },
    { label: 'Language', value: details.language },
    { label: 'Series', value: details.series ? `${details.series} #${details.seriesNumber}` : null }
  ].filter(item => item.value); // Lọc bỏ các giá trị null/undefined

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Book Details</h3>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <dl className="space-y-3">
          {detailItems.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:justify-between">
              <dt className="font-medium text-gray-600 sm:w-1/3">
                {item.label}:
              </dt>
              <dd className="text-gray-900 sm:w-2/3 sm:text-right">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default BookDetails;