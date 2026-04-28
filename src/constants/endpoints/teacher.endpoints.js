import { API_VERSION } from '../config';

/**
 * Teacher Endpoints
 */
export const TEACHER_ENDPOINTS = {
  BASE: `${API_VERSION}/teachers`,
  BY_ID: (id) => `${API_VERSION}/teachers/${id}`,
  ME_STUDENTS: `${API_VERSION}/teachers/me/students`,
  ME_SCHEDULE: `${API_VERSION}/teachers/me/schedule`,
  TEACHER_COURSES: (teacherId) => `${API_VERSION}/teachers/${encodeURIComponent(teacherId)}/courses`,
  TEACHER_COURSE_ASSIGNMENTS: (teacherId, courseSectionId) => (
    `${API_VERSION}/teachers/${encodeURIComponent(teacherId)}/course-sections/${encodeURIComponent(courseSectionId)}/assignments`
  ),
  CLASS_SESSION_STUDENTS: (classSessionId) => `${API_VERSION}/teachers/class-sessions/${classSessionId}/students`,
  COURSE_SECTION_STUDENTS: (courseSectionCode) => `${API_VERSION}/teachers/course-sections/${encodeURIComponent(courseSectionCode)}/students`,
  ME_SCHEDULE_TODAY: `${API_VERSION}/teachers/me/schedule/today`,
  CLASS_SESSION_OVERVIEW: (classSessionId) => `${API_VERSION}/teachers/class-sessions/${classSessionId}/overview`,

};
