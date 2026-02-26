import React from "react";
import { X, Mail, Phone, Calendar, GraduationCap, Building2, IdCard, Users } from "lucide-react";

// InfoRow component moved outside to avoid creating during render
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-cyan-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

const ModalViewStudent = ({ isOpen, onClose, studentData }) => {
  if (!isOpen || !studentData) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-800 px-6 py-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Chi tiết hồ sơ Sinh viên
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b">
              <img
                src={studentData.avatar_url || "https://via.placeholder.com/150"}
                alt={studentData.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-cyan-100 shadow-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {studentData.full_name}
              </h2>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  studentData.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : studentData.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {studentData.status}
              </span>
            </div>

            {/* Detailed Information */}
            <div className="space-y-1">
              <InfoRow
                icon={IdCard}
                label="Mã sinh viên"
                value={studentData.user_id}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={studentData.email}
              />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={studentData.phone_number}
              />
              <InfoRow
                icon={Calendar}
                label="Ngày sinh"
                value={studentData.date_of_birth}
              />
              <InfoRow
                icon={Building2}
                label="Khoa / Viện"
                value={studentData.department}
              />
              <InfoRow
                icon={GraduationCap}
                label="Ngành học"
                value={studentData.major}
              />
              <InfoRow
                icon={Users}
                label="Lớp học"
                value={studentData.class}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 shadow-md transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalViewStudent;
