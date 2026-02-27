import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '@services/AuthService';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra token khi app load
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (accessToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Đăng nhập
  const login = async (user_name, password) => {
    try {
      const response = await AuthService.login(user_name, password);

      if (response.success) {
        const { accessToken, refreshToken, user: userData } = response.data;

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
      
      setUser(null);
      setIsAuthenticated(false);
      
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
      
      setUser(null);
      setIsAuthenticated(false);
      
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
    login,
    register,
    logout,
    logoutAll,
    updateProfile,
    changePassword,
    refreshUser,
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