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
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl overflow-hidden transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-6 py-7">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-white tracking-tight">
              Hồ sơ nhân sự
            </h3>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200"
              aria-label="Đóng"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-7 space-y-7">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-50/80 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-7 py-2.5 rounded-xl bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-200/40 transition-all duration-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewTeacher;