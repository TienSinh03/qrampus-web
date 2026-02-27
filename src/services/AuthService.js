import axiosClient from '@api/axiosClient';
import { AUTH_ENDPOINTS } from '@constants/apiEndpoints';

/**
 * Authentication Service
 * Xử lý tất cả các API calls liên quan đến authentication
 */

class AuthService {
  /**
   * Login user
   * @param {string} user_name - Username
   * @param {string} password - Password
   * @param {string} device_info - Device information (optional)
   * @returns {Promise} API response
   */
  async login(user_name, password, device_info = 'web-browser') {
    try {
      const response = await axiosClient.post(AUTH_ENDPOINTS.LOGIN, {
        user_name,
        password,
        device_info,
      });
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} API response with new access token
   */
  async refreshToken(refreshToken) {
    try {
      const response = await axiosClient.post(AUTH_ENDPOINTS.REFRESH, {
        refresh_token: refreshToken,
      });
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   * @param {string} refreshToken - Refresh token (optional)
   * @returns {Promise} API response
   */
  async logout(refreshToken = null) {
    try {
      const payload = refreshToken ? { refresh_token: refreshToken } : {};
      const response = await axiosClient.post(AUTH_ENDPOINTS.LOGOUT, payload);
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout from all devices
   * @returns {Promise} API response
   */
  async logoutAll() {
    try {
      const response = await axiosClient.post(AUTH_ENDPOINTS.LOGOUT_ALL);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user info
   * @returns {Promise} API response with user data
   */
  async getCurrentUser() {
    try {
      const response = await axiosClient.get(AUTH_ENDPOINTS.CURRENT_USER);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} API response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axiosClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format API errors
   * @param {Error} error - Error object from axios
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Đã xảy ra lỗi từ server';
      const apiError = new Error(message);
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      return apiError;
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Something else happened
      return new Error(error.message || 'Đã xảy ra lỗi không xác định');
    }
  }
}

// Export singleton instance
export default new AuthService();
