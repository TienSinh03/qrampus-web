import { API_VERSION } from '../config';

/**
 * User Endpoints
 */
export const USER_ENDPOINTS = {
  BASE: `${API_VERSION}/users`,
  BY_ID: (id) => `${API_VERSION}/users/${id}`,
  PROFILE: `${API_VERSION}/users/profile`,
};
