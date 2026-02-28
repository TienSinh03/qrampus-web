import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { canAccessRoute, getDefaultRoute } from '@config/roleRoutes';

/**
 * RoleRoute Component
 * Bảo vệ routes dựa trên activeRole của user (role đang hoạt động)
 * 
 * @param {React.ReactNode} children - Component con
 * @param {Array<string>} requiredRoles - Roles được phép truy cập (optional)
 */
export const RoleRoute = ({ children, requiredRoles = null }) => {
  const { user, isAuthenticated, loading, activeRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không chỉ định requiredRoles, cho phép tất cả user đã login
  if (!requiredRoles) {
    return children;
  }

  // Sử dụng activeRole nếu có, nếu không thì dùng tất cả roles của user
  const effectiveRoles = activeRole ? [activeRole] : (user?.roles || []);
  const hasRequiredRole = requiredRoles.some(role => effectiveRoles.includes(role));

  if (!hasRequiredRole) {
    // Redirect về trang phù hợp với activeRole hoặc role mặc định
    const defaultRoute = getDefaultRoute(effectiveRoles);
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

/**
 * ProtectedRoute Component
 * Kiểm tra user có quyền truy cập route cụ thể không
 * 
 * @param {React.ReactNode} children - Component con
 * @param {string} routePath - Path của route
 */
export const ProtectedRoute = ({ children, routePath }) => {
  const { user, isAuthenticated, loading, activeRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sử dụng activeRole nếu có
  const effectiveRoles = activeRole ? [activeRole] : (user?.roles || []);
  
  // Kiểm tra quyền truy cập
  if (!canAccessRoute(effectiveRoles, routePath)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
