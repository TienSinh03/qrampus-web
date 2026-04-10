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
    roles: [],
    avatarUrl: "",
    avatarFile: null,
    officeHours: "",
  });

  const [roleError, setRoleError] = useState("");
  const { errors, validateAllFields, validateSingleField, clearErrors, shouldAllowInput } = usePersonnelValidation();

  // Role options
  const roleOptions = [
    { value: "teacher", label: "Giảng viên" },
    { value: "admin", label: "Quản trị viên" },
    { value: "attendance_staff", label: "Bộ phận chấm công" },
  ];

  // Initialize form data when teacherData changes
  useEffect(() => {
    if (isOpen && teacherData) {
      // Get roles from teacherData
      const userRoles = teacherData.user?.roles?.map(r => r.name) || [];
      
      setFormData({
        teacherId: teacherData.teacher_code || "",
        fullName: teacherData.full_name || "",
        dateOfBirth: teacherData.dob || "",
        email: teacherData.email || "",
        department: teacherData.department || "",
        phoneNumber: teacherData.phone || "",
        roles: userRoles,
        avatarUrl: teacherData.avatar_url || "",
        avatarFile: null,
        officeHours: teacherData.office_hours || "",
      });
      clearErrors();
      setRoleError("");
    }
  }, [isOpen, teacherData, clearErrors]);

  const handleRoleChange = (roleValue) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      const isSelected = currentRoles.includes(roleValue);
      
      if (isSelected) {
        // Remove role
        const newRoles = currentRoles.filter(r => r !== roleValue);
        // Clear role error if there's still at least one role
        if (newRoles.length > 0) {
          setRoleError("");
        }
        return { ...prev, roles: newRoles };
      } else {
        // Add role and clear error
        setRoleError("");
        return { ...prev, roles: [...currentRoles, roleValue] };
      }
    });
  };

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
    // Check roles first
    if (!formData.roles || formData.roles.length === 0) {
      setRoleError("Vui lòng chọn ít nhất 1 quyền");
      console.error("Validation failed: No roles selected");
      return;
    }
    setRoleError("");

    // Validate only required fields before submit
    const requiredFieldsValid = validateAllFields(formData);
    
    // Filter out errors for optional fields (officeHours, dateOfBirth, avatarUrl)
    const requiredFieldErrors = Object.entries(errors).filter(([key, value]) => 
      value !== "" && !["officeHours", "dateOfBirth", "avatarUrl"].includes(key)
    );

    if (!requiredFieldsValid && requiredFieldErrors.length > 0) {
      console.error("Validation failed:", errors);
      return;
    }

    console.log("Form data to submit:", formData);

    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      avatarFile: file,
      avatarUrl: previewUrl,
    }));
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
              Mã nhân sự <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="teacherId"
              value={formData.teacherId}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Mã nhân sự không thể thay đổi</p>
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

          {/* Multi-select Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phân quyền tài khoản <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {roleOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`role-${option.value}`}
                    checked={formData.roles.includes(option.value)}
                    onChange={() => handleRoleChange(option.value)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`role-${option.value}`}
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {roleError && (
              <p className="mt-1 text-sm text-red-500">{roleError}</p>
            )}
          </div>

          {/* Office Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giờ làm việc
            </label>
            <input
              type="text"
              name="officeHours"
              value={formData.officeHours}
              onChange={handleChange}
              placeholder="Ví dụ: T2,T3,T4 8:00-17:00"
              className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đại diện
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
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
