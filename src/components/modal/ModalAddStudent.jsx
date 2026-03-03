import React, { useState } from "react";
import { X } from "lucide-react";
import { DEPARTMENTS } from "../../constants/departments";
import {
  validateField,
  validateStudentForm,
  hasFormErrors,
} from "../../utils/validation/studentValidation";

const INITIAL_FORM = {
  student_code: "",
  full_name: "",
  dob: "",
  email: "",
  major: "",
  class_name: "",
  phone: "",
  avatar: null,
};

const Field = ({ label, name, type = "text", placeholder, formData, onChange, onBlur, errors, touched, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {name !== "phone" && name !== "avatar_url" && <span className="text-red-500">*</span>}
    </label>
    {children || (
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
          errors[name] && touched[name]
            ? "border-red-400 focus:ring-red-400"
            : "focus:ring-cyan-500"
        }`}
      />
    )}
    {errors[name] && touched[name] && (
      <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
    )}
  </div>
);

const ModalAddStudent = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = () => {
    const allTouched = Object.keys(INITIAL_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);

    const newErrors = validateStudentForm(formData);
    setErrors(newErrors);
    if (hasFormErrors(newErrors)) return;

    if (onSubmit) {
      onSubmit(formData);
    }
    handleReset();
    onClose();
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setTouched({});
  };

  const fieldProps = { formData, onChange: handleChange, onBlur: handleBlur, errors, touched };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-cyan-100">
          <h3 className="text-xl font-semibold text-gray-800">Thêm hồ sơ Sinh viên</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-cyan-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 gap-4">
            <Field {...fieldProps} label="Mã sinh viên" name="student_code" placeholder="Ví dụ: 21010612" />
            <Field {...fieldProps} label="Họ tên Sinh viên" name="full_name" placeholder="Nhập họ tên đầy đủ" />
            <Field {...fieldProps} label="Ngày sinh" name="dob" type="date" />
            <Field {...fieldProps} label="Email" name="email" type="email" placeholder="21010612@student.edu.vn" />

            <Field {...fieldProps} label="Ngành học" name="major">
              <select
                name="major"
                value={formData.major}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.major && touched.major
                    ? "border-red-400 focus:ring-red-400"
                    : "focus:ring-cyan-500"
                }`}
              >
                <option value="">-- Chọn Ngành học --</option>
                {DEPARTMENTS.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.major && touched.major && (
                <p className="mt-1 text-xs text-red-500">{errors.major}</p>
              )}
            </Field>

            <Field {...fieldProps} label="Lớp học" name="class_name" placeholder="Ví dụ: DHKTPM18A" />
            <Field {...fieldProps} label="Số điện thoại" name="phone" placeholder="0909123456" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {formData.avatar && (
                <p className="mt-2 text-sm text-gray-600">
                  Đã chọn: {formData.avatar.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={() => { handleReset(); onClose(); }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Tạo hồ sơ
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddStudent;
