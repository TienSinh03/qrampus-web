/**
 * Report Endpoints
 */

import { API_VERSION } from '../config';

export const REPORT_ENDPOINTS = {
  DASHBOARD_STATS: `${API_VERSION}/reports/dashboard/stats`,
  CARD_ACCOUNT: `${API_VERSION}/reports/powerbi/dashboard/card-account`,
  CARD_PERSONNEL: `${API_VERSION}/reports/powerbi/dashboard/card-personnel`,
  CARD_STUDENT: `${API_VERSION}/reports/powerbi/dashboard/card-student`,
  CARD_SURVEY: `${API_VERSION}/reports/powerbi/dashboard/card-survey`,
  CARD_COURSE_SESCTION: `${API_VERSION}/reports/powerbi/dashboard/card-course-sesction`,
  CARD_SCHEDULES: `${API_VERSION}/reports/powerbi/dashboard/card-schedules`,
  CARD_ENROLLMENT: `${API_VERSION}/reports/powerbi/dashboard/card-enrollment`,
  CARD_ROOM: `${API_VERSION}/reports/powerbi/dashboard/card-room`,
};
