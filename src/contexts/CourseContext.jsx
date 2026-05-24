import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import teacherService from '@services/teacher.service';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [teacherCoursesLoading, setTeacherCoursesLoading] = useState(false);
  const [teacherCoursesError, setTeacherCoursesError] = useState(null);

  const [teacherCourseAssignments, setTeacherCourseAssignments] = useState(null);
  const [teacherCourseAssignmentsLoading, setTeacherCourseAssignmentsLoading] = useState(false);
  const [teacherCourseAssignmentsError, setTeacherCourseAssignmentsError] = useState(null);

  const fetchTeacherCourses = useCallback(async (teacherId, params = {}) => {
    if (!teacherId) {
      const message = 'Thiếu teacherId để tải học phần';
      setTeacherCoursesError(message);
      return { success: false, error: message };
    }

    setTeacherCoursesLoading(true);
    setTeacherCoursesError(null);

    try {
      const response = await teacherService.getTeacherCourseSections(teacherId, params);

      if (response?.success) {
        setTeacherCourses(response.data || []);
        return { success: true, data: response.data || [] };
      }

      const message = response?.message || 'Không thể tải học phần của giảng viên';
      setTeacherCoursesError(message);
      return { success: false, error: message };
    } catch (error) {
      const message = error.message || 'Không thể tải học phần của giảng viên';
      setTeacherCoursesError(message);
      return { success: false, error: message };
    } finally {
      setTeacherCoursesLoading(false);
    }
  }, []);

  const fetchTeacherCourseAssignments = useCallback(async (teacherId, courseSectionId) => {
    if (!teacherId || !courseSectionId) {
      const message = 'Thiếu thông tin giảng viên hoặc học phần để tải phân công';
      setTeacherCourseAssignmentsError(message);
      return { success: false, error: message };
    }

    setTeacherCourseAssignmentsLoading(true);
    setTeacherCourseAssignmentsError(null);

    try {
      const response = await teacherService.getTeacherCourseAssignments(teacherId, courseSectionId);

      if (response?.success) {
        setTeacherCourseAssignments(response.data || null);
        return { success: true, data: response.data || null };
      }

      const message = response?.message || 'Không thể tải phân công giảng viên';
      setTeacherCourseAssignmentsError(message);
      return { success: false, error: message };
    } catch (error) {
      const message = error.message || 'Không thể tải phân công giảng viên';
      setTeacherCourseAssignmentsError(message);
      return { success: false, error: message };
    } finally {
      setTeacherCourseAssignmentsLoading(false);
    }
  }, []);

  const value = useMemo(() => ({
    teacherCourses,
    teacherCoursesLoading,
    teacherCoursesError,
    fetchTeacherCourses,
    teacherCourseAssignments,
    teacherCourseAssignmentsLoading,
    teacherCourseAssignmentsError,
    fetchTeacherCourseAssignments,
  }), [
    teacherCourses,
    teacherCoursesLoading,
    teacherCoursesError,
    fetchTeacherCourses,
    teacherCourseAssignments,
    teacherCourseAssignmentsLoading,
    teacherCourseAssignmentsError,
    fetchTeacherCourseAssignments,
  ]);

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }

  return context;
};
