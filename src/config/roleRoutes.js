import { ROLES } from '@constants/roles';

/**
 * Route Configuration với Role-based Access Control
 * Định nghĩa routes và roles được phép truy cập
 */

// Teacher Routes
export const TEACHER_ROUTES = [
  { path: '/dashboard', label: 'Teacher Dashboard' },
  { path: '/dashboard/schedule', label: 'Lịch giảng' },
  { path: '/dashboard/qrcode', label: 'QR Code' },
  { path: '/dashboard/qrcode-fullscreen', label: 'QR Fullscreen' },
  { path: '/dashboard/study-session', label: 'Buổi học' },
  { path: '/dashboard/results-qr', label: 'Kết quả QR' },
  { path: '/dashboard/results-qr-extend', label: 'Kết quả QR mở rộng' },
  { path: '/dashboard/results-qr-detail-user', label: 'Chi tiết người dùng' },
  { path: '/dashboard/timekeeping', label: 'Chấm công' },
  { path: '/dashboard/survey-page', label: 'Khảo sát' },
  { path: '/dashboard/leave-management', label: 'Quản lý nghỉ phép' },
  { path: '/dashboard/notifications', label: 'Thông báo' },
  { path: '/dashboard/report-page', label: 'Báo cáo' },
  { path: '/dashboard/reports', label: 'Báo cáo' },
  { path: '/dashboard/account-setting', label: 'Cài đặt tài khoản' },
  { path: '/dashboard/change-password', label: 'Đổi mật khẩu' },
  { path: '/dashboard/setting', label: 'Cài đặt' },
];

// Admin Routes
export const ADMIN_ROUTES = [
  { path: '/dashboard/admin', label: 'Admin Dashboard' },
  { path: '/dashboard/admin/dashboard', label: 'Admin Dashboard' },
  { path: '/dashboard/admin/qrcode', label: 'QR Code' },
  { path: '/dashboard/admin/qrcode/session/qrcode-detail', label: 'Chi tiết QR' },
  { path: '/dashboard/admin/qrcode/session/qrcode-detail/session-detail', label: 'Chi tiết buổi học' },
  { path: '/dashboard/admin/students', label: 'Quản lý sinh viên' },
  { path: '/dashboard/admin/teachers', label: 'Quản lý giảng viên' },
  { path: '/dashboard/admin/accounts', label: 'Quản lý tài khoản' },
  { path: '/dashboard/admin/surveys', label: 'Quản lý khảo sát' },
  { path: '/dashboard/admin/surveys/detail-survey', label: 'Chi tiết khảo sát' },
  { path: '/dashboard/admin/schedules', label: 'Quản lý lịch' },
  { path: '/dashboard/admin/courses', label: 'Quản lý khóa học' },
  { path: '/dashboard/admin/enrollments', label: 'Quản lý đăng ký' },
  { path: '/dashboard/admin/rooms', label: 'Quản lý phòng' },
  { path: '/dashboard/notifications', label: 'Thông báo' },
  { path: '/dashboard/account-setting', label: 'Cài đặt tài khoản' },
  { path: '/dashboard/change-password', label: 'Đổi mật khẩu' },
];

// Attendance Staff Routes
export const ATTENDANCE_STAFF_ROUTES = [
  { path: '/dashboard/attendance-dashboard', label: 'Điểm danh' },
  { path: '/dashboard/notifications', label: 'Thông báo' },
  { path: '/dashboard/account-setting', label: 'Cài đặt tài khoản' },
  { path: '/dashboard/change-password', label: 'Đổi mật khẩu' },
];

/**
 * Map roles to their accessible routes
 */
export const ROLE_ROUTES_MAP = {
  [ROLES.TEACHER]: TEACHER_ROUTES,
  [ROLES.ADMIN]: ADMIN_ROUTES,
  [ROLES.ATTENDANCE_STAFF]: ATTENDANCE_STAFF_ROUTES,
};

/**
 * Lấy danh sách routes mà user có thể truy cập dựa trên roles
 * @param {Array<string>} userRoles - Danh sách roles của user
 * @returns {Array} Danh sách routes user có thể truy cập
 */
export const getAccessibleRoutes = (userRoles) => {
  if (!Array.isArray(userRoles) || userRoles.length === 0) {
    return [];
  }

  // Combine routes từ tất cả roles của user
  const accessibleRoutes = new Map(); // Use Map to avoid duplicates

  userRoles.forEach(role => {
    const routes = ROLE_ROUTES_MAP[role] || [];
    routes.forEach(route => {
      accessibleRoutes.set(route.path, route);
    });
  });

  return Array.from(accessibleRoutes.values());
};

/**
 * Kiểm tra user có quyền truy cập route không
 * @param {Array<string>} userRoles - Danh sách roles của user
 * @param {string} routePath - Path của route cần kiểm tra
 * @returns {boolean} True nếu user có quyền truy cập
 */
export const canAccessRoute = (userRoles, routePath) => {
  if (!Array.isArray(userRoles) || userRoles.length === 0) {
    return false;
  }

  const accessibleRoutes = getAccessibleRoutes(userRoles);
  return accessibleRoutes.some(route => {
    // Exact match
    if (route.path === routePath) return true;
    
    // Partial match for nested routes
    if (routePath.startsWith(route.path + '/')) return true;
    
    return false;
  });
};

/**
 * Lấy default route dựa trên role chính của user
 * @param {Array<string>} userRoles - Danh sách roles của user
 * @returns {string} Default route path
 */
export const getDefaultRoute = (userRoles) => {
  if (!Array.isArray(userRoles) || userRoles.length === 0) {
    return '/login';
  }

  // Priority: admin > teacher > attendance_staff
  if (userRoles.includes(ROLES.ADMIN)) {
    return '/dashboard/admin';
  }
  
  if (userRoles.includes(ROLES.TEACHER)) {
    return '/dashboard';
  }
  
  if (userRoles.includes(ROLES.ATTENDANCE_STAFF)) {
    return '/dashboard/attendance-dashboard';
  }

  return '/dashboard';
};

/**
 * Lấy primary role của user (role ưu tiên cao nhất)
 * @param {Array<string>} userRoles - Danh sách roles của user
 * @returns {string} Primary role
 */
export const getPrimaryRole = (userRoles) => {
  if (!Array.isArray(userRoles) || userRoles.length === 0) {
    return null;
  }

  // Priority: admin > teacher > attendance_staff
  if (userRoles.includes(ROLES.ADMIN)) return ROLES.ADMIN;
  if (userRoles.includes(ROLES.TEACHER)) return ROLES.TEACHER;
  if (userRoles.includes(ROLES.ATTENDANCE_STAFF)) return ROLES.ATTENDANCE_STAFF;

  return userRoles[0];
};
