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
   * Create schedule template
   * @param {Object} templateData - Template data
   * @param {string} templateData.course_section_id - Course section ID
   * @param {string} templateData.personnel_id - Personnel/Teacher ID
   * @param {string} [templateData.practice_group_id] - Practice group ID (optional)
   * @param {string} templateData.schedule_type - 'LT' or 'TH'
   * @param {string} templateData.day_of_week - Day of week (Thứ 2, Thứ 3, etc.)
   * @param {string} templateData.start_hour - Start hour (e.g., "6h30")
   * @param {string} templateData.end_hour - End hour (e.g., "7h20")
   * @param {string} templateData.start_date - Start date (YYYY-MM-DD)
   * @param {string} templateData.end_date - End date (YYYY-MM-DD)
   * @param {string} templateData.room_id - Room ID
   * @param {boolean} [templateData.is_active] - Active status (default: true)
   * @returns {Promise} Created schedule template
   */
  async createScheduleTemplate(templateData) {
    try {
      const response = await axiosClient.post(SCHEDULE_ENDPOINTS.TEMPLATES, templateData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Check schedule availability for a teacher
   * @param {Object} checkData - Check data
   * @param {string} checkData.personnel_id - Personnel/Teacher ID
   * @param {string} checkData.class_date - Class date
   * @param {string} checkData.start_hour - Start hour
   * @param {string} checkData.end_hour - End hour
   * @param {string} checkData.session_number - Session number
   * @param {string} checkData.schedule_type - Schedule type
   * @param {string} [checkData.exclude_schedule_id] - Schedule ID to exclude
   * @returns {Promise} Availability result
   */
  async checkScheduleAvailability(checkData) {
    try {
      const response = await axiosClient.post(SCHEDULE_ENDPOINTS.CHECK_AVAILABILITY, checkData);
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
