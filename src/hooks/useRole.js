import { useAuth } from '@contexts/AuthContext';
import { hasRole, hasAnyRole, hasAllRoles, ROLES } from '@constants/roles';
import { 
  canAccessRoute, 
  getAccessibleRoutes, 
  getPrimaryRole,
  getDefaultRoute 
} from '@config/roleRoutes';

/**
 * Custom hook để làm việc với roles
 */
export const useRole = () => {
  const { user } = useAuth();
  const userRoles = user?.roles || [];

  /**
   * Kiểm tra user có role cụ thể không
   */
  const checkRole = (role) => {
    return hasRole(userRoles, role);
  };

  /**
   * Kiểm tra user có bất kỳ role nào trong danh sách không
   */
  const checkAnyRole = (roles) => {
    return hasAnyRole(userRoles, roles);
  };

  /**
   * Kiểm tra user có tất cả roles trong danh sách không
   */
  const checkAllRoles = (roles) => {
    return hasAllRoles(userRoles, roles);
  };

  /**
   * Kiểm tra user có quyền truy cập route không
   */
  const checkRouteAccess = (routePath) => {
    return canAccessRoute(userRoles, routePath);
  };

  /**
   * Lấy danh sách routes user có thể truy cập
   */
  const accessibleRoutes = getAccessibleRoutes(userRoles);

  /**
   * Lấy primary role của user
   */
  const primaryRole = getPrimaryRole(userRoles);

  /**
   * Lấy default route của user
   */
  const defaultRoute = getDefaultRoute(userRoles);

  /**
   * Check specific roles
   */
  const isAdmin = checkRole(ROLES.ADMIN);
  const isTeacher = checkRole(ROLES.TEACHER);
  const isStudent = checkRole(ROLES.STUDENT);
  const isAttendanceStaff = checkRole(ROLES.ATTENDANCE_STAFF);

  return {
    userRoles,
    primaryRole,
    defaultRoute,
    accessibleRoutes,
    checkRole,
    checkAnyRole,
    checkAllRoles,
    checkRouteAccess,
    isAdmin,
    isTeacher,
    isStudent,
    isAttendanceStaff,
  };
};
