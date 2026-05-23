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
  async getSessionStats(sessionId, teacherId = null) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SESSION_STATS(sessionId), {
        params: { teacher_id: teacherId },
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy phiên điểm danh đang active theo class_session_id (đồng bộ cross-device)
   * @param {string} classSessionId
   */
  async getActiveSessionByClassSession(classSessionId) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SESSION_ACTIVE_BY_CLASS(classSessionId));
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
  async initializeAttendanceResults(payload, teacher_id = null) {
    try {
      const response = await axiosClient.post(ATTENDANCE_ENDPOINTS.RESULTS_INITIALIZE, payload, {
        params: { teacher_id: teacher_id },
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cập nhật một kết quả chốt điểm danh
   * @param {string} attendanceResultId
   * @param {Object} payload - { status, note? }
   * @param {string|null} teacherId
   * @returns {Promise}
   */
  async updateAttendanceResult(attendanceResultId, payload, teacherId = null) {
    try {
      const response = await axiosClient.patch(
        ATTENDANCE_ENDPOINTS.RESULTS_UPDATE(attendanceResultId),
        payload,
        {
          params: { teacher_id: teacherId },
        }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy danh sách image sessions của giảng viên đang đăng nhập (có phân trang)
   * { classSessionId?, courseSectionId?, page?, limit? }
   */
  async getImageSessionsByTeacher(params = {}) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.IMAGE_SESSIONS, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy danh sách ảnh trong 1 image session
   */
  async getAttendanceImagesBySession(imageSessionId) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.IMAGES_BY_SESSION(imageSessionId));
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
   * Lấy danh sách lịch dạy theo mã môn học cho bộ phận chấm công
   * Trả về đúng shape mà page hiện tại đang dùng: { data: sessions, meta: { pagination } }
   * @param {Object} params - { lecturer_id, course_code, page, limit }
   */
  async getLecturerAttendanceSessions(params = {}) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE, { params });
      return {
        data: response?.data?.sessions ?? [],
        meta: {
          pagination: response?.data?.pagination ?? { total: 0, page: 1, limit: 20, totalPages: 0 },
        },
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tổng hợp buổi chấm công theo mã môn học cho bộ phận chấm công
   * @param {Object} params - { course_code, from_date, to_date }
   */
  async getAttendanceWorkloadByCourseCode(params = {}) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE_WORKLOAD_BY_COURSE, { params });
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
   * Lấy danh sách kết quả nhận diện khuôn mặt trong một buổi học (dành cho giảng viên)
   * @param {string} classSessionId
   */
  async getFaceVerificationByAttendance(attendanceId) {
    try {
      const response = await axiosClient.get(
        ATTENDANCE_ENDPOINTS.FACE_VERIFY_BY_ATTENDANCE(attendanceId)
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFaceVerificationsByClassSession(classSessionId, teacherId = null) {
    try {
      const response = await axiosClient.get(
        ATTENDANCE_ENDPOINTS.FACE_VERIFY_BY_CLASS_SESSION(classSessionId),
        { params: { teacher_id: teacherId } }
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Điều chỉnh thủ công trạng thái chấm công giảng viên cho 1 buổi học (multipart)
   * @param {string} classSessionId
   * @param {Object} payload - {
   *   lecturer_attendance_status, lecturer_checkin_at?, late_minutes?, reason?,
   *   evidence?: File[]
   * }
   */
  async manualAdjustLecturerAttendance(classSessionId, payload) {
    try {
      const fd = new FormData();
      if (payload.lecturer_attendance_status) fd.append('lecturer_attendance_status', payload.lecturer_attendance_status);
      if (payload.lecturer_checkin_at)        fd.append('lecturer_checkin_at', payload.lecturer_checkin_at);
      if (payload.late_minutes !== undefined) fd.append('late_minutes', String(payload.late_minutes));
      if (payload.reason)                     fd.append('reason', payload.reason);
      if (Array.isArray(payload.evidence)) {
        for (const file of payload.evidence) {
          if (file instanceof File || file instanceof Blob) fd.append('evidence', file);
        }
      }

      const response = await axiosClient.patch(
        ATTENDANCE_ENDPOINTS.SCHEDULE_MANUAL_ADJUST(classSessionId),
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lấy lịch sử điều chỉnh thủ công của 1 buổi học
   * @param {string} classSessionId
   */
  async getAdjustmentHistory(classSessionId) {
    try {
      const response = await axiosClient.get(
        ATTENDANCE_ENDPOINTS.SCHEDULE_ADJUSTMENT_HISTORY(classSessionId),
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ───── Attendance Adjustment Requests (staff/admin) ─────

  /**
   * Staff/Admin lấy danh sách yêu cầu điều chỉnh chấm công (mặc định pending)
   * @param {Object} params - { status, course_code, teacher_name, from_date, to_date, page, limit }
   */
  async listAdjustmentRequests(params = {}) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.ADJUSTMENT_REQUESTS, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async countPendingAdjustmentRequests() {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.ADJUSTMENT_REQUESTS_COUNT_PENDING);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async approveAdjustmentRequest(requestId, reviewNote) {
    try {
      const response = await axiosClient.patch(
        ATTENDANCE_ENDPOINTS.ADJUSTMENT_REQUEST_APPROVE(requestId),
        { review_note: reviewNote },
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async rejectAdjustmentRequest(requestId, reviewNote) {
    try {
      const response = await axiosClient.patch(
        ATTENDANCE_ENDPOINTS.ADJUSTMENT_REQUEST_REJECT(requestId),
        { review_note: reviewNote },
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ───── Adjustment Requests (teacher self-service) ─────

  /**
   * GV gửi yêu cầu điều chỉnh chấm công (multipart)
   * @param {Object} payload - {
   *   class_session_id, requested_status, requested_checkin_at?, reason, evidence?: File[]
   * }
   */
  async createMyAdjustmentRequest(payload) {
    try {
      const fd = new FormData();
      if (payload.class_session_id)     fd.append('class_session_id', payload.class_session_id);
      if (payload.requested_status)     fd.append('requested_status', payload.requested_status);
      if (payload.requested_checkin_at) fd.append('requested_checkin_at', payload.requested_checkin_at);
      if (payload.reason)               fd.append('reason', payload.reason);
      if (Array.isArray(payload.evidence)) {
        for (const file of payload.evidence) {
          if (file instanceof File || file instanceof Blob) fd.append('evidence', file);
        }
      }
      const response = await axiosClient.post(
        ATTENDANCE_ENDPOINTS.ADJUSTMENT_REQUESTS,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * GV xem các request của chính mình
   * @param {Object} params - { status?, page?, limit? }
   */
  async getMyAdjustmentRequests(params = {}) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.ADJUSTMENT_REQUESTS_ME, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * GV huỷ request pending của mình
   */
  async cancelMyAdjustmentRequest(requestId) {
    try {
      const response = await axiosClient.patch(
        ATTENDANCE_ENDPOINTS.ADJUSTMENT_REQUEST_CANCEL(requestId),
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Thống kê chấm công GV cho BPCC
   * @param {Object} params - { semester, department, teacher_id, course_section_id, course_code, from_date, to_date, granularity }
   */
  async getAttendanceStatistics(params = {}) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE_STATISTICS, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStatsFilterSemesters() {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE_FILTER_SEMESTERS);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStatsFilterPersonnel(department) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE_FILTER_PERSONNEL, {
        params: department ? { department } : {},
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStatsFilterTeacherCourses(teacherId, semester) {
    try {
      const response = await axiosClient.get(ATTENDANCE_ENDPOINTS.SCHEDULE_FILTER_TEACHER_COURSES, {
        params: { teacher_id: teacherId, semester: semester || undefined },
      });
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
