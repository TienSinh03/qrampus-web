/**
 * Course Section Validation Rules and Messages
 */

export const VALIDATION_PATTERNS = {
  courseCode: /^[A-Za-z0-9]{3,20}$/,
  semester: /^\d{4}-[12]$/,
  credits: /^([1-9]|10)$/,
  practiceSessionsNumber: /^([0-9]|1[0-9]|20)$/,
};

export const ERROR_MESSAGES = {
  code: {
    required: "Mã học phần không được để trống",
    invalid: "Mã học phần chỉ chứa chữ và số (3-20 ký tự)",
    minLength: "Mã học phần phải có ít nhất 3 ký tự",
    maxLength: "Mã học phần không được vượt quá 20 ký tự",
  },
  name: {
    required: "Tên học phần không được để trống",
    maxLength: "Tên học phần không được vượt quá 200 ký tự",
  },
  credits: {
    required: "Số tín chỉ không được để trống",
    invalid: "Số tín chỉ phải là số nguyên từ 1 đến 10",
    min: "Số tín chỉ tối thiểu là 1",
    max: "Số tín chỉ tối đa là 10",
  },
  semester: {
    required: "Học kỳ không được để trống",
    invalid: "Học kỳ phải có định dạng YYYY-1 hoặc YYYY-2 (ví dụ: 2024-1)",
    invalidYear: "Năm học không hợp lệ",
    invalidSemester: "Học kỳ phải là 1 hoặc 2",
  },
  max_students: {
    required: "Số sinh viên tối đa không được để trống",
    invalid: "Số sinh viên phải là số nguyên dương",
    min: "Số sinh viên tối thiểu là 1",
    max: "Số sinh viên tối đa là 500",
  },
  practice_sessions: {
    invalid: "Số nhóm thực hành phải là số nguyên từ 0 đến 20",
    min: "Số nhóm thực hành tối thiểu là 0",
    max: "Số nhóm thực hành tối đa là 20",
    notDivisible: "Số sinh viên phải chia hết cho số nhóm thực hành",
  },
  description: {
    maxLength: "Mô tả không được vượt quá 1000 ký tự",
  },
};

/**
 * Validate course code
 * @param {string} value - Course code
 * @returns {string} Error message or empty string
 */
export const validateCourseCode = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.code.required;
  const trimmed = value.trim();
  if (trimmed.length < 3) return ERROR_MESSAGES.code.minLength;
  if (trimmed.length > 20) return ERROR_MESSAGES.code.maxLength;
  if (!VALIDATION_PATTERNS.courseCode.test(trimmed))
    return ERROR_MESSAGES.code.invalid;
  return "";
};

/**
 * Validate course name
 * @param {string} value - Course name
 * @returns {string} Error message or empty string
 */
export const validateCourseName = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.name.required;
  if (value.trim().length > 200) return ERROR_MESSAGES.name.maxLength;
  return "";
};

/**
 * Validate credits
 * @param {number|string} value - Number of credits
 * @returns {string} Error message or empty string
 */
export const validateCredits = (value) => {
  if (!value && value !== 0) return ERROR_MESSAGES.credits.required;
  
  const credits = parseInt(value);
  if (isNaN(credits)) return ERROR_MESSAGES.credits.invalid;
  if (credits < 1) return ERROR_MESSAGES.credits.min;
  if (credits > 10) return ERROR_MESSAGES.credits.max;
  
  return "";
};

/**
 * Validate semester format (YYYY-1 or YYYY-2)
 * @param {string} value - Semester string
 * @returns {string} Error message or empty string
 */
export const validateSemester = (value) => {
  if (!value?.trim()) return ERROR_MESSAGES.semester.required;
  
  const trimmed = value.trim();
  if (!VALIDATION_PATTERNS.semester.test(trimmed)) {
    return ERROR_MESSAGES.semester.invalid;
  }
  
  const [year] = trimmed.split('-');
  const yearNum = parseInt(year);
  const currentYear = new Date().getFullYear();
  
  // Check if year is reasonable (within 10 years from current year)
  if (yearNum < currentYear - 5 || yearNum > currentYear + 10) {
    return ERROR_MESSAGES.semester.invalidYear;
  }
  
  return "";
};

/**
 * Validate max students
 * @param {number|string} value - Maximum number of students
 * @returns {string} Error message or empty string
 */
export const validateMaxStudents = (value) => {
  if (!value && value !== 0) return ERROR_MESSAGES.max_students.required;
  
  const maxStudents = parseInt(value);
  if (isNaN(maxStudents)) return ERROR_MESSAGES.max_students.invalid;
  if (maxStudents < 1) return ERROR_MESSAGES.max_students.min;
  if (maxStudents > 500) return ERROR_MESSAGES.max_students.max;
  
  return "";
};

/**
 * Validate practice sessions
 * @param {number|string} value - Number of practice sessions
 * @returns {string} Error message or empty string
 */
