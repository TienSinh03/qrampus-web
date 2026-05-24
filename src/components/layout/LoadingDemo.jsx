import React, { useState } from 'react';
import PageLoader from './PageLoader';
import ProfileSkeleton from './ProfileSkeleton';
import LoadingSpinner from './LoadingSpinner';
import LoadingDots from './LoadingDots';

/**
 * Loading Components Demo
 * Trang demo các loading components
 */
const LoadingDemo = () => {
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Loading Components Demo</h1>

        {/* PageLoader Section */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">1. PageLoader</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Section Loading</h3>
              <PageLoader message="Đang tải dữ liệu..." />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Full Screen</h3>
              <button
                onClick={() => setShowFullScreenLoader(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Xem Full Screen Loader
              </button>
              {showFullScreenLoader && (
                <>
                  <PageLoader message="Loading toàn màn hình..." fullScreen />
                  <button
                    onClick={() => setShowFullScreenLoader(false)}
                    className="fixed top-4 right-4 z-[60] px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg"
                  >
                    Đóng
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ProfileSkeleton */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">2. ProfileSkeleton</h2>
          <ProfileSkeleton />
        </section>

        {/* LoadingSpinner */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">3. LoadingSpinner</h2>
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Size XS</p>
                <LoadingSpinner size="xs" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Size SM</p>
                <LoadingSpinner size="sm" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Size MD</p>
                <LoadingSpinner size="md" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Size LG</p>
                <LoadingSpinner size="lg" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Size XL</p>
                <LoadingSpinner size="xl" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LoadingSpinner color="purple" text="Purple" />
              <LoadingSpinner color="blue" text="Blue" />
              <LoadingSpinner color="gray" text="Gray" />
              <div className="bg-purple-600 p-3 rounded">
                <LoadingSpinner color="white" text="White" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">In Buttons</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang lưu...</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Đang xử lý...</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* LoadingDots */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">4. LoadingDots</h2>
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div className="flex items-center gap-8">
              <div className="space-y-2">
                <p className="text-sm font-medium">Size SM</p>
                <LoadingDots size="sm" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Size MD</p>
                <LoadingDots size="md" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Size LG</p>
                <LoadingDots size="lg" />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <LoadingDots color="purple" />
              <LoadingDots color="blue" />
              <LoadingDots color="gray" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoadingDemo;
