import { API_VERSION } from '../config';

/**
 * Attendance Endpoints
 */
export const ATTENDANCE_ENDPOINTS = {
  // Legacy endpoints (deprecated)
  IMAGES: `${API_VERSION}/attendance-images`,
  IMAGE_BY_ID: (id) => `${API_VERSION}/attendance-images/${id}`,
  IMAGE_SESSIONS: `${API_VERSION}/image-sessions`,
  IMAGE_SESSION_BY_ID: (id) => `${API_VERSION}/image-sessions/${id}`,

  // New attendance session endpoints
  SESSIONS: `${API_VERSION}/attendance-sessions`,
  SESSION_BY_ID: (id) => `${API_VERSION}/attendance-sessions/${id}`,
  SESSION_CLOSE: (id) => `${API_VERSION}/attendance-sessions/${id}/close`,
  SESSION_NEXT_QR: (id) => `${API_VERSION}/attendance-sessions/${id}/next-qr`,
  SESSION_STATS: (id) => `${API_VERSION}/attendance-sessions/${id}/stats`,
  SESSION_HISTORY: `${API_VERSION}/attendance-sessions/history`,

  // Attendance results endpoints
  RESULTS_INITIALIZE: `${API_VERSION}/attendance-results/initialize`,
};
