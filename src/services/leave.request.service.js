import axiosClient from '@api/axiosClient';
import { LEAVE_REQUEST_ENDPOINTS } from '@constants/endpoints/leave-request.endpoints';

class LeaveRequestService {
  async getTeacherLeaveDashboard() {
    try {
      const response = await axiosClient.get(LEAVE_REQUEST_ENDPOINTS.TEACHER_DASHBOARD);

      return {
        success: response.success || true,
        data: response.data || {},
        message: response.message || '',
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra';
    const status = error.response?.status || 500;

    const formattedError = new Error(message);
    formattedError.status = status;
    formattedError.originalError = error;

    return formattedError;
  }
}

const leaveRequestService = new LeaveRequestService();
export default leaveRequestService;
