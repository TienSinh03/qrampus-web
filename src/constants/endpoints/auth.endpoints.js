import { API_VERSION } from '../config';

/**
 * Auth Endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_VERSION}/auth/login`,
  REFRESH: `${API_VERSION}/auth/refresh`,
  LOGOUT: `${API_VERSION}/auth/logout`,
  LOGOUT_ALL: `${API_VERSION}/auth/logout-all`,
  CURRENT_USER: `${API_VERSION}/auth/me`,
  CHANGE_PASSWORD: `${API_VERSION}/auth/change-password`,
};
