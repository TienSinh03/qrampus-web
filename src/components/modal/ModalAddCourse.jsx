import React, { useState } from "react";
import { X } from "lucide-react";
import { 
  validateCourseSectionForm, 
  hasErrors,
  formatSemester 
} from "../../utils/validation/courseValidation";

const ModalAddCourse = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    credits: "",
    description: "",
    year: "",
    semester: "",
    max_students: "",
    practice_sessions: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    // Transform form data to API format for validation
    const dataToValidate = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      credits: formData.credits,
      description: formData.description.trim(),
      semester: formatSemester(formData.year, formData.semester),
      max_students: formData.max_students,
      practice_sessions: formData.practice_sessions || 0,
    };

    const validationErrors = validateCourseSectionForm(dataToValidate);
    setErrors(validationErrors);
    return !hasErrors(validationErrors);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // Transform data to API format
    const apiData = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim(),
      credits: parseInt(formData.credits),
      description: formData.description.trim() || null,
      semester: `${formData.year}-${formData.semester}`, // Format: YYYY-1 or YYYY-2
      max_students: parseInt(formData.max_students),
      practice_sessions: formData.practice_sessions ? parseInt(formData.practice_sessions) : 0,
    };

    if (onSubmit) {
      onSubmit(apiData);
    }
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormData({
      code: "",
      name: "",
      credits: "",
      description: "",
      year: "",
      semester: "",
      max_students: "",
      practice_sessions: "",
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  // Generate year options (current year and next 5 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear + i);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-emerald-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Thêm học phần mới
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Điền thông tin học phần bên dưới
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-emerald-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã học phần <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Ví dụ: INT3104"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.code
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-emerald-500"
                }`}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên học phần <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Lập trình tích hợp"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-emerald-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tín chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="credits"
                value={formData.credits}
                onChange={handleChange}
                placeholder="Ví dụ: 3"
                min="1"
                max="10"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.credits
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-emerald-500"
                }`}
              />
              {errors.credits && (
                <p className="text-red-500 text-sm mt-1">{errors.credits}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả học phần
              </label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả về học phần..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm học <span className="text-red-500">*</span>
                </label>
                <select 
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.year
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-emerald-500"
                  }`}
                >
                  <option value="">-- Chọn năm --</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Học kỳ <span className="text-red-500">*</span>
                </label>
                <select 
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                    errors.semester
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-emerald-500"
                  }`}
                >
                  <option value="">-- Chọn kỳ --</option>
                  <option value="1">Kỳ 1</option>
                  <option value="2">Kỳ 2</option>
                </select>
                {errors.semester && (
                  <p className="text-red-500 text-sm mt-1">{errors.semester}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số sinh viên tối đa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="max_students"
                value={formData.max_students}
                onChange={handleChange}
                placeholder="Ví dụ: 60"
                min="1"
                max="500"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.max_students
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-emerald-500"
                }`}
              />
              {errors.max_students && (
                <p className="text-red-500 text-sm mt-1">{errors.max_students}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số nhóm thực hành
              </label>
              <input
                type="number"
                name="practice_sessions"
                value={formData.practice_sessions}
                onChange={handleChange}
                placeholder="Ví dụ: 3 (để trống nếu không có)"
                min="0"
                max="20"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.practice_sessions
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-emerald-500"
                }`}
              />
              {errors.practice_sessions && (
                <p className="text-red-500 text-sm mt-1">{errors.practice_sessions}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Nếu có nhóm TH, số SV phải chia hết cho số nhóm TH
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50"
          >
            Tạo học phần
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddCourse;
