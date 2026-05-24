import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import teacherService from '@services/teacher.service';
import { toast } from 'sonner';

const TeacherScheduleContext = createContext(null);

export const TeacherScheduleProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  
  const [todaySchedules, setTodaySchedules] = useState([]);
  const [todayLoading, setTodayLoading] = useState(false);
  const [todayError, setTodayError] = useState(null);
  const [lastFetchedToday, setLastFetchedToday] = useState(null);

  const [classSessionDetail, setClassSessionDetail] = useState(null);
  const [classSessionDetailLoading, setClassSessionDetailLoading] = useState(false);
  const [classSessionDetailError, setClassSessionDetailError] = useState(null);
  const [lastFetchedDetail, setLastFetchedDetail] = useState(null);
  const [currentClassSessionId, setCurrentClassSessionId] = useState(null);

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
  }, [lastFetched, schedules]);

  /**
   * Refresh schedules (force fetch)
   */
  const refreshSchedules = useCallback(async (params = {}) => {
    return fetchSchedules(params, true);
  }, [fetchSchedules]);

  /**
   * Fetch today's schedules from API
   */
  const fetchTodaySchedules = useCallback(async (forceRefresh = false) => {

    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

    if (!forceRefresh && lastFetchedToday) {
      const timeSinceLastFetch = Date.now() - lastFetchedToday;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { success: true, data: todaySchedules };
      }
    }

    setTodayLoading(true);
    setTodayError(null);

    try {
      const response = await teacherService.getMyScheduleToday();

      if (response.success) {
        const normalizedData = Array.isArray(response.data) ? response.data : [];

        setTodaySchedules(normalizedData);
        setLastFetchedToday(Date.now());

        return { success: true, data: normalizedData };
      }

      const message = 'Không thể tải lịch dạy hôm nay';
      setTodayError(message);

      return { success: false, error: message };

    } catch (err) {
      const errorMessage = err.message || 'Đã xảy ra lỗi khi tải lịch dạy hôm nay';
      setTodayError(errorMessage);

      toast.error(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setTodayLoading(false);
    }

  }, [lastFetchedToday, todaySchedules]);

  /**
   * Refresh today's schedules (force fetch)
   */
  const refreshTodaySchedules = useCallback(async () => {
    return fetchTodaySchedules(true);

  }, [fetchTodaySchedules]);

  /**
   * Fetch class session detail for teacher
   */
  const fetchClassSessionDetail = useCallback(async (classSessionId, forceRefresh = false) => {
    if (!classSessionId) {
      const message = 'Thiếu classSessionId để lấy chi tiết buoi hoc';
      setClassSessionDetailError(message);
      return { success: false, error: message };
    }

    const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes
    if (!forceRefresh && currentClassSessionId === classSessionId && lastFetchedDetail) {
      const timeSinceLastFetch = Date.now() - lastFetchedDetail;
      if (timeSinceLastFetch < CACHE_DURATION && classSessionDetail) {
        return { success: true, data: classSessionDetail };
      }
    }

    setClassSessionDetailLoading(true);
    setClassSessionDetailError(null);

    try {
      const response = await teacherService.getMyClassSessionDetail(classSessionId);

      if (response.success) {
        const detail = response.data || null;
        setClassSessionDetail(detail);
        setCurrentClassSessionId(classSessionId);
        setLastFetchedDetail(Date.now());
        return { success: true, data: detail };
      }

      const message = response.message || 'Khong the tai chi tiet buoi hoc';
      setClassSessionDetailError(message);
      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.message || 'Da xay ra loi khi tai chi tiet buoi hoc';
      setClassSessionDetailError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setClassSessionDetailLoading(false);
    }
  }, [currentClassSessionId, lastFetchedDetail, classSessionDetail]);

  /**
   * Refresh class session detail (force fetch)
   */
  const refreshClassSessionDetail = useCallback(async (classSessionId) => {
    return fetchClassSessionDetail(classSessionId, true);
  }, [fetchClassSessionDetail]);

  /**
   * Clear schedules data
   */
  const clearSchedules = useCallback(() => {
    setSchedules([]);
    setLastFetched(null);
    setError(null);
    setTodaySchedules([]);
    setTodayLoading(false);
    setTodayError(null);
    setLastFetchedToday(null);
    setClassSessionDetail(null);
    setClassSessionDetailLoading(false);
    setClassSessionDetailError(null);
    setLastFetchedDetail(null);
    setCurrentClassSessionId(null);
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
      practice,
      todayTotal: todaySchedules.length
    };
  }, [schedules, todaySchedules.length]);

  const value = {
    schedules,
    loading,
    error,
    lastFetched,
    todaySchedules,
    todayLoading,
    todayError,
    lastFetchedToday,
    classSessionDetail,
    classSessionDetailLoading,
    classSessionDetailError,
    lastFetchedDetail,
    currentClassSessionId,
    fetchSchedules,
    refreshSchedules,
    fetchTodaySchedules,
    refreshTodaySchedules,
    fetchClassSessionDetail,
    refreshClassSessionDetail,
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
