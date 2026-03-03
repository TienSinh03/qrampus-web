import React from "react";
import { X, Mail, Phone, Calendar, Shield, Building2, Clock, User } from "lucide-react";

// Reusable InfoRow với thiết kế tinh tế hơn
const InfoRow = ({ icon: Icon, label, value, highlight = false }) => (
  <div className="group flex items-start gap-4 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200">
    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
      <Icon className="w-5 h-5 text-purple-600" strokeWidth={2.2} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">{label}</p>
      <p className={`mt-0.5 text-[15px] ${highlight ? "font-semibold text-gray-900" : "font-medium text-gray-800"} truncate`}>
        {value || <span className="text-gray-400 italic">Chưa cập nhật</span>}
      </p>
    </div>
  </div>
);

// Mapping
const roleMapping = {
  teacher: "Giảng viên",
  admin: "Quản trị viên",
  attendance_staff: "Ban chấm công",
  // thêm role khác nếu cần
};

const statusMapping = {
  active: {
    text: "Đang hoạt động",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  },
  inactive: {
    text: "Ngừng hoạt động",
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  },
  pending: {
    text: "Chờ duyệt",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

const ModalViewTeacher = ({ isOpen, onClose, teacherData }) => {
  if (!isOpen || !teacherData) return null;

  const status = teacherData.user?.status || "inactive";
  const statusInfo = statusMapping[status] || statusMapping.inactive;

  const roles = teacherData.user?.roles || [];
  const rolesText = roles
    .map((role) => roleMapping[role.name] || role.name)
    .join(" • ") || "Chưa phân quyền";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-purple-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Hồ sơ nhân sự
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-purple-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32 space-y-7">
          {/* Avatar + Name + Status */}
          <div className="flex flex-col items-center text-center pb-7 border-b border-gray-100">
            {teacherData.avatar_url ? (
              <div className="relative">
                <img
                  src={teacherData.avatar_url}
                  alt={teacherData.full_name}
                  className="w-28 h-28 rounded-2xl object-cover shadow-xl ring-4 ring-purple-100/70"
                />
                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-xl ring-4 ring-purple-100/70">
                {teacherData.full_name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            <h2 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
              {teacherData.full_name}
            </h2>

            <span
              className={`mt-2.5 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${statusInfo.className}`}
            >
              {statusInfo.text}
            </span>
          </div>

          {/* Information Grid */}
          <div className="space-y-1">
            <InfoRow icon={User} label="Mã nhân sự" value={teacherData.teacher_code} highlight />
            <InfoRow icon={Mail} label="Email" value={teacherData.email} />
            <InfoRow icon={Phone} label="Số điện thoại" value={teacherData.phone} />
            <InfoRow
              icon={Calendar}
              label="Ngày sinh"
              value={
                teacherData.dob
                  ? new Date(teacherData.dob).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : null
              }
            />
            <InfoRow icon={Shield} label="Phân quyền" value={rolesText} />
            <InfoRow icon={Building2} label="Khoa / Phòng ban" value={teacherData.department} />
            <InfoRow icon={Clock} label="Giờ làm việc" value={teacherData.office_hours} />
          </div>
        </div>

        {/* Footer - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalViewTeacher;