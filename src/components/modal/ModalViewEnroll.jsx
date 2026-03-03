import React from "react";
import { X, User, BookOpen, Calendar, Building2, Users, Clock, FileCheck } from "lucide-react";

// InfoRow component for displaying enrollment information
// eslint-disable-next-line no-unused-vars
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-teal-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

const ModalViewEnroll = ({ isOpen, onClose, enrollData }) => {
  if (!isOpen || !enrollData) return null;

  // Map status to Vietnamese
  const getStatusDisplay = (status) => {
    const statusMap = {
      "Thành công": "Thành công",
      "Chờ duyệt": "Chờ duyệt",
      "Đã hủy": "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getStatusStyle = (status) => {
    if (status === "Thành công") {
      return "bg-green-100 text-green-600";
    } else if (status === "Chờ duyệt") {
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
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-teal-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết đăng ký môn học
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-teal-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
            {/* Student Info Header */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                {enrollData.hoTen}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                MSSV: {enrollData.maSinhVien}
              </p>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(enrollData.trangThai)}`}
              >
                {getStatusDisplay(enrollData.trangThai)}
              </span>
            </div>

            {/* Course Info Card */}
            <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Môn học đăng ký</p>
                  <p className="text-lg font-semibold text-gray-800">{enrollData.monHoc}</p>
                  <p className="text-sm text-gray-500">Mã học phần: {enrollData.maHocPhan}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Details - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Left Column */}
              <div className="space-y-1">
                <InfoRow
                  icon={Calendar}
                  label="Năm học"
                  value={enrollData.namHoc}
                />
                <InfoRow
                  icon={Clock}
                  label="Học kỳ"
                  value={`Kỳ ${enrollData.ky}`}
                />
                <InfoRow
                  icon={Building2}
                  label="Khoa/Viện"
                  value={enrollData.khoa}
                />
                <InfoRow
                  icon={Users}
                  label="Nhóm thực hành"
                  value={enrollData.nhomThucHanh}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-1">
                <InfoRow
                  icon={BookOpen}
                  label="Hình thức học"
                  value={enrollData.hinhThucHoc}
                />
                <InfoRow
                  icon={Clock}
                  label="Lịch học"
                  value={enrollData.lichHoc}
                />
                <InfoRow
                  icon={FileCheck}
                  label="Ngày đăng ký"
                  value={enrollData.ngayDangKy}
                />
              </div>
            </div>
          </div>

        {/* Footer - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalViewEnroll;
