import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ModalEditEnroll = ({ isOpen, onClose, enrollData, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    courseCode: "",
    courseName: "",
    semester: "",
    academicYear: "",
    department: "",
    practicalGroup: "",
    learningForm: "Lý thuyết",
    schedule: "",
    enrollDate: "",
    status: "Chờ duyệt",
  });

  // Initialize form data when enrollData changes
  useEffect(() => {
    if (isOpen && enrollData) {
      // eslint-disable-next-line
      setFormData({
        studentId: enrollData.maSinhVien || "",
        studentName: enrollData.hoTen || "",
        courseCode: enrollData.maHocPhan || "",
        courseName: enrollData.monHoc || "",
        semester: enrollData.ky || "",
        academicYear: enrollData.namHoc || "",
        department: enrollData.khoa || "",
        practicalGroup: enrollData.nhomThucHanh || "",
        learningForm: enrollData.hinhThucHoc || "Lý thuyết",
        schedule: enrollData.lichHoc || "",
        enrollDate: enrollData.ngayDangKy || "",
        status: enrollData.trangThai || "Chờ duyệt",
      });
    }
  }, [isOpen, enrollData]);

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
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-blue-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Chỉnh sửa đăng ký
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-blue-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã sinh viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Mã sinh viên không thể thay đổi</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên sinh viên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã học phần <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="courseCode"
                value={formData.courseCode}
                onChange={handleChange}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Mã học phần không thể thay đổi</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên môn học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Năm học <span className="text-red-500">*</span>
              </label>
              <select 
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn năm học --</option>
                <option value="2022-2023">2022-2023</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Học kỳ <span className="text-red-500">*</span>
              </label>
              <select 
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn học kỳ --</option>
                <option value="1">Kỳ 1</option>
                <option value="2">Kỳ 2</option>
                <option value="3">Kỳ 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khoa/Viện <span className="text-red-500">*</span>
              </label>
              <select 
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Chọn khoa/viện --</option>
                <option value="Công nghệ thông tin">Khoa Công nghệ thông tin</option>
                <option value="Điện tử - Viễn thông">Khoa Điện tử - Viễn thông</option>
                <option value="Cơ khí">Khoa Cơ khí</option>
                <option value="Kinh tế">Khoa Kinh tế</option>
                <option value="Khoa học cơ bản">Khoa Khoa học cơ bản</option>
                <option value="Ngoại ngữ">Khoa Ngoại ngữ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình thức học <span className="text-red-500">*</span>
              </label>
              <select 
                name="learningForm"
                value={formData.learningForm}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Lý thuyết">Lý thuyết</option>
                <option value="Thực hành">Thực hành</option>
                <option value="Kết hợp">Kết hợp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhóm thực hành
              </label>
              <input
                type="text"
                name="practicalGroup"
                value={formData.practicalGroup}
                onChange={handleChange}
                placeholder="Ví dụ: Nhóm 03"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lịch học
              </label>
              <input
                type="text"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                placeholder="Ví dụ: Thứ 2 8:00 - 10:00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày đăng ký <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="enrollDate"
                value={formData.enrollDate}
                onChange={handleChange}
                disabled
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Thành công">Thành công</option>
                <option value="Chờ duyệt">Chờ duyệt</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Buttons - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalEditEnroll;
