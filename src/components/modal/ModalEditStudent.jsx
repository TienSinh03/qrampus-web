import React, { useState, useEffect } from "react";
import { X, Camera, Smartphone, Trash2, RotateCcw } from "lucide-react";
import { usePersonnelValidation } from "../../hooks/usePersonnelValidation";
import { DEPARTMENTS } from "../../constants/departments";

const STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "pending", label: "Chờ xác nhận" },
];

const ModalEditStudent = ({ isOpen, onClose, studentData, onSubmit }) => {
  const [formData, setFormData] = useState({
    student_code: "",
    full_name: "",
    dob: "",
    email: "",
    major: "",
    class_name: "",
    phone: "",
    avatar_url: "",
    status: "active",
  });

  const [clearDevice, setClearDevice] = useState(false);

  const { errors, validateAllFields, validateSingleField, clearErrors, shouldAllowInput } =
    usePersonnelValidation();

  // Initialize form data when studentData changes
  useEffect(() => {
    if (isOpen && studentData) {
      setFormData({
        student_code: studentData.student_code || "",
        full_name: studentData.full_name || "",
        dob: studentData.dob ? studentData.dob.split("T")[0] : "",
        email: studentData.email || "",
        major: studentData.major || "",
        class_name: studentData.class_name || "",
        phone: studentData.phone || "",
        avatar_url: studentData.avatar_url || "",
        status: studentData.user?.status || "active",
      });
      clearErrors();
      setClearDevice(false);
    }
  }, [isOpen, studentData, clearErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Numeric-only for phone
    if (name === "phone") {
      if (!shouldAllowInput("phoneNumber", value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    validateSingleField(name === "phone" ? "phoneNumber" : name, value);
  };

  const handleSubmit = () => {
    const mapped = {
      fullName: formData.full_name,
      email: formData.email,
      phoneNumber: formData.phone,
    };

    const valid = validateAllFields(mapped);
    const requiredErrors = Object.entries(errors).filter(
      ([k, v]) => v !== "" && !["dateOfBirth", "avatarUrl", "officeHours", "department"].includes(k)
    );

    if (!valid && requiredErrors.length > 0) return;

    const payload = { ...formData };
    if (clearDevice) payload.device_id = null;

    if (onSubmit) onSubmit(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-cyan-300">
          <h3 className="text-xl font-semibold text-gray-800">
            Cập nhật hồ sơ Sinh viên
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

          {/* Mã sinh viên - read-only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã sinh viên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="student_code"
              value={formData.student_code}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500">Mã sinh viên không thể thay đổi</p>
          </div>
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên Sinh viên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-cyan-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Ngày sinh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Email */}
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
                  : "border-cyan-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Ngành học */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngành học
            </label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full border border-cyan-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">-- Chọn Ngành học --</option>
              {DEPARTMENTS.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Lớp học */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lớp học
            </label>
            <input
              type="text"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength="11"
              className={`w-full rounded-lg border px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
                errors.phoneNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "border-cyan-300 focus:border-cyan-500 focus:ring-cyan-200"
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Trạng thái tài khoản */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái tài khoản
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-cyan-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* ID Thiết bị */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Smartphone size={14} className="text-cyan-600" />
              ID Thiết bị
            </label>
            {clearDevice ? (
              <div className="flex items-center justify-between rounded-lg border border-red-300 bg-red-50 px-4 py-2">
                <span className="text-sm text-red-600 italic">Sẽ xóa ID thiết bị khi lưu...</span>
                <button
                  type="button"
                  onClick={() => setClearDevice(false)}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 ml-3"
                >
                  <RotateCcw size={12} />
                  Hoàn tác
                </button>
              </div>
            ) : studentData?.device_id ? (
              <div className="flex items-center justify-between rounded-lg border border-cyan-300 bg-cyan-50 px-4 py-2">
                <span className="text-sm text-gray-700 font-mono truncate max-w-[240px]">
                  {studentData.device_id?.installation_id
                    ? studentData.device_id.installation_id
                    : JSON.stringify(studentData.device_id)}
                </span>
                <button
                  type="button"
                  onClick={() => setClearDevice(true)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 ml-3 shrink-0"
                >
                  <Trash2 size={12} />
                  Xóa
                </button>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2">
                <span className="text-sm text-gray-400 italic">Chưa đăng ký thiết bị</span>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">Xóa để sinh viên có thể đăng ký lại thiết bị mới</p>
          </div>

          {/* Avatar upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Current Avatar */}
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={
                formData.avatar_url ||
                "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png"
              }
              alt="Avatar"
              className="w-full h-full rounded-lg object-cover border border-cyan-300"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-cyan-500 p-2 rounded-full text-white shadow hover:bg-cyan-600 cursor-pointer"
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
            className="px-6 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 shadow-md"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalEditStudent;
