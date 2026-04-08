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
   * Get all personnels with filters
   * @param {Object} params - Query parameters
   * @param {string} params.search - Tìm theo mã số, họ tên, email, SĐT
   * @param {string} params.department - Khoa/Viện
   * @param {string} params.status - active/inactive
   * @param {string} params.role - teacher/attendance_staff/admin
   * @param {string} params.email - Email cụ thể
   * @param {string} params.phone - Số điện thoại cụ thể
   * @param {string} params.dob - Ngày sinh
   * @param {number} params.page - Số trang
   * @param {number} params.limit - Số bản ghi/trang
   * @returns {Promise} List of personnels with pagination
   */
  async getAllPersonnels(params = {}) {
    try {
      const response = await axiosClient.get(PERSONNEL_ENDPOINTS.GET_ALL, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all teachers only
   * @param {Object} params - Query parameters (same as getAllPersonnels but without role filter)
   * @returns {Promise} List of teachers with pagination
   */
  async getAllTeachers(params = {}) {
    try {
      const response = await axiosClient.get(PERSONNEL_ENDPOINTS.GET_TEACHERS, { params });
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
      const response = await axiosClient.get(PERSONNEL_ENDPOINTS.GET_TEACHER_BY_CODE(teacherCode));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new personnel
   * @param {Object} data - Personnel data
   * @param {string} data.code - Mã nhân sự
   * @param {string} data.full_name - Họ tên
   * @param {string} data.email - Email
   * @param {string} data.dob - Ngày sinh (YYYY-MM-DD)
   * @param {string} data.department - Khoa/Viện
   * @param {string} data.phone - Số điện thoại
   * @param {string} data.avatar_url - URL ảnh đại diện
   * @param {string} data.role - Role (teacher/admin/attendance_staff)
   * @returns {Promise} Created personnel data
   */
  async createPersonnel(data) {
    try {
      const response = await axiosClient.post(PERSONNEL_ENDPOINTS.BASE, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk create personnels
   * @param {Array<Object>} personnelList - Array of personnel data
   * @returns {Promise} Result with success/fail counts and details
   */
  async bulkCreatePersonnel(personnelList) {
    try {
      const response = await axiosClient.post(PERSONNEL_ENDPOINTS.BULK_CREATE, personnelList);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update personnel by Admin
   * @param {string} teacherCode - Mã nhân sự
   * @param {Object} data - Update data
   * @param {string} data.full_name - Họ tên
   * @param {string} data.email - Email
   * @param {string} data.phone - Số điện thoại
   * @param {string} data.dob - Ngày sinh
   * @param {string} data.department - Khoa/Viện
   * @param {string} data.office_hours - Giờ làm việc
   * @param {string} data.avatar_url - Avatar URL
   * @param {Array<string>} data.roles - Mảng roles
   * @returns {Promise} Updated personnel data
   */
  async updatePersonnelByAdmin(teacherCode, data) {
    try {
      const response = await axiosClient.put(PERSONNEL_ENDPOINTS.UPDATE_BY_ADMIN(teacherCode), data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Upload/replace personnel avatar by Admin
   * @param {string} teacherCode - Mã nhân sự
   * @param {File} avatarFile - Image file
   * @returns {Promise} Updated avatar data
   */
  async uploadPersonnelAvatarByAdmin(teacherCode, avatarFile) {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await axiosClient.put(
        PERSONNEL_ENDPOINTS.UPDATE_AVATAR_BY_ADMIN(teacherCode),
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
