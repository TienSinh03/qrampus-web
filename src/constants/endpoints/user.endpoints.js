import { API_VERSION } from '../config';

/**
 * User Endpoints
 */
export const USER_ENDPOINTS = {
  BASE: `${API_VERSION}/users`,
  BY_ID: (id) => `${API_VERSION}/users/${id}`,
  PROFILE: `${API_VERSION}/users/profile`,
  ACTIVATE: (username) => `${API_VERSION}/admin/users/${username}/activate`,
  BULK_ACTIVATE: `${API_VERSION}/admin/users/bulk/activate`,
};
