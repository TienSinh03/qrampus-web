import axiosClient from '@api/axiosClient';
import { NOTIFICATION_ENDPOINTS } from '@constants/endpoints';

class NotificationService {
  async createNotification(payload) {
    try {
      const response = await axiosClient.post(NOTIFICATION_ENDPOINTS.BASE, payload);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createBulkByTargetType(payload) {
    try {
      const response = await axiosClient.post(NOTIFICATION_ENDPOINTS.BULK_TARGET_TYPE, payload);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotifications(params = {}) {
    try {
      const response = await axiosClient.get(NOTIFICATION_ENDPOINTS.BASE, { params });
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotificationById(notificationId) {
    try {
      const response = await axiosClient.get(NOTIFICATION_ENDPOINTS.DETAIL(notificationId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUnreadCount() {
    try {
      const response = await axiosClient.get(NOTIFICATION_ENDPOINTS.UNREAD_COUNT);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await axiosClient.post(NOTIFICATION_ENDPOINTS.MARK_READ(notificationId));
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async markAllAsRead() {
    try {
      const response = await axiosClient.post(NOTIFICATION_ENDPOINTS.MARK_ALL_READ);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 'Da xay ra loi tu server';
      const apiError = new Error(message);
      apiError.status = error.response.status;
      apiError.data = error.response.data;
      return apiError;
    }

    if (error.request) {
      return new Error('Khong the ket noi den server. Vui long kiem tra ket noi mang.');
    }

    return new Error(error.message || 'Da xay ra loi khong xac dinh');
  }
}

export default new NotificationService();
