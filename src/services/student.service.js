import axiosClient from '@api/axiosClient';
import { STUDENT_ENDPOINTS } from '@constants/apiEndpoints';

/**
 * Student Service
 * Xử lý tất cả các API calls liên quan đến students
 */

class StudentService {
  /**
   * Get all students
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} List of students
   */
  async getAllStudents(params = {}) {
    try {
      const response = await axiosClient.get(STUDENT_ENDPOINTS.BASE, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get student by ID
   * @param {string} studentId - Student ID
   * @returns {Promise} Student data
   */
  async getStudentById(studentId) {
    try {
      const response = await axiosClient.get(STUDENT_ENDPOINTS.BY_ID(studentId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get student by student code
   * GET /api/v1/students/code/:code
   * @param {string} studentCode - Student code (e.g. 21210001)
   * @returns {Promise} Full student data including user & roles
   */
  async getStudentByCode(studentCode) {
    try {
      const response = await axiosClient.get(STUDENT_ENDPOINTS.BY_CODE(studentCode));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new student
   * @param {Object} studentData - Student data
   * @returns {Promise} Created student
   */
  async createStudent(studentData) {
    try {
      const response = await axiosClient.post(STUDENT_ENDPOINTS.BASE, studentData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update student (self)
   * @param {string} studentId - Student ID
   * @param {Object} studentData - Updated student data
   * @returns {Promise} Updated student
   */
  async updateStudent(studentId, studentData) {
    try {
      const response = await axiosClient.put(STUDENT_ENDPOINTS.BY_ID(studentId), studentData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update student by Admin (all fields incl. email, dob, device_id)
   * PUT /api/v1/students/:code
   * @param {string} studentCode - Student code (e.g. 21210001)
   * @param {Object} studentData - Fields to update
   * @returns {Promise} Updated student
   */
  async updateStudentByAdmin(studentCode, studentData) {
    try {
      const response = await axiosClient.put(STUDENT_ENDPOINTS.BY_ID(studentCode), studentData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk create students from Excel upload
   * POST /api/v1/students/bulk
   * @param {Array} studentsList - Array of student objects
   * @returns {Promise} Bulk creation result with successCount, failCount, errors
   */
  async bulkCreateStudents(studentsList) {
    try {
      const response = await axiosClient.post(STUDENT_ENDPOINTS.BULK, studentsList);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete student
   * @param {string} studentId - Student ID
   * @returns {Promise} Deletion result
   */
  async deleteStudent(studentId) {
    try {
      const response = await axiosClient.delete(STUDENT_ENDPOINTS.BY_ID(studentId));
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

export default new StudentService();
