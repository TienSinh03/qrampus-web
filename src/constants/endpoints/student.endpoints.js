import { API_VERSION } from '../config';

/**
 * Student Endpoints
 */
export const STUDENT_ENDPOINTS = {
  BASE: `${API_VERSION}/students`,
  BY_ID: (id) => `${API_VERSION}/students/${id}`,
  BY_CODE: (code) => `${API_VERSION}/students/code/${code}`,
};
