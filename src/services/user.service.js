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
   * Upload avatar for current authenticated user (student/personnel)
   * @param {File} avatarFile - Image file
   * @returns {Promise}
   */
  async uploadMyAvatar(avatarFile) {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await axiosClient.put(
        USER_ENDPOINTS.MY_AVATAR,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

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
   * Admin: get paginated account list (students + personnel) with roles
   * @param {Object} params - { page, limit, search, status, type }
   */
  async getAdminUsers(params = {}) {
    try {
      const response = await axiosClient.get(USER_ENDPOINTS.ADMIN_USERS, { params });
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
   * Toggle user lock status (lock/unlock)
   * @param {string} username - Username
   * @returns {Promise} Updated user data
   */
  async toggleUserLock(username) {
    try {
      const response = await axiosClient.put(USER_ENDPOINTS.LOCK(username));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Toggle user status (active/inactive)
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
   * Bulk toggle user lock status (lock/unlock)
   * @param {Array<string>} usernames - Array of usernames
   * @returns {Promise} Results with success/failure info
   */
  async bulkToggleUserLock(usernames) {
    try {
      const settled = await Promise.allSettled(
        usernames.map((username) => this.toggleUserLock(username))
      );

      const results = settled.map((item, index) => {
        if (item.status === 'fulfilled') {
          return {
            success: true,
            user_name: usernames[index],
            status: item.value?.data?.status,
          };
        }

        return {
          success: false,
          user_name: usernames[index],
          error: item.reason?.message || 'Unknown error',
        };
      });

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.length - successCount;

      return {
        success: true,
        data: {
          successCount,
          failCount,
          results,
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk toggle user status (active/inactive)
   * @param {Array<string>} usernames - Array of usernames
   * @returns {Promise} Results with success/failure info
   */
  async bulkToggleUserStatus(usernames) {
    try {
      const response = await axiosClient.put(USER_ENDPOINTS.BULK_ACTIVATE, {
        user_names: usernames,
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset password for a single user
   * @param {string} userId - User ID
   * @param {string} password - New password (optional, defaults to 12345678)
   * @returns {Promise} Reset result
   */
  async resetPassword(userId, password) {
    try {
      const response = await axiosClient.post(USER_ENDPOINTS.RESET_PASSWORD(userId), {
        password
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk reset password for multiple users
   * @param {Array<string>} userIds - Array of user IDs
   * @param {string} password - New password (optional, defaults to 12345678)
   * @returns {Promise} Results with success/failure info
   */
  async bulkResetPassword(userIds, password) {
    try {
      const response = await axiosClient.post(USER_ENDPOINTS.BULK_RESET_PASSWORD, {
        user_ids: userIds,
        password
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
