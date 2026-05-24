import { API_VERSION } from '../config';

/**
 * Survey Endpoints
 */
export const SURVEY_ENDPOINTS = {
  BASE: `${API_VERSION}/survey`,
  TEACHER_STATISTICS: `${API_VERSION}/survey/teacher/statistics`,
  ADMIN_SUMMARY_COURSE_SECTION: `${API_VERSION}/survey/admin-summary/course-section`,
  BY_ID: (id) => `${API_VERSION}/survey/${id}`,
  STATUS: `${API_VERSION}/survey/status`,
  COURSE_SECTIONS: `${API_VERSION}/survey/course-sections`,
  ADMIN_SUMMARY_BY_ID: (id) => `${API_VERSION}/survey/${id}/admin-summary`,
  BULK_CREATE_WITH_QUESTIONS_EXCEL: `${API_VERSION}/survey/bulk-create-with-questions-excel`,
  QUESTIONS: `${API_VERSION}/survey-questions`,
  QUESTION_BY_ID: (id) => `${API_VERSION}/survey-questions/${id}`,
  RESPONSES: `${API_VERSION}/survey-responses`,
  RESPONSE_BY_ID: (id) => `${API_VERSION}/survey-responses/${id}`,
};
