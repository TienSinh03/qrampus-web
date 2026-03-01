import axiosClient from '@api/axiosClient';
import { USER_ENDPOINTS } from '@constants/apiEndpoints';

/**
 * User Service
 * Xử lý tất cả các API calls liên quan đến users
 */

class UserService {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  async getProfile() {
    try {
      const response = await axiosClient.get(USER_ENDPOINTS.PROFILE);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} data - Profile data to update
   * @returns {Promise} Updated profile
   */
  async updateProfile(data) {
    try {
      const response = await axiosClient.put(USER_ENDPOINTS.PROFILE, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise} User data
   */
  async getUserById(userId) {
    try {
      const response = await axiosClient.get(USER_ENDPOINTS.BY_ID(userId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all users
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} List of users
   */
  async getAllUsers(params = {}) {
    try {
      const response = await axiosClient.get(USER_ENDPOINTS.BASE, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise} Created user
   */
  async createUser(userData) {
    try {
      const response = await axiosClient.post(USER_ENDPOINTS.BASE, userData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} Updated user
   */
  async updateUser(userId, userData) {
    try {
      const response = await axiosClient.put(USER_ENDPOINTS.BY_ID(userId), userData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise} Deletion result
   */
  async deleteUser(userId) {
    try {
      const response = await axiosClient.delete(USER_ENDPOINTS.BY_ID(userId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Toggle user status (activate/deactivate)
   * @param {string} username - Username
   * @returns {Promise} Updated user data
   */
  async toggleUserStatus(username) {
    try {
      const response = await axiosClient.put(USER_ENDPOINTS.ACTIVATE(username));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk toggle user status (activate/deactivate)
   * @param {Array<string>} usernames - Array of usernames
   * @returns {Promise} Results with success/failure info
   */
  async bulkToggleUserStatus(usernames) {
    try {
      const response = await axiosClient.put(USER_ENDPOINTS.BULK_ACTIVATE, {
        user_names: usernames
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
      const message = error.response.data?.message || 'Đã xảy ra lỗi từ server';
      const apiError = new Error(message);
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      return apiError;
    } else if (error.request) {
      return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      return new Error(error.message || 'Đã xảy ra lỗi không xác định');
    }
  }
}

export default new UserService();
