/**
 * Personnel Validation Rules and Messages
 */

// Validation patterns
export const VALIDATION_PATTERNS = {
  teacherId: /^\d{8}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneNumber: /^0\d{9,10}$/,
  digitsOnly: /^\d*$/,
};

// Error messages
export const ERROR_MESSAGES = {
  teacherId: {
    required: "Mã giảng viên không được để trống",
    invalid: "Mã giảng viên phải là 8 chữ số",
  },
  fullName: {
    required: "Họ tên không được để trống",
    minLength: "Họ tên phải có ít nhất 3 ký tự",
  },
  email: {
    required: "Email không được để trống",
    invalid: "Email không đúng định dạng",
  },
  department: {
    required: "Vui lòng chọn Khoa/Viện",
  },
  phoneNumber: {
    required: "Số điện thoại không được để trống",
    minLength: "Số điện thoại phải có 10-11 chữ số",
    invalid: "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số",
  },
};

/**
 * Validate teacher ID
 * @param {string} value - Teacher ID value
 * @returns {string} Error message or empty string
 */
export const validateTeacherId = (value) => {
  if (!value.trim()) {
    return ERROR_MESSAGES.teacherId.required;
  }
  if (value.length < 8) {
    return ERROR_MESSAGES.teacherId.invalid;
  }
  if (value.length === 8 && !VALIDATION_PATTERNS.teacherId.test(value)) {
    return ERROR_MESSAGES.teacherId.invalid;
  }
  return "";
};

/**
 * Validate full name
 * @param {string} value - Full name value
 * @returns {string} Error message or empty string
 */
export const validateFullName = (value) => {
  if (!value.trim()) {
    return ERROR_MESSAGES.fullName.required;
  }
  if (value.trim().length < 3) {
    return ERROR_MESSAGES.fullName.minLength;
  }
  return "";
};

/**
 * Validate email
 * @param {string} value - Email value
 * @returns {string} Error message or empty string
 */
export const validateEmail = (value) => {
  if (!value.trim()) {
    return ERROR_MESSAGES.email.required;
  }
  if (!VALIDATION_PATTERNS.email.test(value)) {
    return ERROR_MESSAGES.email.invalid;
  }
  return "";
};

/**
 * Validate department
 * @param {string} value - Department value
 * @returns {string} Error message or empty string
 */
export const validateDepartment = (value) => {
  if (!value) {
    return ERROR_MESSAGES.department.required;
  }
  return "";
};

/**
 * Validate phone number
 * @param {string} value - Phone number value
 * @returns {string} Error message or empty string
 */
export const validatePhoneNumber = (value) => {
  if (!value.trim()) {
    return ERROR_MESSAGES.phoneNumber.required;
  }
  if (value.length > 0 && value.length < 10) {
    return ERROR_MESSAGES.phoneNumber.minLength;
  }
  if (value.length >= 10 && !VALIDATION_PATTERNS.phoneNumber.test(value)) {
    return ERROR_MESSAGES.phoneNumber.invalid;
  }
  return "";
};

/**
 * Validate a single field based on field name
 * @param {string} fieldName - Name of the field
 * @param {string} value - Value to validate
 * @returns {string} Error message or empty string
 */
export const validateField = (fieldName, value) => {
  switch (fieldName) {
    case "teacherId":
      return validateTeacherId(value);
    case "fullName":
      return validateFullName(value);
    case "email":
      return validateEmail(value);
    case "department":
      return validateDepartment(value);
    case "phoneNumber":
      return validatePhoneNumber(value);
    default:
      return "";
  }
};

/**
 * Validate all personnel form fields
 * @param {Object} formData - Form data object
 * @returns {Object} Object with field errors
 */
export const validatePersonnelForm = (formData) => {
  return {
    teacherId: validateTeacherId(formData.teacherId || ""),
    fullName: validateFullName(formData.fullName || ""),
    email: validateEmail(formData.email || ""),
    department: validateDepartment(formData.department || ""),
    phoneNumber: validatePhoneNumber(formData.phoneNumber || ""),
  };
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if has errors
 */
export const hasFormErrors = (errors) => {
  return Object.values(errors).some((error) => error !== "");
};

/**
 * Check if form data is valid
 * @param {Object} formData - Form data object
 * @returns {boolean} True if valid
 */
export const isPersonnelFormValid = (formData) => {
  const errors = validatePersonnelForm(formData);
  return !hasFormErrors(errors);
};
