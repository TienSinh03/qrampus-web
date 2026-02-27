import axiosClient from '@api/axiosClient';
import { SCHEDULE_ENDPOINTS } from '@constants/apiEndpoints';

/**
 * Schedule Service
 * Xử lý tất cả các API calls liên quan đến schedules
 */

class ScheduleService {
  /**
   * Get all schedules
   * @param {Object} params - Query parameters (page, limit, date, etc.)
   * @returns {Promise} List of schedules
   */
  async getAllSchedules(params = {}) {
    try {
      const response = await axiosClient.get(SCHEDULE_ENDPOINTS.BASE, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get schedule by ID
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} Schedule data
   */
  async getScheduleById(scheduleId) {
    try {
      const response = await axiosClient.get(SCHEDULE_ENDPOINTS.BY_ID(scheduleId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get teacher schedules
   * @param {string} teacherId - Teacher ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Teacher's schedules
   */
  async getTeacherSchedules(teacherId, params = {}) {
    try {
      const response = await axiosClient.get(
        SCHEDULE_ENDPOINTS.TEACHER(teacherId),
        { params }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get student schedules
   * @param {string} studentId - Student ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Student's schedules
   */
  async getStudentSchedules(studentId, params = {}) {
    try {
      const response = await axiosClient.get(
        SCHEDULE_ENDPOINTS.STUDENT(studentId),
        { params }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new schedule
   * @param {Object} scheduleData - Schedule data
   * @returns {Promise} Created schedule
   */
  async createSchedule(scheduleData) {
    try {
      const response = await axiosClient.post(SCHEDULE_ENDPOINTS.BASE, scheduleData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} scheduleData - Updated schedule data
   * @returns {Promise} Updated schedule
   */
  async updateSchedule(scheduleId, scheduleData) {
    try {
      const response = await axiosClient.put(
        SCHEDULE_ENDPOINTS.BY_ID(scheduleId),
        scheduleData
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete schedule
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise} Deletion result
   */
  async deleteSchedule(scheduleId) {
    try {
      const response = await axiosClient.delete(SCHEDULE_ENDPOINTS.BY_ID(scheduleId));
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

export default new ScheduleService();
