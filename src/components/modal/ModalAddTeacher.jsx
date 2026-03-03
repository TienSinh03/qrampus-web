import React, { useState } from "react";
import { X } from "lucide-react";
import { DEPARTMENTS } from "../../constants/departments";
import { usePersonnelValidation } from "../../hooks/usePersonnelValidation";

const ModalAddTeacher = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    teacherId: "",
    fullName: "",
    dateOfBirth: "",
    email: "",
    department: "",
    phoneNumber: "",
    role: "Giảng viên",
    avatar: null,
  });

  const { errors, validateAllFields, validateSingleField, clearErrors, shouldAllowInput } = usePersonnelValidation();

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

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = () => {
    // Validate all fields before submit
    if (!validateAllFields(formData)) {
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormData({
      teacherId: "",
      fullName: "",
      dateOfBirth: "",
      email: "",
      department: "",
      phoneNumber: "",
      role: "Giảng viên",
      avatar: null,
    });
    clearErrors();
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
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-lime-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Thêm hồ sơ Giảng viên
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-lime-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã giảng viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.teacherId
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-purple-500"
                }`}
                placeholder="Ví dụ: 10001234"
                maxLength="8"
              />
              {errors.teacherId && (
                <p className="mt-1 text-sm text-red-500">{errors.teacherId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ tên Giảng viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-purple-500"
                }`}
                placeholder="Nhập họ tên đầy đủ"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-purple-500"
                }`}
                placeholder="example@iuh.edu.vn"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoa/Viện <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.department
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.phoneNumber
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-purple-500"
                }`}
                placeholder="0123456789"
                maxLength="11"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phân quyền tài khoản
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option>Giảng viên</option>
                <option>Quản trị viên</option>
                <option>Bộ phận chấm công</option>
              </select>
            </div>

            {/* Ảnh đại diện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {formData.avatar && (
                <p className="mt-2 text-sm text-gray-600">
                  Đã chọn: {formData.avatar.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Tạo hồ sơ
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddTeacher;
