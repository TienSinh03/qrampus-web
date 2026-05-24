import React from "react";
import { X, BookOpen, Calendar, GraduationCap, User, Building2, Users, Star } from "lucide-react";

// InfoRow component moved outside to avoid creating during render
// eslint-disable-next-line no-unused-vars
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-indigo-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

const ModalViewSurvey = ({ isOpen, onClose, surveyData }) => {
  if (!isOpen || !surveyData) return null;

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
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-indigo-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết khảo sát học phần
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-indigo-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
            {/* Course Info Header */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                {surveyData.course_name}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {surveyData.course_code}
              </p>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  surveyData.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : surveyData.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {surveyData.status}
              </span>
            </div>

            {/* Course Details - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Left Column */}
              <div className="space-y-1">
                <InfoRow
                  icon={Calendar}
                  label="Học kỳ"
                  value={surveyData.semester}
                />
                <InfoRow
                  icon={Calendar}
                  label="Năm học"
                  value={surveyData.academic_year}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Hình thức học"
                  value={surveyData.learning_form}
                />
                <InfoRow
                  icon={Users}
                  label="Nhóm thực hành"
                  value={surveyData.practical_group || "Không có"}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-1">
                <InfoRow
                  icon={Calendar}
                  label="Ngày bắt đầu"
                  value={surveyData.created_at}
                />
                <InfoRow
                  icon={Calendar}
                  label="Ngày kết thúc"
                  value={surveyData.end_at}
                />
                <InfoRow
                  icon={User}
                  label="Mã giảng viên"
                  value={surveyData.instructor_code}
                />
                <InfoRow
                  icon={User}
                  label="Giảng viên"
                  value={surveyData.instructor}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 space-y-1">
              <InfoRow
                icon={Building2}
                label="Khoa / Viện"
                value={surveyData.department}
              />
              {surveyData.average_rating && (
                <InfoRow
                  icon={Star}
                  label="Điểm đánh giá trung bình"
                  value={`${surveyData.average_rating} / 5.0`}
                />
              )}
            </div>
          </div>

        {/* Footer - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              window.location.href = "/dashboard/admin/surveys/detail-survey";
            }}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-colors"
          >
            Xem câu hỏi khảo sát
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalViewSurvey;
