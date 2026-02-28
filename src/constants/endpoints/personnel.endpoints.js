import { API_VERSION } from '../config';

/**
 * Personnel Endpoints
 */
export const PERSONNEL_ENDPOINTS = {
  BASE: `${API_VERSION}/personnels`,
  GET_ALL: `${API_VERSION}/personnels`,
  GET_TEACHERS: `${API_VERSION}/personnels/teachers`,
  BY_ID: (id) => `${API_VERSION}/personnels/${id}`,
  PROFILE: `${API_VERSION}/personnels/profile`,
  UPDATE_ME: `${API_VERSION}/personnels/me`,
  SCHEDULES: (personnelCode) => `${API_VERSION}/personnels/${personnelCode}/schedules`,
  BULK_CREATE: `${API_VERSION}/personnels/bulk`,
};
