/**
 * Endpoints Index
 * Export tất cả các endpoints từ các module riêng biệt
 */

export { AUTH_ENDPOINTS } from './auth.endpoints';
export { USER_ENDPOINTS } from './user.endpoints';
export { PERSONNEL_ENDPOINTS } from './personnel.endpoints';
export { COURSE_ENDPOINTS } from './course.endpoints';
export { SCHEDULE_ENDPOINTS } from './schedule.endpoints';
export { ROOM_ENDPOINTS } from './room.endpoints';
export { ATTENDANCE_ENDPOINTS } from './attendance.endpoints';
export { LEAVE_REQUEST_ENDPOINTS } from './leave-request.endpoints';
export { SURVEY_ENDPOINTS } from './survey.endpoints';
export { STUDENT_ENDPOINTS } from './student.endpoints';
export { TEACHER_ENDPOINTS } from './teacher.endpoints';

// Health check
export const HEALTH_ENDPOINT = '/health';
