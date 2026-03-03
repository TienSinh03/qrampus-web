import axiosClient from '@api/axiosClient';
import { ROOM_ENDPOINTS } from '@constants/apiEndpoints';

/**
 * Room Service
 * Xử lý tất cả các API calls liên quan đến rooms
 */

class RoomService {
  /**
   * Get all rooms with pagination
   * @param {Object} params - Query parameters (page, limit, search, etc.)
   * @returns {Promise} List of rooms with pagination
   */
  async getRooms(params = {}) {
    try {
      const response = await axiosClient.get(ROOM_ENDPOINTS.BASE, { params });
      console.log("Room Service Response:", response); // Debug
      return response;
    } catch (error) {
      console.error("Room Service Error:", error);
      return {
        success: false,
        data: [],
        message: error.message || 'Đã có lỗi xảy ra',
        pagination: {
          total: 0,
          page: 1,
          limit: params.limit || 5,
          totalPages: 0
        }
      };
    }
  }

  /**
   * Get room by ID
   * @param {string} roomId - Room ID
   * @returns {Promise} Room data
   */
  async getRoomById(roomId) {
    try {
      const response = await axiosClient.get(ROOM_ENDPOINTS.BY_ID(roomId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new room
   * @param {Object} roomData - Room data
   * @returns {Promise} Created room
   */
  async createRoom(roomData) {
    try {
      const response = await axiosClient.post(ROOM_ENDPOINTS.BASE, roomData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update room
   * @param {string} roomId - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise} Updated room
   */
  async updateRoom(roomId, roomData) {
    try {
      const response = await axiosClient.put(ROOM_ENDPOINTS.BY_ID(roomId), roomData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete room
   * @param {string} roomId - Room ID
   * @returns {Promise} Success message
   */
  async deleteRoom(roomId) {
    try {
      const response = await axiosClient.delete(ROOM_ENDPOINTS.BY_ID(roomId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Toggle room active status
   * @param {string} roomId - Room ID
   * @returns {Promise} Updated room
   */
  async toggleRoomStatus(roomId) {
    try {
      const response = await axiosClient.patch(
        `${ROOM_ENDPOINTS.BY_ID(roomId)}/toggle-status`
      );
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Bulk create rooms from Excel upload
   * @param {Array} roomsList - Array of room data
   * @returns {Promise} Bulk create result with success and error counts
   */
  async bulkCreateRooms(roomsList) {
    try {
      const response = await axiosClient.post(ROOM_ENDPOINTS.BULK_CREATE, roomsList);
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
        404: 'Không tìm thấy dữ liệu',
        409: 'Dữ liệu đã tồn tại',
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
        errors: error.response.data?.errors || null,
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

export default new RoomService();
