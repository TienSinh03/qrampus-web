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

  async getCardAcount() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_ACCOUNT);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCardpersonnel() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_PERSONNEL);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCardStudent() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_STUDENT);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCardSurvey() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_SURVEY);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCardCourseSesction() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_COURSE_SESCTION);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCardschedules() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_SCHEDULES);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCardEnrollment() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_ENROLLMENT);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCardRoom() {
    try {
      return await axiosClient.get(REPORT_ENDPOINTS.CARD_ROOM);
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
