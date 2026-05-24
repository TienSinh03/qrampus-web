import { API_VERSION } from '../config';

/**
 * Course Endpoints
 */
export const COURSE_ENDPOINTS = {
  BASE: `${API_VERSION}/courses`,
  BY_ID: (id) => `${API_VERSION}/courses/${id}`,
  SECTIONS: `${API_VERSION}/course-sections`,
  SECTIONS_ROWS: `${API_VERSION}/course-sections/rows`,
  SECTION_BY_ID: (id) => `${API_VERSION}/course-sections/${id}`,
  LEARNING_MODES: `${API_VERSION}/course-sections/learning-modes`,
};
