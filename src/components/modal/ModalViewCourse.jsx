import React from "react";
import { X, BookOpen, Calendar, GraduationCap, Users, Building2, FileText, Clock } from "lucide-react";

// InfoRow component for displaying course information
// eslint-disable-next-line no-unused-vars
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-emerald-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

const ModalViewCourse = ({ isOpen, onClose, courseData }) => {
  if (!isOpen || !courseData) return null;

  // Map status to Vietnamese
  const getStatusDisplay = (status) => {
    const statusMap = {
      "Active": "Đang mở",
      "Pending": "Chờ duyệt",
      "Inactive": "Đã đóng",
      "Đang mở": "Đang mở",
    };
    return statusMap[status] || status;
  };

  const getStatusStyle = (status) => {
    if (status === "Active" || status === "Đang mở") {
      return "bg-green-100 text-green-600";
    } else if (status === "Pending") {
      return "bg-yellow-100 text-yellow-600";
    }
    return "bg-gray-200 text-gray-600";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-emerald-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết môn học
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-emerald-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
            {/* Course Info Header */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                {courseData.tenMonHoc}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {courseData.maHocPhan}
              </p>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(courseData.trangThai)}`}
              >
                {getStatusDisplay(courseData.trangThai)}
              </span>
            </div>

            {/* Course Details - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Left Column */}
              <div className="space-y-1">
                <InfoRow
                  icon={Calendar}
                  label="Năm học"
                  value={courseData.namHoc}
                />
                <InfoRow
                  icon={Clock}
                  label="Học kỳ"
                  value={`Kỳ ${courseData.ky}`}
                />
                <InfoRow
                  icon={Building2}
                  label="Khoa/Viện"
                  value={courseData.khoa}
                />
                <InfoRow
                  icon={Users}
                  label="Sĩ số tối đa"
                  value={courseData.siSo}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-1">
                <InfoRow
                  icon={GraduationCap}
                  label="Hình thức học"
                  value={courseData.hinhThucHoc}
                />
                
                {courseData.moTa && (
                  <div className="p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Mô tả</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {courseData.moTa}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info - Full Width */}
            {!courseData.moTa && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-emerald-500">
                <p className="text-sm text-gray-600">
                  Chưa có mô tả cho môn học này
                </p>
              </div>
            )}
          </div>

        {/* Footer - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalViewCourse;
