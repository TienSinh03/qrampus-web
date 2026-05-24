import React from "react";
import { X, Mail, Phone, Calendar, GraduationCap, IdCard, Users, ShieldCheck, Smartphone } from "lucide-react";

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

const statusConfig = {
  active:   { label: "Hoạt động", className: "bg-green-100 text-green-600" },
  inactive: { label: "Tạm ngưng", className: "bg-gray-200 text-gray-600" },
  pending:  { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-600" },
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : "")).toUpperCase();
};

const ModalViewStudent = ({ isOpen, onClose, studentData }) => {
  if (!isOpen || !studentData) return null;

  const status = studentData.user?.status || studentData.status || "";
  const { label: statusLabel, className: statusClass } = statusConfig[status] || { label: status, className: "bg-gray-200 text-gray-600" };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("vi-VN");
  };

  const getInstallationId = (deviceId) => {
    if (!deviceId) return null;
    try {
      const parsed = typeof deviceId === "string" ? JSON.parse(deviceId) : deviceId;
      return parsed?.installation_id || null;
    } catch {
      return null;
    }
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
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-cyan-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết hồ sơ Sinh viên
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-cyan-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col items-center mb-6 pb-6 border-b">
            {studentData.avatar_url ? (
              <img
                src={studentData.avatar_url}
                alt={studentData.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-cyan-100 shadow-lg mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-cyan-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-cyan-100 shadow-lg mb-4">
                {getInitials(studentData.full_name)}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {studentData.full_name}
            </h2>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusClass}`}>
              {statusLabel}
            </span>
          </div>

          {/* Detailed Information */}
          <div className="space-y-1">
            <InfoRow
              icon={IdCard}
              label="Mã sinh viên"
              value={studentData.student_code}
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={studentData.email}
            />
            <InfoRow
              icon={Phone}
              label="Số điện thoại"
              value={studentData.phone}
            />
            <InfoRow
              icon={Calendar}
              label="Ngày sinh"
              value={formatDate(studentData.dob)}
            />
            <InfoRow
              icon={GraduationCap}
              label="Ngành học"
              value={studentData.major}
            />
            <InfoRow
              icon={Users}
              label="Lớp học"
              value={studentData.class_name}
            />

            <InfoRow
              icon={Smartphone}
              label="Installation ID"
              value={getInstallationId(studentData.device_id)}
            />
          </div>
        </div>

        {/* Footer - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 shadow-md transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalViewStudent;
