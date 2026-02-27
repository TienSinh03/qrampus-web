import { Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { canAccessRoute, getDefaultRoute } from '@config/roleRoutes';

/**
 * RoleRoute Component
 * Bảo vệ routes dựa trên roles của user
 * 
 * @param {React.ReactNode} children - Component con
 * @param {Array<string>} requiredRoles - Roles được phép truy cập (optional)
 */
export const RoleRoute = ({ children, requiredRoles = null }) => {
  const { user, isAuthenticated, loading } = useAuth();

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

  // Kiểm tra user có role được yêu cầu không
  const userRoles = user?.roles || [];
  const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

  if (!hasRequiredRole) {
    // Redirect về trang phù hợp với role của user
    const defaultRoute = getDefaultRoute(userRoles);
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
  const { user, isAuthenticated, loading } = useAuth();

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

  const userRoles = user?.roles || [];
  
  // Kiểm tra quyền truy cập
  if (!canAccessRoute(userRoles, routePath)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
