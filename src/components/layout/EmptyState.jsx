import React from "react";
import { Inbox, RotateCcw } from "lucide-react";

const EmptyState = ({
  title = "Kho lưu trữ trống",
  description = "Hiện chưa có dữ liệu nào được ghi nhận tại mục này.",
  colSpan = 8,
  onAction,
  actionLabel = "Làm mới trang"
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className="py-24 px-6">
        <div className="relative flex flex-col items-center justify-center group">
          
          {/* Background Decorative Rings - Tạo chiều sâu */}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 bg-indigo-50/50 rounded-full animate-pulse blur-3xl" />
            <div className="absolute w-48 h-48 border border-indigo-100/50 rounded-full scale-150 opacity-20" />
          </div>

          {/* Icon Composition */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex items-center justify-center transform transition-transform duration-500 group-hover:-translate-y-2">
              <Inbox className="w-10 h-10 text-indigo-500 stroke-[1.25px]" />
              
              {/* Badge nhỏ đi kèm */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping" />
              </div>
            </div>
          </div>

          {/* Typography */}
          <div className="text-center max-w-sm mx-auto space-y-3">
            <h3 className="text-xl font-medium text-gray-900 tracking-tight leading-none">
              {title}
            </h3>
            <p className="text-sm text-gray-500/80 leading-relaxed font-light">
              {description}
            </p>
          </div>

          {/* Elegant Action Button */}
          {onAction && (
            <button
              onClick={onAction}
              className="mt-10 group/btn relative inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium transition-all hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95"
            >
              <RotateCcw className="w-4 h-4 transition-transform group-hover/btn:rotate-180 duration-500" />
              {actionLabel}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default EmptyState;