import axiosClient from '@api/axiosClient';
import { REPORT_ENDPOINTS } from '@constants/endpoints';

class ReportService {
  async getDashboardStats() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.DASHBOARD_STATS);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    const message = error.response?.data?.message || error.message || 'Khong the tai thong ke dashboard';
    const formattedError = new Error(message);
    formattedError.status = error.response?.status || 500;
    formattedError.originalError = error;
    return formattedError;
  }
}

export default new ReportService();
