import axiosClient from '@api/axiosClient';
import { TEACHER_ENDPOINTS } from '@constants/endpoints/teacher.endpoints';

/**
 * Teacher Service
 * Xử lý API calls cho giảng viên
 */

class TeacherService {
  /**
   * Get all teachers with filters and pagination
   * @param {Object} params - Query parameters
   * @param {string} params.search - Tìm theo mã giảng viên, họ tên, email
   * @param {string} params.department - Khoa/Viện
   * @param {string} params.code - Mã giảng viên cụ thể
   * @param {string} params.name - Tên giảng viên
   * @param {string} params.email - Email cụ thể
   * @param {string} params.phone - Số điện thoại
   * @param {number} params.page - Số trang
   * @param {number} params.limit - Số bản ghi/trang
   * @returns {Promise} List of teachers with pagination
   */
  async getAllTeachers(params = {}) {
    try {
      const response = await axiosClient.get(TEACHER_ENDPOINTS.BASE, { params });
      
      // API returns: { success, message, data: [...], pagination: {...} }
      return {
        success: response.success || true,
        data: Array.isArray(response.data) ? response.data : [],
        message: response.message || '',
        pagination: response.pagination || {
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Teacher Service Error:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Đã có lỗi xảy ra khi tải danh sách giảng viên',
        pagination: {
          total: 0,
          page: 1,
          limit: params.limit || 10,
          totalPages: 0
        }
      };
    }
  }

  /**
   * Get teacher by ID
   * @param {string} id - Teacher ID
   * @returns {Promise} Teacher detail data
   */
  async getTeacherById(id) {
    try {
      const response = await axiosClient.get(TEACHER_ENDPOINTS.BY_ID(id));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get teacher by teacher code
   * @param {string} teacherCode - Mã giảng viên
   * @returns {Promise} Teacher detail data
   */
  async getTeacherByCode(teacherCode) {
    try {
      const params = { code: teacherCode };
      const response = await axiosClient.get(TEACHER_ENDPOINTS.BASE, { params });
      
      // Return first match if found
      if (response.success && response.data && response.data.length > 0) {
        return {
          success: true,
          data: response.data[0],
          message: response.message || ''
        };
      }
      
      return {
        success: false,
        data: null,
        message: 'Không tìm thấy giảng viên'
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new teacher
   * @param {Object} data - Teacher data
   * @param {string} data.teacher_code - Mã giảng viên
   * @param {string} data.full_name - Họ tên
   * @param {string} data.email - Email
   * @param {string} data.dob - Ngày sinh (YYYY-MM-DD)
   * @param {string} data.department - Khoa/Viện
   * @param {string} data.phone - Số điện thoại
   * @param {string} data.avatar_url - URL ảnh đại diện
   * @param {string} data.office_hours - Giờ làm việc
   * @returns {Promise} Created teacher data
   */
  async createTeacher(data) {
    try {
      const response = await axiosClient.post(TEACHER_ENDPOINTS.BASE, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update teacher by ID
   * @param {string} id - Teacher ID
   * @param {Object} data - Updated teacher data
   * @returns {Promise} Updated teacher data
   */
  async updateTeacher(id, data) {
    try {
      const response = await axiosClient.put(TEACHER_ENDPOINTS.BY_ID(id), data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete teacher by ID
   * @param {string} id - Teacher ID
   * @returns {Promise} Delete confirmation
   */
  async deleteTeacher(id) {
    try {
      const response = await axiosClient.delete(TEACHER_ENDPOINTS.BY_ID(id));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get teacher schedules
   * @param {string} teacherCode - Mã giảng viên
   * @param {Object} params - Query parameters (semester, year, etc.)
   * @returns {Promise} Teacher schedules
   */
  async getTeacherSchedules(teacherCode, params = {}) {
    try {
      // This would need a specific endpoint in teacher.endpoints.js
      const response = await axiosClient.get(`${TEACHER_ENDPOINTS.BASE}/${teacherCode}/schedules`, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current teacher's schedule (authenticated teacher)
   * @param {Object} params - Query parameters (semester, date range, etc.)
   * @returns {Promise} Current teacher's schedules
   */
  async getMySchedule(params = {}) {
    try {
      const response = await axiosClient.get(TEACHER_ENDPOINTS.ME_SCHEDULE, { params });
      return {
        success: response.success || true,
        data: response.data?.schedules || [],
        message: response.message || ''
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get students in a class session
   * @param {string} classSessionId - Class session ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Students data with class session info
   */
  async getClassSessionStudents(classSessionId, params = {}) {
    try {
      const response = await axiosClient.get(
        TEACHER_ENDPOINTS.CLASS_SESSION_STUDENTS(classSessionId),
        { params }
      );
      return {
        success: response.success || true,
        data: response.data || {},
        message: response.message || ''
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search teachers by keyword
   * @param {string} keyword - Search keyword
   * @param {Object} params - Additional query parameters
   * @returns {Promise} List of matching teachers
   */
  async searchTeachers(keyword, params = {}) {
    try {
      const searchParams = {
        ...params,
        search: keyword
      };
      return await this.getAllTeachers(searchParams);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors from API
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
    const status = error.response?.status || 500;
    
    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.originalError = error;
    
    return formattedError;
  }
}

// Export singleton instance
const teacherService = new TeacherService();
export default teacherService;
