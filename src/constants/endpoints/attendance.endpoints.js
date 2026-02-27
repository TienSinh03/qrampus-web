import { API_VERSION } from '../config';

/**
 * Attendance Endpoints
 */
export const ATTENDANCE_ENDPOINTS = {
  IMAGES: `${API_VERSION}/attendance-images`,
  IMAGE_BY_ID: (id) => `${API_VERSION}/attendance-images/${id}`,
  IMAGE_SESSIONS: `${API_VERSION}/image-sessions`,
  IMAGE_SESSION_BY_ID: (id) => `${API_VERSION}/image-sessions/${id}`,
};
