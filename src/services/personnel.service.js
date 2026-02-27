import axiosClient from '@api/axiosClient';
import { PERSONNEL_ENDPOINTS } from '@constants/endpoints';

/**
 * Personnel Service
 * Xử lý API calls cho personnel (giảng viên, admin, nhân viên chấm công)
 */

class PersonnelService {
  /**
   * Get personnel profile của user hiện tại
   * @returns {Promise} Personnel profile data
   */
  async getProfile() {
    try {
      const response = await axiosClient.get(PERSONNEL_ENDPOINTS.PROFILE);
      return response; // axiosClient interceptor đã return response.data
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update personnel profile
   * @param {Object} data - Profile data to update
   * @returns {Promise} Updated profile
   */
  async updateProfile(data) {
    try {
      const response = await axiosClient.put(PERSONNEL_ENDPOINTS.UPDATE_ME, data);
      return response; // axiosClient interceptor đã return response.data
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
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

export default new PersonnelService();
