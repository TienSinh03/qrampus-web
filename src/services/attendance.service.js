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
   * Lấy lịch sử các phiên điểm danh theo học phần/nhóm thực hành
   */
  async getSessionHistory(params) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SESSION_HISTORY, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy dashboard thống kê chấm công của giảng viên đăng nhập
   * @param {Object} params - { semester?, from_date?, to_date? }
   */
  async getTeacherAttendanceDashboard(params) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.TEACHER_DASHBOARD, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy danh sách buổi chấm công theo học phần cho modal chi tiết dashboard giảng viên
   * @param {string} courseId
   * @param {Object} params - { semester?, month?, practice_group_id?, from_date?, to_date? }
   */
  async getTeacherCourseSessions(courseId, params) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.TEACHER_COURSE_SESSIONS(courseId), { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy tiến độ điểm danh của 1 sinh viên trong 1 học phần cụ thể (cho giảng viên)
   */
  async getStudentAttendanceHistory(studentId, params) {
    try {
      const response = await axiosClient.get(
        ATTENDANCE_ENDPOINTS.STUDENT_ATTENDANCE_HISTORY(studentId),
        { params }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Khởi tạo/làm mới kết quả chốt điểm danh theo buổi học
   * @param {Object} payload - { class_session_id, attendance_session_id?, overwrite_non_finalized? }
   * @returns {Promise} Attendance results initialize response
   */
  async initializeAttendanceResults(payload) {
    try {
      const response = await axiosClient.post(ATTENDANCE_ENDPOINTS.RESULTS_INITIALIZE, payload);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tổng hợp điểm danh theo ngày cho admin
   * @param {string} fromDate - YYYY-MM-DD
   * @param {string} toDate   - YYYY-MM-DD
   */
  async getAdminAttendanceSummary(fromDate, toDate) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.ADMIN_SUMMARY, {
        params: { from_date: fromDate, to_date: toDate },
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy danh sách lịch dạy cho bộ phận chấm công
   * @param {Object} params - { course_code, course_name, teacher_code, teacher_name, room,
   *   day_of_week, schedule_type, status, from_date, to_date, semester, page, limit }
   */
  async getAttendanceSchedule(params = {}) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Kết quả chấm công của giảng viên đang đăng nhập theo khoảng ngày
   * @param {string} fromDate - YYYY-MM-DD
   * @param {string} toDate   - YYYY-MM-DD
   * Response: { overview: { total_sessions, total_created, total_not_created, week_sessions },
   *             data: [{ date, day_of_week, total, created, not_created, sessions[] }] }
   */
  async getTeacherAttendanceWorkload(fromDate, toDate) {
    try {
      const params = {};
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.TEACHER_WORKLOAD, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Thống kê nhanh số buổi hôm nay đã/chưa tạo phiên điểm danh
   */
  async getScheduleTodayStats() {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE_TODAY_STATS);
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
