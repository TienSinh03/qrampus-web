import React from 'react';

/**
 * Profile Skeleton Loader
 * Skeleton loader cho trang profile với layout giống trang thật
 */
const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-b-xl shadow-sm border p-4 animate-pulse">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Avatar Skeleton */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
          <div className="mt-4 w-24 h-10 bg-gray-200 rounded-lg"></div>
          <div className="mt-2 w-32 h-3 bg-gray-200 rounded"></div>
        </div>

        {/* Info Skeleton */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-4">
            <div className="w-32 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
