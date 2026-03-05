import axiosClient from '@api/axiosClient';
import { COURSE_ENDPOINTS } from '@constants/endpoints/course.endpoints';

/**
 * Course Service
 * Xử lý tất cả các API calls liên quan đến course sections
 */

class CourseService {
  /**
   * Get all course sections with pagination and filters
   * @param {Object} params - Query parameters (page, limit, search, semester, etc.)
   * @returns {Promise} List of course sections with pagination
   */
  async getCourseSections(params = {}) {
    try {
      const response = await axiosClient.get(COURSE_ENDPOINTS.SECTIONS, { params });
      console.log("Course Service Response:", response); // Debug
      
      // API returns: { success, message, data: { courses: [...], pagination: {...} } }
      // Extract courses array and pagination from nested data object
      const coursesArray = response.data?.courses || response.data || [];
      const paginationData = response.data?.pagination || null;
      
      return {
        success: response.success || true,
        data: Array.isArray(coursesArray) ? coursesArray : [],
        message: response.message || '',
        pagination: paginationData || {
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error("Course Service Error:", error);
      return {
        success: false,
        data: [],
        message: error.message || 'Đã có lỗi xảy ra',
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
   * Get all course sections as rows (1 LT + N TH per course)
   * @param {Object} params - Query parameters (page, limit, semester, year, name, code)
   * @returns {Promise} List of rows with pagination
   */
  async getCourseSectionRows(params = {}) {
    try {
      const response = await axiosClient.get(COURSE_ENDPOINTS.SECTIONS_ROWS, { params });
      console.log("Course Rows Service Response:", response);
      
      // API returns: { success, message, data: { rows: [...], pagination: {...} } }
      const rowsArray = response.data?.rows || response.data || [];
      const paginationData = response.data?.pagination || null;
      
      return {
        success: response.success || true,
        data: Array.isArray(rowsArray) ? rowsArray : [],
        message: response.message || '',
        pagination: paginationData || {
          total: 0,
          page: params.page || 1,
          limit: params.limit || 5,
          totalPages: 0,
          totalRows: 0
        }
      };
    } catch (error) {
      console.error("Course Rows Service Error:", error);
      return {
        success: false,
        data: [],
        message: error.message || 'Đã có lỗi xảy ra',
        pagination: {
          total: 0,
          page: 1,
          limit: params.limit || 5,
          totalPages: 0,
          totalRows: 0
        }
      };
    }
  }

  /**
   * Get course section by ID
   * @param {string} courseSectionId - Course section ID (UUID)
   * @returns {Promise} Course section data with practice groups
   */
  async getCourseSectionById(courseSectionId) {
    try {
      const response = await axiosClient.get(COURSE_ENDPOINTS.SECTION_BY_ID(courseSectionId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get course section by code
   * @param {string} code - Course section code (e.g. INT3104)
   * @returns {Promise} Course section data
   */
  async getCourseSectionByCode(code) {
    try {
      const response = await axiosClient.get(COURSE_ENDPOINTS.SECTIONS, {
        params: { code }
      });
      // Return first match if found
      if (response.data?.data && response.data.data.length > 0) {
        return {
          ...response,
          data: response.data.data[0]
        };
      }
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new course section
   * @param {Object} courseSectionData - Course section data
   * @returns {Promise} Created course section
   */
  async createCourseSection(courseSectionData) {
    try {
      const response = await axiosClient.post(COURSE_ENDPOINTS.SECTIONS, courseSectionData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update course section
   * @param {string} courseSectionId - Course section ID
   * @param {Object} courseSectionData - Updated course section data
   * @returns {Promise} Updated course section
   */
  async updateCourseSection(courseSectionId, courseSectionData) {
    try {
      const response = await axiosClient.put(
        COURSE_ENDPOINTS.SECTION_BY_ID(courseSectionId), 
        courseSectionData
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete course section
   * @param {string} courseSectionId - Course section ID
   * @returns {Promise} Delete result
   */
  async deleteCourseSection(courseSectionId) {
    try {
      const response = await axiosClient.delete(COURSE_ENDPOINTS.SECTION_BY_ID(courseSectionId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk create course sections from Excel upload
   * @param {Array} courseSectionsList - Array of course section data
   * @returns {Promise} Bulk create result with success and error counts
   */
  async bulkCreateCourseSections(courseSectionsList) {
    try {
      // Wrap array in object with courseSections key as API expects
      const payload = {
        courseSections: courseSectionsList
      };
      
      console.log('Sending bulk create request with data:', payload);
      console.log('Endpoint:', `${COURSE_ENDPOINTS.SECTIONS}/bulk`);
      
      const response = await axiosClient.post(
        `${COURSE_ENDPOINTS.SECTIONS}/bulk`, 
        payload
      );
      
      console.log('Bulk create response:', response);
      return response;
    } catch (error) {
      console.error('Bulk create error:', error);
      console.error('Error response:', error.response?.data);
      throw this.handleError(error);
    }
  }

  /**
   * Get practice groups for a course section
   * @param {string} courseSectionId - Course section ID
   * @returns {Promise} List of practice groups
   */
  async getPracticeGroups(courseSectionId) {
    try {
      const response = await axiosClient.get(
        `${COURSE_ENDPOINTS.SECTION_BY_ID(courseSectionId)}/practice-groups`
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get course sections by semester
   * @param {string} semester - Semester (e.g. "2024-1")
   * @returns {Promise} List of course sections
   */
  async getCourseSectionsBySemester(semester) {
    try {
      const response = await axiosClient.get(COURSE_ENDPOINTS.SECTIONS, {
        params: { semester }
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search course sections
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters (semester, year, etc.)
   * @returns {Promise} List of matching course sections
   */
  async searchCourseSections(query, filters = {}) {
    try {
      const response = await axiosClient.get(COURSE_ENDPOINTS.SECTIONS, {
        params: {
          search: query,
          ...filters
        }
      });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Error handler
   * @param {Object} error - Error object
   * @returns {Object} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      let message = error.response.data?.message || 'Đã có lỗi xảy ra';
      
      // Map common HTTP errors to Vietnamese
      const errorMessages = {
        400: 'Dữ liệu không hợp lệ',
        401: 'Chưa xác thực, vui lòng đăng nhập lại',
        403: 'Không có quyền truy cập',
        404: 'Không tìm thấy học phần',
        409: 'Mã học phần đã tồn tại',
        422: 'Dữ liệu không đúng định dạng',
        500: 'Lỗi hệ thống, vui lòng thử lại sau',
        502: 'Lỗi kết nối server',
        503: 'Dịch vụ tạm thời không khả dụng',
      };
      
      // Use mapped message if available and original message is generic
      if (errorMessages[status] && 
          (message === 'Internal Server Error' || 
           message === 'Bad Request' || 
           message === 'Not Found' ||
           message === 'Conflict' ||
           message === 'Unprocessable Entity')) {
        message = errorMessages[status];
      }
      
      return {
        success: false,
        message: message,
        status: status,
        data: error.response.data?.data || null,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        success: false,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || 'Đã có lỗi xảy ra',
        status: 0,
      };
    }
  }
}

export default new CourseService();
