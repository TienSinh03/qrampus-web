import { API_VERSION } from '../config';

/**
 * Schedule Endpoints
 */
export const SCHEDULE_ENDPOINTS = {
  BASE: `${API_VERSION}/schedules`,
  BY_ID: (id) => `${API_VERSION}/schedules/${id}`,
  TEACHER: (teacherId) => `${API_VERSION}/schedules/teacher/${teacherId}`,
  STUDENT: (studentId) => `${API_VERSION}/schedules/student/${studentId}`,
  TEMPLATES: `${API_VERSION}/schedules/templates`,
  CHECK_AVAILABILITY: `${API_VERSION}/schedules/check-availability`,
};
