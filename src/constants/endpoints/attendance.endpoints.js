import { API_VERSION } from '../config';

/**
 * Attendance Endpoints
 */
export const ATTENDANCE_ENDPOINTS = {
  // Attendance image endpoints
  IMAGES: `${API_VERSION}/attendance-images`,
  IMAGE_BY_ID: (id) => `${API_VERSION}/attendance-images/${id}`,
  IMAGES_BY_SESSION: (imageSessionId) => `${API_VERSION}/attendance-images/session/${imageSessionId}`,

  // Image session endpoints
  IMAGE_SESSIONS: `${API_VERSION}/image-sessions`,
  IMAGE_SESSION_BY_ID: (id) => `${API_VERSION}/image-sessions/${id}`,
  IMAGE_SESSION_EXISTS: (classSessionId) => `${API_VERSION}/image-sessions/exists/${classSessionId}`,

  // New attendance session endpoints
  SESSIONS: `${API_VERSION}/attendance-sessions`,
  SESSION_BY_ID: (id) => `${API_VERSION}/attendance-sessions/${id}`,
  SESSION_CLOSE: (id) => `${API_VERSION}/attendance-sessions/${id}/close`,
  SESSION_NEXT_QR: (id) => `${API_VERSION}/attendance-sessions/${id}/next-qr`,
  SESSION_STATS: (id) => `${API_VERSION}/attendance-sessions/${id}/stats`,
  SESSION_ACTIVE_BY_CLASS: (classSessionId) => `${API_VERSION}/attendance-sessions/class-session/${classSessionId}/active`,
  SESSION_HISTORY: `${API_VERSION}/attendance-sessions/history`,
  TEACHER_DASHBOARD: `${API_VERSION}/attendance-sessions/teacher/dashboard`,
  TEACHER_COURSE_SESSIONS: (courseId) => `${API_VERSION}/attendance-sessions/teacher/courses/${courseId}/sessions`,

  // Attendance history endpoints
  STUDENT_ATTENDANCE_HISTORY: (studentId) => `${API_VERSION}/attendance-history/students/${studentId}`,

  // Attendance results endpoints
  RESULTS_INITIALIZE: `${API_VERSION}/attendance-results/initialize`,
  RESULTS_UPDATE: (attendanceResultId) => `${API_VERSION}/attendance-results/${attendanceResultId}`,

  // Admin summary
  ADMIN_SUMMARY: `${API_VERSION}/attendance-history/admin/summary`,

  // Attendance schedule (for attendance staff)
  SCHEDULE: `${API_VERSION}/attendance-schedule`,
  SCHEDULE_TODAY_STATS: `${API_VERSION}/attendance-schedule/today-stats`,

  // Teacher attendance workload
  TEACHER_WORKLOAD: `${API_VERSION}/teachers/me/attendance-workload`,
};
