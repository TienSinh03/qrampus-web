/**
 * User Roles Constants
 * Khớp với backend roles
 */

export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  ATTENDANCE_STAFF: 'attendance_staff',
};

/**
 * Role labels cho UI
 */
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Quản trị viên',
  [ROLES.TEACHER]: 'Giảng viên',
  [ROLES.ATTENDANCE_STAFF]: 'Nhân viên điểm danh',
};

/**
 * Kiểm tra user có role cụ thể không
 */
export const hasRole = (userRoles, role) => {
  if (!Array.isArray(userRoles)) return false;
  return userRoles.includes(role);
};

/**
 * Kiểm tra user có bất kỳ role nào trong danh sách không
 */
export const hasAnyRole = (userRoles, roles) => {
  if (!Array.isArray(userRoles) || !Array.isArray(roles)) return false;
  return roles.some(role => userRoles.includes(role));
};

/**
 * Kiểm tra user có tất cả roles trong danh sách không
 */
export const hasAllRoles = (userRoles, roles) => {
  if (!Array.isArray(userRoles) || !Array.isArray(roles)) return false;
  return roles.every(role => userRoles.includes(role));
};
