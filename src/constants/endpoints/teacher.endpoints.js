import { API_VERSION } from '../config';

/**
 * Teacher Endpoints
 */
export const TEACHER_ENDPOINTS = {
  BASE: `${API_VERSION}/teachers`,
  BY_ID: (id) => `${API_VERSION}/teachers/${id}`,
  ME_SCHEDULE: `${API_VERSION}/teachers/me/schedule`,
};
