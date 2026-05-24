import { API_VERSION } from '../config';

/**
 * Leave Request Endpoints
 */
export const LEAVE_REQUEST_ENDPOINTS = {
  BASE: `${API_VERSION}/leave-requests`,
  STUDENT_BASE: `${API_VERSION}/leave-requests/student`,
  TEACHER_BASE: `${API_VERSION}/leave-requests/teacher`,
  TEACHER_DASHBOARD: `${API_VERSION}/leave-requests/teacher/dashboard`,
  APPROVE: (id) => `${API_VERSION}/leave-requests/teacher/${id}/approve`,
  REJECT: (id) => `${API_VERSION}/leave-requests/teacher/${id}/reject`,
};
