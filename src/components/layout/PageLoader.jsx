import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Page Loader Component
 * Component loading đẹp với animation
 */
const PageLoader = ({ message = 'Đang tải dữ liệu...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            {/* Outer spinning ring */}
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            
            {/* Inner pulsing dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <p className="mt-6 text-gray-600 font-medium animate-pulse">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          {/* Spinning gradient ring */}
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          
          {/* Center icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Loader2 className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-700 font-medium">{message}</p>
          <p className="text-sm text-gray-500 mt-1">Vui lòng đợi trong giây lát...</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
