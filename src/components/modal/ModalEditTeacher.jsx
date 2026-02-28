import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";
import { DEPARTMENTS } from "../../constants/departments";
import { usePersonnelValidation } from "../../hooks/usePersonnelValidation";

const ModalEditTeacher = ({ isOpen, onClose, teacherData, onSubmit }) => {
  const [formData, setFormData] = useState({
    teacherId: "",
    fullName: "",
    dateOfBirth: "",
    email: "",
    department: "",
    phoneNumber: "",
    role: "",
    avatarUrl: "",
  });

  const { errors, validateAllFields, validateSingleField, clearErrors, shouldAllowInput } = usePersonnelValidation();

  // Initialize form data when teacherData changes
  useEffect(() => {
    if (isOpen && teacherData) {
      // eslint-disable-next-line
      setFormData({
        teacherId: teacherData.user_id || "",
        fullName: teacherData.full_name || "",
        dateOfBirth: teacherData.date_of_birth || "",
        email: teacherData.email || "",
        department: teacherData.department || "",
        phoneNumber: teacherData.phone_number || "",
        role: teacherData.role || "",
        avatarUrl: teacherData.avatar_url || "",
      });
      clearErrors();
    }
  }, [isOpen, teacherData, clearErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Check if input is allowed (numeric validation for teacherId and phoneNumber)
    if (!shouldAllowInput(name, value)) {
      return;
    }
    
    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate field in real-time
    validateSingleField(name, value);
  };

  const handleSubmit = () => {
    // Validate all fields before submit
    if (!validateAllFields(formData)) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

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
        <div className="flex items-center justify-between px-6 py-5 border-b bg-blue-300">
          <h3 className="text-xl font-semibold text-gray-800">
            Cập nhật hồ sơ Giảng viên
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-lime-300 transition-all duration-300 hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã giảng viên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.teacherId
                  ? "border-red-500 focus:ring-red-500"
                  : "border-blue-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              maxLength="8"
            />
            {errors.teacherId && (
              <p className="mt-1 text-sm text-red-500">{errors.teacherId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên Giảng viên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-blue-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-blue-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoa / Viện <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.department
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-purple-500"
              }`}
            >
              <option value="">-- Chọn Khoa/Viện --</option>
              {DEPARTMENTS.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-500">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.phoneNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "border-blue-300 focus:border-blue-500 focus:ring-blue-200"
              }`}
              maxLength="11"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phân quyền tài khoản
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Giảng viên</option>
              <option>Quản trị viên</option>
              <option>Bộ phận chấm công</option>
            </select>
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Current Avatar */}
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={formData.avatarUrl || "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png"}
              alt="Avatar"
              className="w-full h-full rounded-lg object-cover border border-blue-300"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-sky-500 p-2 rounded-full text-white shadow hover:bg-sky-600 cursor-pointer"
            >
              <Camera size={16} />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalEditTeacher;
