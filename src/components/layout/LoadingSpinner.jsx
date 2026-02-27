import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Loading Spinner Component
 * Spinner nhỏ gọn để dùng trong buttons, inline loading
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'purple',
  text = '',
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    purple: 'text-purple-600',
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 
        className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} 
      />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
