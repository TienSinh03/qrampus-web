/**
 * API Endpoints Constants
 * File này giữ lại để tương thích với code cũ
 * Tất cả endpoints đã được tách ra thành các file riêng trong thư mục endpoints/
 * 
 * @deprecated Sử dụng import trực tiếp từ endpoints/ hoặc config.js
 */

// Re-export config
export { API_BASE_URL, API_VERSION } from './config';

// Re-export tất cả endpoints
export {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  PERSONNEL_ENDPOINTS,
  COURSE_ENDPOINTS,
  SCHEDULE_ENDPOINTS,
  ROOM_ENDPOINTS,
  ATTENDANCE_ENDPOINTS,
  LEAVE_REQUEST_ENDPOINTS,
  SURVEY_ENDPOINTS,
  STUDENT_ENDPOINTS,
  TEACHER_ENDPOINTS,
  REPORT_ENDPOINTS,
  HEALTH_ENDPOINT,
} from './endpoints';

