/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import teacherService from '@services/teacher.service';

const StudySessionOverviewContext = createContext(null);

const DEFAULT_OVERVIEW = {
  teacher: null,
  classSession: null,
  courseSection: null,
  courseProgress: {
    learnedSessions: 0,
    totalSessions: 0,
    remainingSessions: 0,
    completionPercentage: 0,
    estimatedEndDate: null,
  },
  leaveEvidence: {
    total: 0
  },
  attendanceOverview: {
    totalStudents: 0,
    attendanceSessionCount: 0,
    qrGeneratedCount: 0,
    latestSession: {
      id: null,
      status: null,
      created_at: null,
      expires_at: null,
      attendedCount: 0,
      absentCount: 0,
      strangeDeviceCount: 0,
    },
  },
};

const normalizeOverview = (payload = {}) => ({
  ...DEFAULT_OVERVIEW,
  ...payload,
  courseProgress: {
    ...DEFAULT_OVERVIEW.courseProgress,
    ...(payload?.courseProgress || {}),
  },
  leaveEvidence: {
    ...DEFAULT_OVERVIEW.leaveEvidence,
    ...(payload?.leaveEvidence || {}),
  },
  attendanceOverview: {
    ...DEFAULT_OVERVIEW.attendanceOverview,
    ...(payload?.attendanceOverview || {}),
    latestSession: {
      ...DEFAULT_OVERVIEW.attendanceOverview.latestSession,
      ...(payload?.attendanceOverview?.latestSession || {}),
    },
  },
});

export const StudySessionOverviewProvider = ({ children }) => {
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [currentClassSessionId, setCurrentClassSessionId] = useState(null);

  const fetchOverview = useCallback(async (classSessionId, forceRefresh = false) => {
    if (!classSessionId) {
      return { success: false, error: 'Class session ID is required' };
    }

    const CACHE_DURATION = 3 * 60 * 1000;
    if (!forceRefresh && currentClassSessionId === classSessionId && lastFetched) {
      const timeSinceLastFetch = Date.now() - lastFetched;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { success: true, data: overview };
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await teacherService.getTeacherClassSessionOverview(classSessionId);

      if (!response.success) {
        const message = response.message || 'Không thể tải dữ liệu tổng quan buổi học';
        setError(message);
        return { success: false, error: message };
      }

      const nextOverview = normalizeOverview(response.data || {});

      setOverview(nextOverview);
      setCurrentClassSessionId(classSessionId);
      setLastFetched(Date.now());

      return { success: true, data: nextOverview };
    } catch (err) {
      const errorMessage = err.message || 'Đã xảy ra lỗi khi tải tổng quan buổi học';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [currentClassSessionId, lastFetched, overview]);

  const refreshOverview = useCallback(async (classSessionId) => {
    return fetchOverview(classSessionId, true);
  }, [fetchOverview]);

  const clearOverview = useCallback(() => {
    setOverview(DEFAULT_OVERVIEW);
    setLoading(false);
    setError(null);
    setLastFetched(null);
    setCurrentClassSessionId(null);
  }, []);

  const value = useMemo(() => ({
    overview,
    loading,
    error,
    lastFetched,
    currentClassSessionId,
    fetchOverview,
    refreshOverview,
    clearOverview,
  }), [
    overview,
    loading,
    error,
    lastFetched,
    currentClassSessionId,
    fetchOverview,
    refreshOverview,
    clearOverview,
  ]);

  return (
    <StudySessionOverviewContext.Provider value={value}>
      {children}
    </StudySessionOverviewContext.Provider>
  );
};

export const useStudySessionOverview = () => {
  const context = useContext(StudySessionOverviewContext);
  if (!context) {
    throw new Error('useStudySessionOverview must be used within a StudySessionOverviewProvider');
  }
  return context;
};
