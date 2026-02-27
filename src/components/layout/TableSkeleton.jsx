import React from 'react';

/**
 * Table Skeleton Loader
 * Skeleton loader cho bảng dữ liệu
 */
const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse">
      {/* Table Header */}
      <div className="bg-gray-50 border-b">
        <div className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4 p-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
