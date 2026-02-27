/**
 * API Endpoints Constants
 * Định nghĩa tất cả các endpoint API
 */

// Base URL từ environment hoặc default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const API_VERSION = '/api/v1';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_VERSION}/auth/login`,
  REFRESH: `${API_VERSION}/auth/refresh`,
  LOGOUT: `${API_VERSION}/auth/logout`,
  LOGOUT_ALL: `${API_VERSION}/auth/logout-all`,
  CURRENT_USER: `${API_VERSION}/auth/me`,
  CHANGE_PASSWORD: `${API_VERSION}/auth/change-password`,
};

// User endpoints
export const USER_ENDPOINTS = {
  BASE: `${API_VERSION}/users`,
  BY_ID: (id) => `${API_VERSION}/users/${id}`,
  PROFILE: `${API_VERSION}/users/profile`,
};

// Course endpoints
export const COURSE_ENDPOINTS = {
  BASE: `${API_VERSION}/courses`,
  BY_ID: (id) => `${API_VERSION}/courses/${id}`,
  SECTIONS: `${API_VERSION}/course-sections`,
  SECTION_BY_ID: (id) => `${API_VERSION}/course-sections/${id}`,
};

// Schedule endpoints
export const SCHEDULE_ENDPOINTS = {
  BASE: `${API_VERSION}/schedules`,
  BY_ID: (id) => `${API_VERSION}/schedules/${id}`,
  TEACHER: (teacherId) => `${API_VERSION}/schedules/teacher/${teacherId}`,
  STUDENT: (studentId) => `${API_VERSION}/schedules/student/${studentId}`,
};

// Room endpoints
export const ROOM_ENDPOINTS = {
  BASE: `${API_VERSION}/rooms`,
  BY_ID: (id) => `${API_VERSION}/rooms/${id}`,
};

// Attendance endpoints
export const ATTENDANCE_ENDPOINTS = {
  IMAGES: `${API_VERSION}/attendance-images`,
  IMAGE_BY_ID: (id) => `${API_VERSION}/attendance-images/${id}`,
  IMAGE_SESSIONS: `${API_VERSION}/image-sessions`,
  IMAGE_SESSION_BY_ID: (id) => `${API_VERSION}/image-sessions/${id}`,
};

// Leave request endpoints
export const LEAVE_REQUEST_ENDPOINTS = {
  BASE: `${API_VERSION}/leave-requests`,
  BY_ID: (id) => `${API_VERSION}/leave-requests/${id}`,
  MY_REQUESTS: `${API_VERSION}/leave-requests/my-requests`,
  APPROVE: (id) => `${API_VERSION}/leave-requests/${id}/approve`,
  REJECT: (id) => `${API_VERSION}/leave-requests/${id}/reject`,
};

// Survey endpoints
export const SURVEY_ENDPOINTS = {
  BASE: `${API_VERSION}/surveys`,
  BY_ID: (id) => `${API_VERSION}/surveys/${id}`,
  QUESTIONS: `${API_VERSION}/survey-questions`,
  QUESTION_BY_ID: (id) => `${API_VERSION}/survey-questions/${id}`,
  RESPONSES: `${API_VERSION}/survey-responses`,
  RESPONSE_BY_ID: (id) => `${API_VERSION}/survey-responses/${id}`,
};

// Student endpoints
export const STUDENT_ENDPOINTS = {
  BASE: `${API_VERSION}/students`,
  BY_ID: (id) => `${API_VERSION}/students/${id}`,
};

// Teacher endpoints (nếu có)
export const TEACHER_ENDPOINTS = {
  BASE: `${API_VERSION}/teachers`,
  BY_ID: (id) => `${API_VERSION}/teachers/${id}`,
};

// Personnel endpoints
export const PERSONNEL_ENDPOINTS = {
  BASE: `${API_VERSION}/personnel`,
  BY_ID: (id) => `${API_VERSION}/personnel/${id}`,
};

// Health check
export const HEALTH_ENDPOINT = '/health';