export const validatePracticeSessions = (value) => {
  // Practice sessions is optional, can be 0 or empty
  if (!value && value !== 0) return "";
  
  const practiceSessions = parseInt(value);
  if (isNaN(practiceSessions)) return ERROR_MESSAGES.practice_sessions.invalid;
  if (practiceSessions < 0) return ERROR_MESSAGES.practice_sessions.min;
  if (practiceSessions > 20) return ERROR_MESSAGES.practice_sessions.max;
  
  return "";
};

/**
 * Validate divisibility of max_students by practice_sessions
 * @param {number|string} maxStudents - Maximum number of students
 * @param {number|string} practiceSessions - Number of practice sessions
 * @returns {string} Error message or empty string
 */
export const validateDivisibility = (maxStudents, practiceSessions) => {
  const students = parseInt(maxStudents);
  const sessions = parseInt(practiceSessions);
  
  // Skip if either is invalid or sessions is 0
  if (isNaN(students) || isNaN(sessions) || sessions === 0) return "";
  
  if (students % sessions !== 0) {
    const suggestion1 = Math.floor(students / sessions) * sessions;
    const suggestion2 = Math.ceil(students / sessions) * sessions;
    return `Số sinh viên (${students}) phải chia hết cho số nhóm TH (${sessions}). Gợi ý: ${suggestion1} hoặc ${suggestion2} sinh viên`;
  }
  
  return "";
};

/**
 * Validate description
 * @param {string} value - Description text
 * @returns {string} Error message or empty string
 */
export const validateDescription = (value) => {
  if (value && value.length > 1000) {
    return ERROR_MESSAGES.description.maxLength;
  }
  return "";
};

/**
 * Validate entire course section form
 * @param {Object} formData - Form data object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export const validateCourseSectionForm = (formData) => {
  const errors = {};
  
  // Validate code
  const codeError = validateCourseCode(formData.code);
  if (codeError) errors.code = codeError;
  
  // Validate name
  const nameError = validateCourseName(formData.name);
  if (nameError) errors.name = nameError;
  
  // Validate credits
  const creditsError = validateCredits(formData.credits);
  if (creditsError) errors.credits = creditsError;
  
  // Validate semester
  const semesterError = validateSemester(formData.semester);
  if (semesterError) errors.semester = semesterError;
  
  // Validate max_students
  const maxStudentsError = validateMaxStudents(formData.max_students);
  if (maxStudentsError) errors.max_students = maxStudentsError;
  
  // Validate practice_sessions
  const practiceSessionsError = validatePracticeSessions(formData.practice_sessions);
  if (practiceSessionsError) errors.practice_sessions = practiceSessionsError;
  
  // Validate divisibility (only if both fields are valid)
  if (!maxStudentsError && !practiceSessionsError) {
    const divisibilityError = validateDivisibility(
      formData.max_students, 
      formData.practice_sessions
    );
    if (divisibilityError) errors.practice_sessions = divisibilityError;
  }
  
  // Validate description
  const descriptionError = validateDescription(formData.description);
  if (descriptionError) errors.description = descriptionError;
  
  return errors;
};

/**
 * Check if form has any errors
 * @param {Object} errors - Errors object from validateCourseSectionForm
 * @returns {boolean} True if there are errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Validate bulk course sections data
 * @param {Array} courseSections - Array of course section objects
 * @returns {Object} Object with validation results
 */
export const validateBulkCourseSections = (courseSections) => {
  if (!Array.isArray(courseSections) || courseSections.length === 0) {
    return {
      valid: false,
      message: "Dữ liệu không hợp lệ hoặc rỗng",
      errors: []
    };
  }
  
  const errors = [];
  const validItems = [];
  
  courseSections.forEach((item, index) => {
    const itemErrors = validateCourseSectionForm(item);
    
    if (hasErrors(itemErrors)) {
      errors.push({
        index: index + 1,
        code: item.code,
        errors: itemErrors
      });
    } else {
      validItems.push(item);
    }
  });
  
  return {
    valid: errors.length === 0,
    totalItems: courseSections.length,
    validItems: validItems.length,
    invalidItems: errors.length,
    errors: errors,
    message: errors.length === 0 
      ? `Tất cả ${courseSections.length} học phần đều hợp lệ` 
      : `${errors.length}/${courseSections.length} học phần có lỗi`
  };
};

/**
 * Format semester from year and semester number
 * @param {string|number} year - Year (e.g. 2024)
 * @param {string|number} semester - Semester number (1 or 2)
 * @returns {string} Formatted semester (e.g. "2024-1")
 */
export const formatSemester = (year, semester) => {
  return `${year}-${semester}`;
};

/**
 * Parse semester string to year and semester number
 * @param {string} semesterString - Semester string (e.g. "2024-1")
 * @returns {Object} Object with year and semester properties
 */
export const parseSemester = (semesterString) => {
  if (!semesterString || typeof semesterString !== 'string') {
    return { year: '', semester: '' };
  }
  
  const [year, semester] = semesterString.split('-');
  return { year, semester };
};
