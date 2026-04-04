import { useCallback, useEffect } from 'react';
import { useTeacherSchedule } from '@contexts/TeacherScheduleContext';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

/**
 * Custom hook for teacher schedule operations
 * Provides convenient methods for working with schedule data
 */
export const useSchedule = () => {
  const context = useTeacherSchedule();

  /**
   * Get schedules for a specific date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   */
  const getSchedulesInRange = useCallback((startDate, endDate) => {
    return context.schedules.filter(schedule => {
      const scheduleDate = parseISO(schedule.class_date);
      return isWithinInterval(scheduleDate, { start: startDate, end: endDate });
    });
  }, [context.schedules]);

  /**
   * Get today's schedules
   */
  const getTodaySchedules = useCallback(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return context.schedules.filter(schedule => schedule.class_date === today);
  }, [context.schedules]);

  /**
   * Get upcoming schedules (from today onwards)
   * @param {number} limit - Maximum number of schedules to return
   */
  const getUpcomingSchedules = useCallback((limit = 10) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return context.schedules
      .filter(schedule => {
        const scheduleDate = parseISO(schedule.class_date);
        return scheduleDate >= today && schedule.status !== 'cancelled';
      })
      .sort((a, b) => {
        const dateA = parseISO(a.class_date);
        const dateB = parseISO(b.class_date);
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        return a.start_hour.localeCompare(b.start_hour);
      })
      .slice(0, limit);
  }, [context.schedules]);

  /**
   * Get current week schedules
   */
  const getCurrentWeekSchedules = useCallback(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    return context.getSchedulesByWeek(weekStart, weekEnd);
  }, [context]);

  /**
   * Check if there's a schedule happening now
   */
  const getCurrentSchedule = useCallback(() => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const currentTime = format(now, 'HH:mm:ss');

    return context.schedules.find(schedule => {
      if (schedule.class_date !== today) return false;
      if (schedule.status === 'cancelled') return false;
      return schedule.start_hour <= currentTime && schedule.end_hour >= currentTime;
    });
  }, [context.schedules]);

  /**
   * Get next schedule
   */
  const getNextSchedule = useCallback(() => {
    const upcoming = getUpcomingSchedules(1);
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [getUpcomingSchedules]);

  /**
   * Group schedules by course section
   */
  const getSchedulesByCourse = useCallback(() => {
    const grouped = new Map();
    
    context.schedules.forEach(schedule => {
      const courseId = schedule.course_section_id;
      if (!grouped.has(courseId)) {
        grouped.set(courseId, {
          courseSection: schedule.courseSection,
          schedules: []
        });
      }
      grouped.get(courseId).schedules.push(schedule);
    });

    return Array.from(grouped.values());
  }, [context.schedules]);

  return {
    ...context,
    getSchedulesInRange,
    getTodaySchedules,
    getUpcomingSchedules,
    getCurrentWeekSchedules,
    getCurrentSchedule,
    getNextSchedule,
    getSchedulesByCourse
  };
};

export default useSchedule;
