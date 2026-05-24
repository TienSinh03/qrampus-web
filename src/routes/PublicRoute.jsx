import { useAuth } from "@contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ROLES } from "@constants/roles";

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user, activeRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Admin chưa chọn role -> redirect về /role
    const hasAdminRole = user?.roles?.includes(ROLES.ADMIN);
    if (hasAdminRole && !activeRole) {
      return <Navigate to="/role" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};