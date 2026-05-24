/**
 * Student Validation Rules and Messages
 */

export const VALIDATION_PATTERNS = {
  studentCode: /^\d{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^0\d{9,10}$/,
};

export const ERROR_MESSAGES = {
  student_code: {
    required: "Mã sinh viên không được để trống",
    invalid: "Mã sinh viên phải là 8 chữ số",
  },
  full_name: {
    required: "Họ tên không được để trống",
    minLength: "Họ tên phải có ít nhất 3 ký tự",
  },
  email: {
    required: "Email không được để trống",
    invalid: "Email không đúng định dạng",
  },
  major: {
    required: "Vui lòng chọn Ngành học",
  },
  class_name: {
    required: "Lớp học không được để trống",
  },
  phone: {
    invalid: "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số",
  },
  dob: {
    required: "Ngày sinh không được để trống",
  },
};

export const validateStudentCode = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.student_code.required;
  if (!VALIDATION_PATTERNS.studentCode.test(value.trim()))
    return ERROR_MESSAGES.student_code.invalid;
  return "";
};

export const validateFullName = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.full_name.required;
  if (value.trim().length < 3) return ERROR_MESSAGES.full_name.minLength;
  return "";
};

export const validateEmail = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.email.required;
  if (!VALIDATION_PATTERNS.email.test(value)) return ERROR_MESSAGES.email.invalid;
  return "";
};

export const validateMajor = (value) => {
  if (!value) return ERROR_MESSAGES.major.required;
  return "";
};

export const validateClassName = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.class_name.required;
  return "";
};

export const validatePhone = (value) => {
  if (!value) return ""; // phone is optional
  if (value.length > 0 && !VALIDATION_PATTERNS.phone.test(value))
    return ERROR_MESSAGES.phone.invalid;
  return "";
};

export const validateDob = (value) => {
  if (!value) return ERROR_MESSAGES.dob.required;
  return "";
};

/**
 * Validate a single field by name
 */
export const validateField = (fieldName, value) => {
  switch (fieldName) {
    case "student_code": return validateStudentCode(value);
    case "full_name":    return validateFullName(value);
    case "email":        return validateEmail(value);
    case "major":        return validateMajor(value);
    case "class_name":   return validateClassName(value);
    case "phone":        return validatePhone(value);
    case "dob":          return validateDob(value);
    default:             return "";
  }
};

/**
 * Validate all student form fields
 */
export const validateStudentForm = (formData) => ({
  student_code: validateStudentCode(formData.student_code || ""),
  full_name:    validateFullName(formData.full_name || ""),
  email:        validateEmail(formData.email || ""),
  major:        validateMajor(formData.major || ""),
  class_name:   validateClassName(formData.class_name || ""),
  phone:        validatePhone(formData.phone || ""),
  dob:          validateDob(formData.dob || ""),
});

export const hasFormErrors = (errors) =>
  Object.values(errors).some((e) => e !== "");

export const isStudentFormValid = (formData) =>
  !hasFormErrors(validateStudentForm(formData));
