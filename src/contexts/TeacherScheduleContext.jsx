import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import teacherService from '@services/teacher.service';
import { toast } from 'sonner';

const TeacherScheduleContext = createContext(null);

export const TeacherScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  /**
   * Fetch teacher's schedule from API
   */
  const fetchSchedules = useCallback(async (params = {}, forceRefresh = false) => {
    // Skip if data is fresh (within 5 minutes) and not forcing refresh
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    if (!forceRefresh && lastFetched && schedules.length > 0) {
      const timeSinceLastFetch = Date.now() - lastFetched;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { success: true, data: schedules };
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await teacherService.getMySchedule(params);
      
      if (response.success) {
        setSchedules(response.data);
        setLastFetched(Date.now());
        return { success: true, data: response.data };
      }
      
      setError('Không thể tải lịch dạy');
      return { success: false, error: 'Không thể tải lịch dạy' };
    } catch (err) {
      const errorMessage = err.message || 'Đã xảy ra lỗi khi tải lịch dạy';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [lastFetched, schedules.length]);

  /**
   * Refresh schedules (force fetch)
   */
  const refreshSchedules = useCallback(async (params = {}) => {
    return fetchSchedules(params, true);
  }, [fetchSchedules]);

  /**
   * Clear schedules data
   */
  const clearSchedules = useCallback(() => {
    setSchedules([]);
    setLastFetched(null);
    setError(null);
  }, []);

  /**
   * Get schedules for a specific date
   */
  const getSchedulesByDate = useCallback((dateStr) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.class_date);
      const [day, month, year] = dateStr.split('/');
      const targetDate = new Date(year, month - 1, day);
      return scheduleDate.toDateString() === targetDate.toDateString();
    });
  }, [schedules]);

  /**
   * Get schedules for a specific week
   */
  const getSchedulesByWeek = useCallback((weekStart, weekEnd) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.class_date);
      return scheduleDate >= weekStart && scheduleDate <= weekEnd;
    });
  }, [schedules]);

  /**
   * Get unique course sections from schedules
   */
  const courseSections = useMemo(() => {
    const uniqueCourses = new Map();
    schedules.forEach(schedule => {
      if (schedule.courseSection && !uniqueCourses.has(schedule.courseSection.id)) {
        uniqueCourses.set(schedule.courseSection.id, schedule.courseSection);
      }
    });
    return Array.from(uniqueCourses.values());
  }, [schedules]);

  /**
   * Get schedule statistics
   */
  const statistics = useMemo(() => {
    const total = schedules.length;
    const completed = schedules.filter(s => s.status === 'completed').length;
    const scheduled = schedules.filter(s => s.status === 'scheduled').length;
    const cancelled = schedules.filter(s => s.status === 'cancelled').length;
    const theory = schedules.filter(s => s.schedule_type === 'theory').length;
    const practice = schedules.filter(s => s.schedule_type === 'practice').length;

    return {
      total,
      completed,
      scheduled,
      cancelled,
      theory,
      practice
    };
  }, [schedules]);

  const value = {
    schedules,
    loading,
    error,
    lastFetched,
    fetchSchedules,
    refreshSchedules,
    clearSchedules,
    getSchedulesByDate,
    getSchedulesByWeek,
    courseSections,
    statistics
  };

  return (
    <TeacherScheduleContext.Provider value={value}>
      {children}
    </TeacherScheduleContext.Provider>
  );
};

/**
 * Custom hook to use Teacher Schedule Context
 */
export const useTeacherSchedule = () => {
  const context = useContext(TeacherScheduleContext);
  if (!context) {
    throw new Error('useTeacherSchedule must be used within a TeacherScheduleProvider');
  }
  return context;
};
