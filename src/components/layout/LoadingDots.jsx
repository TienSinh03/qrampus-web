import React from 'react';

/**
 * Loading Dots Animation
 * Animation dạng 3 chấm nhảy nhót
 */
const LoadingDots = ({ color = 'purple', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const colorClasses = {
    purple: 'bg-purple-600',
    blue: 'bg-blue-600',
    gray: 'bg-gray-600',
  };

  return (
    <div className="flex items-center justify-center gap-1.5">
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '0ms' }}
      ></div>
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '150ms' }}
      ></div>
      <div 
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '300ms' }}
      ></div>
    </div>
  );
};

export default LoadingDots;
