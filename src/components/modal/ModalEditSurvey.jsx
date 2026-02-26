import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ModalEditSurvey = ({ isOpen, onClose, surveyData, onSubmit }) => {
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    semester: "",
    academicYear: "",
    learningForm: "",
    practicalGroup: "",
    createdAt: "",
    endAt: "",
    instructorCode: "",
    instructor: "",
    department: "",
    status: "",
  });

  // Initialize form data when surveyData changes
  useEffect(() => {
    if (isOpen && surveyData) {
      // eslint-disable-next-line
      setFormData({
        courseCode: surveyData.course_code || "",
        courseName: surveyData.course_name || "",
        semester: surveyData.semester || "",
        academicYear: surveyData.academic_year || "",
        learningForm: surveyData.learning_form || "",
        practicalGroup: surveyData.practical_group || "",
        createdAt: surveyData.created_at || "",
        endAt: surveyData.end_at || "",
        instructorCode: surveyData.instructor_code || "",
        instructor: surveyData.instructor || "",
        department: surveyData.department || "",
        status: surveyData.status || "",
      });
    }
  }, [isOpen, surveyData]);

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
        <div className="flex items-center justify-between px-6 py-5 border-b bg-indigo-300">
          <h3 className="text-xl font-semibold text-gray-800">
            Cập nhật khảo sát học phần
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-indigo-500 transition-all duration-300 hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã học phần
            </label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên học phần
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Học kỳ
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option>HK1</option>
              <option>HK2</option>
              <option>HK3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Năm học
            </label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình thức học
            </label>
            <select
              name="learningForm"
              value={formData.learningForm}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option>Lý thuyết</option>
              <option>Thực hành</option>
              <option>Lý thuyết + Thực hành</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhóm thực hành
            </label>
            <input
              type="text"
              name="practicalGroup"
              value={formData.practicalGroup}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endAt"
              value={formData.endAt}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã giảng viên
            </label>
            <input
              type="text"
              name="instructorCode"
              value={formData.instructorCode}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên giảng viên
            </label>
            <input
              type="text"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full rounded-lg border border-indigo-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option>Khoa Công nghệ thông tin</option>
              <option>Khoa Điện tử - Viễn thông</option>
              <option>Khoa Cơ khí</option>
              <option>Khoa Kinh tế</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
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
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalEditSurvey;
