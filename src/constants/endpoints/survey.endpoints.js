import { API_VERSION } from '../config';

/**
 * Survey Endpoints
 */
export const SURVEY_ENDPOINTS = {
  BASE: `${API_VERSION}/surveys`,
  BY_ID: (id) => `${API_VERSION}/surveys/${id}`,
  QUESTIONS: `${API_VERSION}/survey-questions`,
  QUESTION_BY_ID: (id) => `${API_VERSION}/survey-questions/${id}`,
  RESPONSES: `${API_VERSION}/survey-responses`,
  RESPONSE_BY_ID: (id) => `${API_VERSION}/survey-responses/${id}`,
};
