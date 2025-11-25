import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kiểm tra token khi app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Đăng nhập
  const login = async (email, password) => {
    try {
      // Gọi API đăng nhập (giả lập)
      const response = {
        token: 'fake-jwt-token-' + Date.now(),
        user: {
          id: 1,
          email: email,
          name: 'Nguyễn Văn A',
          avatar: null,
          role: 'student'
        }
      };

      // Lưu vào localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Đăng ký
  const register = async (userData) => {
    try {
      // Gọi API đăng ký (giả lập)
      const response = {
        message: 'Đăng ký thành công',
        user: {
          id: Date.now(),
          ...userData
        }
      };

      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
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