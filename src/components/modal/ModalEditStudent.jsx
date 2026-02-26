import React, { useState, useEffect } from "react";
import { X, Camera } from "lucide-react";

const ModalEditStudent = ({ isOpen, onClose, studentData, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    dateOfBirth: "",
    email: "",
    department: "",
    major: "",
    class: "",
    phoneNumber: "",
    avatarUrl: "",
  });

  // Initialize form data when studentData changes
  useEffect(() => {
    if (isOpen && studentData) {
      // eslint-disable-next-line
      setFormData({
        studentId: studentData.user_id || "",
        fullName: studentData.full_name || "",
        dateOfBirth: studentData.date_of_birth || "",
        email: studentData.email || "",
        department: studentData.department || "",
        major: studentData.major || "",
        class: studentData.class || "",
        phoneNumber: studentData.phone_number || "",
        avatarUrl: studentData.avatar_url || "",
      });
    }
  }, [isOpen, studentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Validate and submit logic
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
        <div className="flex items-center justify-between px-6 py-5 border-b bg-cyan-300">
          <h3 className="text-xl font-semibold text-gray-800">
            Cập nhật hồ sơ Sinh viên
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-cyan-500 transition-all duration-300 hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã sinh viên
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên Sinh viên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
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
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khoa / Viện
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option>Khoa Công nghệ thông tin</option>
              <option>Khoa Điện tử - Viễn thông</option>
              <option>Khoa Cơ khí</option>
              <option>Khoa Kinh tế</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngành học
            </label>
            <select
              name="major"
              value={formData.major}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500"
            >
              <option>Công nghệ thông tin</option>
              <option>Khoa học máy tính</option>
              <option>Hệ thống thông tin</option>
              <option>An toàn thông tin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lớp học
            </label>
            <input
              type="text"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh đại diện
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border border-cyan-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          {/* Current Avatar */}
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={formData.avatarUrl || "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png"}
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
