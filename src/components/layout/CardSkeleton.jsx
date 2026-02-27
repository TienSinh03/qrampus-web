import React from 'react';

/**
 * Card Skeleton Loader
 * Skeleton loader cho cards
 */
const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
          {/* Icon/Image */}
          <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
          
          {/* Title */}
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
          
          {/* Description */}
          <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
          
          {/* Stats or Button */}
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
