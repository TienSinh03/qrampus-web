import { API_VERSION } from '../config';

/**
 * Leave Request Endpoints
 */
export const LEAVE_REQUEST_ENDPOINTS = {
  BASE: `${API_VERSION}/leave-requests`,
  BY_ID: (id) => `${API_VERSION}/leave-requests/${id}`,
  MY_REQUESTS: `${API_VERSION}/leave-requests/my-requests`,
  APPROVE: (id) => `${API_VERSION}/leave-requests/${id}/approve`,
  REJECT: (id) => `${API_VERSION}/leave-requests/${id}/reject`,
};
