import React from "react";
import { X, Mail, Phone, Calendar, Shield, Building2, IdCard } from "lucide-react";

// InfoRow component moved outside to avoid creating during render
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

const ModalViewUser = ({ isOpen, onClose, userData }) => {
  if (!isOpen || !userData) return null;

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Chi tiết tài khoản
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
                src={userData.avatar_url || "https://via.placeholder.com/150"}
                alt={userData.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {userData.full_name}
              </h2>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  userData.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : userData.status === "Pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {userData.status}
              </span>
            </div>

            {/* Detailed Information */}
            <div className="space-y-1">
              <InfoRow
                icon={IdCard}
                label="Mã giảng viên / Sinh viên"
                value={userData.user_id}
              />
              <InfoRow
                icon={Mail}
                label="Email"
                value={userData.email}
              />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={userData.phone_number}
              />
              <InfoRow
                icon={Calendar}
                label="Ngày sinh"
                value={userData.date_of_birth}
              />
              <InfoRow
                icon={Shield}
                label="Phân quyền"
                value={userData.role}
              />
              <InfoRow
                icon={Building2}
                label="Khoa / Viện"
                value={userData.department}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalViewUser;
