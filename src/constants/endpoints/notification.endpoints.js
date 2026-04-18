import { API_VERSION } from '../config';

/**
 * Notification Endpoints
 */
export const NOTIFICATION_ENDPOINTS = {
  BASE: `${API_VERSION}/notifications`,
  BULK_TARGET_TYPE: `${API_VERSION}/notifications/bulk-target-type`,
  UNREAD_COUNT: `${API_VERSION}/notifications/unread-count`,
  MARK_READ: (id) => `${API_VERSION}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_VERSION}/notifications/read-all`,
  REGISTER_TOKEN: `${API_VERSION}/notifications/register-token`,
  UNREGISTER_TOKEN: `${API_VERSION}/notifications/unregister-token`,
};
