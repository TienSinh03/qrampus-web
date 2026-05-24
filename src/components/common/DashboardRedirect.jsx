import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { getDefaultRoute, getPrimaryRole } from '@config/roleRoutes';
import { ROLES } from '@constants/roles';
import DashboardPage from '@pages/dashboard/teacher/DashboardPage';

/**
 * DashboardRedirect Component
 * Tự động redirect user đến trang phù hợp với activeRole
 * 
 * - Teacher → hiển thị Teacher Dashboard tại /dashboard (không redirect)
 * - Admin → redirect đến Admin Dashboard (/dashboard/admin)
 * - Attendance Staff → redirect đến Attendance Dashboard (/dashboard/attendance-dashboard)
 */
const DashboardRedirect = () => {
  const { user, loading, activeRole, needsRoleSelection } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Admin chưa chọn role -> redirect về /role
  if (needsRoleSelection() && !activeRole) {
    return <Navigate to="/role" replace />;
  }

  // Sử dụng activeRole nếu có, nếu không thì dùng primary role từ user.roles
  const userRoles = user?.roles || [];
  const effectiveRole = activeRole || getPrimaryRole(userRoles);

  // Redirect dựa trên effective role
  if (effectiveRole === ROLES.ADMIN) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (effectiveRole === ROLES.TEACHER) {
    // Hiển thị Teacher Dashboard trực tiếp tại /dashboard
    return <DashboardPage />;
  }

  if (effectiveRole === ROLES.ATTENDANCE_STAFF) {
    return <Navigate to="/dashboard/attendance-dashboard" replace />;
  }

  // Fallback: dùng getDefaultRoute
  const defaultRoute = getDefaultRoute(userRoles);
  return <Navigate to={defaultRoute} replace />;
};

export default DashboardRedirect;
