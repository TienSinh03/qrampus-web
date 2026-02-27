import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { getDefaultRoute, getPrimaryRole } from '@config/roleRoutes';
import { ROLES } from '@constants/roles';
import DashboardPage from '@pages/dashboard/teacher/DashboardPage';

/**
 * DashboardRedirect Component
 * Tự động redirect user đến trang phù hợp với role
 * 
 * - Teacher → hiển thị Teacher Dashboard tại /dashboard (không redirect)
 * - Admin → redirect đến Admin Dashboard (/dashboard/admin)
 * - Attendance Staff → redirect đến Attendance Dashboard (/dashboard/attendance-dashboard)
 */
const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const userRoles = user?.roles || [];
  const primaryRole = getPrimaryRole(userRoles);

  // Redirect dựa trên primary role
  if (primaryRole === ROLES.ADMIN) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  if (primaryRole === ROLES.TEACHER) {
    // Hiển thị Teacher Dashboard trực tiếp tại /dashboard
    return <DashboardPage />;
  }

  if (primaryRole === ROLES.ATTENDANCE_STAFF) {
    return <Navigate to="/dashboard/attendance-dashboard" replace />;
  }

  // Fallback: dùng getDefaultRoute
  const defaultRoute = getDefaultRoute(userRoles);
  return <Navigate to={defaultRoute} replace />;
};

export default DashboardRedirect;
