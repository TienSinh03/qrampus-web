import axiosClient from '@api/axiosClient';
import { ATTENDANCE_ENDPOINTS } from '@constants/endpoints/attendance.endpoints';

/**
 * Attendance Service
 * Xử lý tất cả các API calls liên quan đến attendance sessions
 */
class AttendanceService {
  /**
   * Tạo phiên điểm danh mới
   * @param {Object} payload - { class_session_id, session_duration_minutes, qr_interval }
   * @returns {Promise} Created session data
   */
  async createAttendanceSession(payload) {
    try {
      const response = await axiosClient.post(ATTENDANCE_ENDPOINTS.SESSIONS, payload);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Đóng phiên điểm danh
   * @param {string} sessionId - Attendance session ID
   * @returns {Promise} Closed session data
   */
  async closeAttendanceSession(sessionId) {
    try {
      const response = await axiosClient.patch(ATTENDANCE_ENDPOINTS.SESSION_CLOSE(sessionId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tạo QR code mới khi QR cũ hết hạn
   * @param {string} sessionId - Attendance session ID
   * @returns {Promise} New QR data
   */
  async getNextQR(sessionId) {
    try {
      const response = await axiosClient.post(ATTENDANCE_ENDPOINTS.SESSION_NEXT_QR(sessionId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy thống kê phiên điểm danh
   * @param {string} sessionId - Attendance session ID
   * @returns {Promise} Session statistics
   */
  async getSessionStats(sessionId) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SESSION_STATS(sessionId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  /**
   * Handle API errors
   * @param {Error} error - Axios error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'Có lỗi xảy ra';
      const status = error.response.status;
      const errorDetails = error.response.data;
      
      return {
        message,
        status,
        details: errorDetails,
      };
    } else if (error.request) {
      return {
        message: 'Không thể kết nối đến server',
        status: 0,
      };
    } else {
      return {
        message: error.message || 'Có lỗi xảy ra',
        status: -1,
      };
    }
  }
}

export default new AttendanceService();
