import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthService from '@services/AuthService';
import PersonnelService from '@services/personnel.service';
import { toast } from 'sonner';
import { ROLES, ROLE_LABELS } from '@constants/roles';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // activeRole: role mà user đang hoạt động (sau khi chọn từ RoleSwitchPage)
  const [activeRole, setActiveRoleState] = useState(null);

  // Kiểm tra token khi app load
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    const savedActiveRole = localStorage.getItem('activeRole');
    
    if (accessToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // Restore activeRole từ localStorage
        if (savedActiveRole && parsedUser.roles?.includes(savedActiveRole)) {
          setActiveRoleState(savedActiveRole);
        } else if (parsedUser.roles?.length === 1) {
          // Nếu chỉ có 1 role, tự động set activeRole
          setActiveRoleState(parsedUser.roles[0]);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('activeRole');
      }
    }
    setLoading(false);
  }, []);

  // Set activeRole và lưu vào localStorage
  const setActiveRole = useCallback((role) => {
    if (user?.roles?.includes(role)) {
      setActiveRoleState(role);
      localStorage.setItem('activeRole', role);
    }
  }, [user]);

  // Clear activeRole
  const clearActiveRole = useCallback(() => {
    setActiveRoleState(null);
    localStorage.removeItem('activeRole');
  }, []);

  // Lấy label hiển thị của activeRole
  const getActiveRoleLabel = useCallback(() => {
    if (!activeRole) return '';
    return ROLE_LABELS[activeRole] || activeRole;
  }, [activeRole]);

  // Kiểm tra user có role admin và cần chọn role không
  const needsRoleSelection = useCallback(() => {
    if (!user?.roles) return false;
    // Tất cả admin đều cần chọn role trước khi vào dashboard
    return user.roles.includes(ROLES.ADMIN);
  }, [user]);

  // Đăng nhập
  const login = async (user_name, password) => {
    try {
      const response = await AuthService.login(user_name, password);

      if (response.success) {
        const { accessToken, refreshToken, user: userData } = response.data;
        const userRoles = userData?.roles || [];

        // Chặn student đăng nhập
        if (userRoles.includes(ROLES.STUDENT)) {
          return { 
            success: false, 
            error: 'Sinh viên không được phép đăng nhập vào hệ thống web!' 
          };
        }

        // Lưu vào localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        toast.success('Đăng nhập thành công!');
        return { success: true, data: userData };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      // Không hiển thị toast error, để LoginPage xử lý hiển thị text
      return { success: false, error: error.message };
    }
  };

  // Đăng ký
  const register = async (userData) => {
    try {
      // TODO: Implement register API when available
      toast.info('Chức năng đăng ký đang được phát triển');
      return { success: false, error: 'Not implemented yet' };
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.message || 'Đăng ký thất bại');
      return { success: false, error: error.message };
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Gọi API logout (optional - vẫn clear local nếu API fail)
      if (refreshToken) {
        try {
          await AuthService.logout(refreshToken);
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue to clear local storage even if API fails
        }
      }

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('activeRole');
      
      setUser(null);
      setIsAuthenticated(false);
      setActiveRoleState(null);
      
      toast.success('Đăng xuất thành công');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Đăng xuất thất bại');
    }
  };

  // Logout from all devices
  const logoutAll = async () => {
    try {
      await AuthService.logoutAll();
      
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('activeRole');
      
      setUser(null);
      setIsAuthenticated(false);
      setActiveRoleState(null);
      
      toast.success('Đã đăng xuất khỏi tất cả thiết bị');
    } catch (error) {
      console.error('Logout all error:', error);
      toast.error('Đăng xuất thất bại');
    }
  };

  // Update user profile
  const updateProfile = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await AuthService.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        toast.success('Đổi mật khẩu thành công');
        return { success: true };
      }
      
      return { success: false, error: 'Change password failed' };
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.message || 'Đổi mật khẩu thất bại');
      return { success: false, error: error.message };
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await AuthService.getCurrentUser();
      
      if (response.success) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, data: userData };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    activeRole,
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    changePassword,
    refreshUser,
    setActiveRole,
    clearActiveRole,
    getActiveRoleLabel,
    needsRoleSelection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};