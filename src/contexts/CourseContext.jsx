import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import teacherService from '@services/teacher.service';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [teacherCoursesLoading, setTeacherCoursesLoading] = useState(false);
  const [teacherCoursesError, setTeacherCoursesError] = useState(null);

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

  const value = useMemo(() => ({
    teacherCourses,
    teacherCoursesLoading,
    teacherCoursesError,
    fetchTeacherCourses,
  }), [teacherCourses, teacherCoursesLoading, teacherCoursesError, fetchTeacherCourses]);

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
