import { API_VERSION } from '../config';

/**
 * Personnel Endpoints
 */
export const PERSONNEL_ENDPOINTS = {
  BASE: `${API_VERSION}/personnels`,
  BY_ID: (id) => `${API_VERSION}/personnels/${id}`,
  PROFILE: `${API_VERSION}/personnels/profile`,
  UPDATE_ME: `${API_VERSION}/personnels/me`,
};
