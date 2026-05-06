/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AttendanceService from '@services/attendance.service';
import { toast } from 'sonner';

const AttendanceContext = createContext(null);

const ACTIVE_SESSIONS_KEY = 'attendance_active_sessions';
const COMPLETED_SESSIONS_KEY = 'attendance_completed_session_snapshots';

export const AttendanceProvider = ({ children }) => {
  // Active session state
  const [activeSession, setActiveSession] = useState(null);
  const [currentQR, setCurrentQR] = useState(null);
  
  // Map để lưu active sessions theo class_session_id
  // Initialize from localStorage
  const [activeSessions, setActiveSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert array back to Map
        return new Map(parsed);
      }
    } catch (error) {
      console.error('Error loading active sessions from localStorage:', error);
    }
    return new Map();
  });

  // Snapshot phiên gần nhất đã đóng theo class_session_id
  const [completedSessionSnapshots, setCompletedSessionSnapshots] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_SESSIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return new Map(parsed);
      }
    } catch (error) {
      console.error('Error loading completed session snapshots from localStorage:', error);
    }
    return new Map();
  });
  
  // Loading states
  const [createLoading, setCreateLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [nextQRLoading, setNextQRLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Session stats
  const [sessionStats, setSessionStats] = useState(null);

  // Attendance results initialize state
  const [attendanceResults, setAttendanceResults] = useState(null);
  const [attendanceResultsLoading, setAttendanceResultsLoading] = useState(false);
  const [attendanceResultsUpdating, setAttendanceResultsUpdating] = useState(false);
  
  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [historyPagination, setHistoryPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchTeacherAttendanceDashboard = useCallback(async (params = {}) => {
    try {
      const response = await AttendanceService.getTeacherAttendanceDashboard(params);
      return {
        success: !!response?.success,
        data: response?.data || null,
        message: response?.message || '',
      };
    } catch (error) {
      const message = error?.message || 'Không thể tải dashboard chấm công';
      return { success: false, error: message, message };
    }
  }, []);

  const fetchTeacherCourseAttendanceSessions = useCallback(async (courseId, params = {}) => {
    if (!courseId) {
      const message = 'Thiếu courseId để lấy danh sách buổi chấm công';
      return { success: false, error: message, message };
    }

    try {
      const response = await AttendanceService.getTeacherCourseSessions(courseId, params);
      return {
        success: !!response?.success,
        data: response?.data || null,
        message: response?.message || '',
      };
    } catch (error) {
      const message = error?.message || 'Không thể tải danh sách buổi chấm công';
      return { success: false, error: message, message };
    }
  }, []);

  const getValidSession = useCallback((session) => {
    if (!session?.expires_at) return null;

    const expiresAt = new Date(session.expires_at);
    if (Number.isNaN(expiresAt.getTime())) return null;

    const now = new Date();
    if (now >= expiresAt) return null;

    return session;
  }, []);

  useEffect(() => {
    try {
      const sessionsArray = Array.from(activeSessions.entries());
      localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessionsArray));
    } catch (error) {
      console.error('Error saving active sessions to localStorage:', error);
    }
  }, [activeSessions]);

  useEffect(() => {
    try {
      const snapshotsArray = Array.from(completedSessionSnapshots.entries());
      localStorage.setItem(COMPLETED_SESSIONS_KEY, JSON.stringify(snapshotsArray));
    } catch (error) {
      console.error('Error saving completed session snapshots to localStorage:', error);
    }
  }, [completedSessionSnapshots]);

  const saveCompletedSessionSnapshot = useCallback((classSessionId, snapshotData) => {
    if (!classSessionId || !snapshotData) return;

    setCompletedSessionSnapshots((prev) => {
      const newMap = new Map(prev);
      newMap.set(classSessionId, snapshotData);
      return newMap;
    });
  }, []);

  const getLatestCompletedSessionSnapshot = useCallback((classSessionId = null) => {
    if (classSessionId) {
      return completedSessionSnapshots.get(classSessionId) || null;
    }

    if (completedSessionSnapshots.size === 0) return null;

    const snapshots = Array.from(completedSessionSnapshots.values());
    snapshots.sort((a, b) => {
      const first = new Date(b?.closed_at || 0).getTime();
      const second = new Date(a?.closed_at || 0).getTime();
      return first - second;
    });

    return snapshots[0] || null;
  }, [completedSessionSnapshots]);

  // Listen to localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key !== ACTIVE_SESSIONS_KEY) return;

      if (!e.newValue) {
        setActiveSessions(new Map());
        return;
      }

      try {
        const parsed = JSON.parse(e.newValue);
        setActiveSessions(new Map(parsed));
      } catch (error) {
        console.error('Error syncing active sessions from other tab:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Tạo phiên điểm danh mới
   */
  const createSession = useCallback(async (classSessionId, durationMinutes, qrInterval = 10) => {
    setCreateLoading(true);
    try {
      const response = await AttendanceService.createAttendanceSession({
        class_session_id: classSessionId,
        session_duration_minutes: durationMinutes,
        qr_interval: qrInterval,
      });

      if (response.success) {
        const { attendanceSession, firstQr, classInfo } = response.data;
        
        const sessionData = {
          ...attendanceSession,
          classInfo,
        };
        setActiveSession(sessionData);
        
        setActiveSessions(prev => {
          const newMap = new Map(prev);
          newMap.set(classSessionId, sessionData);
          return newMap;
        });
        
        setCurrentQR(firstQr);
        
        toast.success('Tạo phiên điểm danh thành công');
        return response.data;
      } else {
        toast.error(response.message || 'Tạo phiên điểm danh thất bại');
        return null;
      }
    } catch (error) {
      const errorMessage = error.message || 'Tạo phiên điểm danh thất bại';
      toast.error(errorMessage);

      console.error('Create session error:', error);
      return null;
    } finally {
      setCreateLoading(false);
    }
  }, []);

  /**
   * Đóng phiên điểm danh
   */
  const closeSession = useCallback(async (sessionId, teacherId = null) => {
    setCloseLoading(true);
    try {
      let latestStats = null;

      try {
        const statsResponse = await AttendanceService.getSessionStats(sessionId, teacherId);
        if (statsResponse?.success) {
          latestStats = statsResponse.data;
        }
      } catch (error) {
        console.warn('Unable to fetch latest session stats before close:', error);
      }

      const response = await AttendanceService.closeAttendanceSession(sessionId);

      if (response.success) {
        let targetClassSessionId = activeSession?.class_session_id || null;

        if (!targetClassSessionId) {
          for (const [classSessionId, session] of activeSessions.entries()) {
            if (session?.id === sessionId) {
              targetClassSessionId = classSessionId;
              break;
            }
          }
        }

        if (targetClassSessionId && latestStats) {
          saveCompletedSessionSnapshot(targetClassSessionId, {
            session_id: sessionId,
            class_session_id: targetClassSessionId,
            closed_at: new Date().toISOString(),
            stats: latestStats?.stats || null,
            attendances: Array.isArray(latestStats?.attendances) ? latestStats.attendances : [],
            raw: latestStats,
          });
        }

        // xóa phiên hiện tại nếu đúng phiên đang active
        setActiveSession(null);
        setCurrentQR(null);
        setSessionStats(null);

        setActiveSessions(prev => {
          const newMap = new Map(prev);

          if (activeSession?.class_session_id) {
            newMap.delete(activeSession.class_session_id);
            return newMap;
          }

          for (const [classSessionId, session] of newMap.entries()) {
            if (session?.id === sessionId) {
              newMap.delete(classSessionId);
              break;
            }
          }

          return newMap;
        });
        
        toast.success('Đóng phiên điểm danh thành công');

        return response.data;
      } else {
        toast.error(response.message || 'Đóng phiên điểm danh thất bại');
        return null;
      }
    } catch (error) {
      const errorMessage = error.message || 'Đóng phiên điểm danh thất bại';
      console.error('Close session error:', error);

      if (error.status === 400) {
        setActiveSession(null);
        setCurrentQR(null);
        setSessionStats(null);
        setActiveSessions(prev => {
          const newMap = new Map(prev);
          if (activeSession?.class_session_id) {
            newMap.delete(activeSession.class_session_id);
          } else {
            for (const [classSessionId, session] of newMap.entries()) {
              if (session?.id === sessionId) {
                newMap.delete(classSessionId);
                break;
              }
            }
          }
          return newMap;
        });
      } else {
        toast.error(errorMessage);
      }
      return null;
    } finally {
      setCloseLoading(false);
    }
  }, [activeSession, activeSessions, saveCompletedSessionSnapshot]);

  /**
   * Lấy QR mới
   */
  const getNextQR = useCallback(async (sessionId) => {
    setNextQRLoading(true);
    try {
      const response = await AttendanceService.getNextQR(sessionId);

      if (response.success) {
        setCurrentQR(response.data);
        return response.data;
      } else {
        toast.error(response.message || 'Tạo QR mới thất bại');
        return null;
      }
    } catch (error) {
      console.error('Get next QR error:', error);
      // Nếu session đã hết hạn hoặc bị đóng từ thiết bị khác, xóa state local
      if (error.status === 400) {
        setActiveSession(null);
        setCurrentQR(null);
        setSessionStats(null);
        setActiveSessions(prev => {
          const newMap = new Map(prev);
          for (const [classSessionId, session] of newMap.entries()) {
            if (session?.id === sessionId) {
              newMap.delete(classSessionId);
              break;
            }
          }
          return newMap;
        });
      } else {
        toast.error(error.message || 'Tạo QR mới thất bại');
      }
      return null;
    } finally {
      setNextQRLoading(false);
    }
  }, []);

  
  /**
   * Lấy thống kê phiên điểm danh
   */
  const getStats = useCallback(async (sessionId) => {
    setStatsLoading(true);
    try {
      const response = await AttendanceService.getSessionStats(sessionId);

      if (response.success) {
        setSessionStats(response.data);
        return response.data;
      } else {
        console.error('Get stats failed:', response.message);
        return null;
      }
    } catch (error) {
      console.error('Get stats error:', error);
      return null;
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /**
   * Khởi tạo/làm mới dữ liệu chốt điểm danh cho class session
   */
  const initializeAttendanceResults = useCallback(async (payload, teacher_id = null) => {
    setAttendanceResultsLoading(true);

    try {
      const response = await AttendanceService.initializeAttendanceResults(payload, teacher_id);

      if (response?.success) {
        setAttendanceResults(response.data);
        return response.data;
      }

      const message = response?.message || 'Khởi tạo kết quả chốt thất bại';
      toast.error(message);

      return null;

    } catch (error) {

      const errorMessage = error?.message || 'Khởi tạo kết quả chốt thất bại';
      toast.error(errorMessage);

      console.error('Initialize attendance results error:', error);
      return null;
      
    } finally {
      setAttendanceResultsLoading(false);
    }
  }, []);

  /**
   * Cập nhật một kết quả chốt điểm danh
   */
  const updateAttendanceResult = useCallback(async (attendanceResultId, payload, teacherId = null) => {
    if (!attendanceResultId) {
      toast.error('Thiếu mã kết quả điểm danh để cập nhật');
      return null;
    }

    setAttendanceResultsUpdating(true);

    try {
      const response = await AttendanceService.updateAttendanceResult(attendanceResultId, payload, teacherId);

      if (response?.success) {
        setAttendanceResults(response.data);
        toast.success(response.message || 'Cập nhật kết quả chốt thành công');
        return response.data;
      }

      const message = response?.message || 'Cập nhật kết quả chốt thất bại';
      toast.error(message);
      return null;
    } catch (error) {
      const errorMessage = error?.message || 'Cập nhật kết quả chốt thất bại';
      toast.error(errorMessage);
      console.error('Update attendance result error:', error);
      return null;
    } finally {
      setAttendanceResultsUpdating(false);
    }
  }, []);

  /**
   * Lấy lịch sử phiên điểm danh theo học phần/nhóm thực hành
   */
  const fetchSessionHistory = useCallback(async ({
    courseSectionId,
    practiceGroupId,
    createdBy,
    page = 1,
    limit = 10,
  }) => {
    if (!courseSectionId) {
      const message = 'Thiếu course_section_id để lấy lịch sử phiên điểm danh';
      setHistoryError(message);
      setHistory([]);
      return { success: false, error: message };
    }

    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const params = {
        course_section_id: courseSectionId,
        page,
        limit,
      };

      if (practiceGroupId === null) {
        params.practice_group_id = 'null';
      } else if (practiceGroupId !== undefined && practiceGroupId !== '') {
        params.practice_group_id = practiceGroupId;
      }

      if (createdBy !== undefined && createdBy !== null && createdBy !== '') {
        params.created_by = createdBy;
      }

      const response = await AttendanceService.getSessionHistory(params);

      if (response?.success) {
        const sessions = Array.isArray(response?.data?.sessions) ? response.data.sessions : [];
        const pagination = response?.data?.pagination || {
          total: sessions.length,
          page,
          limit,
          totalPages: sessions.length > 0 ? 1 : 0,
        };

        setHistory(sessions);
        setHistoryPagination(pagination);

        return {
          success: true,
          data: sessions,
          pagination,
        };
      }

      const message = response?.message || 'Không thể lấy lịch sử phiên điểm danh';
      setHistoryError(message);
      setHistory([]);
      setHistoryPagination({ total: 0, page, limit, totalPages: 0 });
      return { success: false, error: message };
    } catch (error) {
      const message = error?.message || 'Không thể lấy lịch sử phiên điểm danh';
      setHistoryError(message);
      setHistory([]);
      setHistoryPagination({ total: 0, page, limit, totalPages: 0 });
      return { success: false, error: message };
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const clearSessionHistory = useCallback(() => {
    setHistory([]);
    setHistoryError(null);
    setHistoryPagination({
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  }, []);

  /**
   * Lấy tiến độ điểm danh của sinh viên theo học phần cụ thể (cho màn chi tiết giảng viên)
   */
  const fetchStudentAttendanceProgress = useCallback(async ({
    studentId,
    courseSectionId,
    practiceGroupId,
    semester,
    status,
    fromDate,
    toDate,
    page = 1,
    limit = 20,
  }) => {

    try {
      const params = {
        course_section_id: courseSectionId,
        page,
        limit,
      };

      if (practiceGroupId === null) {
        params.practice_group_id = 'null';
      } else if (practiceGroupId !== undefined && practiceGroupId !== '') {
        params.practice_group_id = practiceGroupId;
      }

      if (semester) params.semester = semester;
      if (status) params.status = status;
      if (fromDate) params.from_date = fromDate;
      if (toDate) params.to_date = toDate;

      const response = await AttendanceService.getStudentAttendanceHistory(studentId, params);

      if (response?.success) {
        return {
          success: true,
          data: response.data,
        };
      }

      const message = response?.message || 'Không thể lấy tiến độ điểm danh sinh viên';
      return { success: false, error: message };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Không thể lấy tiến độ điểm danh sinh viên',
      };
    }
  }, []);


  /**
   * Clear active session
   */
  const clearSession = useCallback(() => {
    setActiveSession(null);
    setCurrentQR(null);
    setSessionStats(null);
    setAttendanceResults(null);
  }, []);

  /**
   * Kiểm tra xem có phiên điểm danh đang active cho class session không
   */
  const checkActiveSession = useCallback((classSessionId) => {
    // Trước tiên, kiểm tra trong activeSessions map
    const session = getValidSession(activeSessions.get(classSessionId));
    
    if (session) {
      return session;
    }

    if (activeSessions.has(classSessionId)) {
      console.log(`Session ${classSessionId} has expired, removing...`);
      setActiveSessions(prev => {
        const newMap = new Map(prev);
        newMap.delete(classSessionId);
        return newMap;
      });
    }
    
    return null;
  }, [activeSessions, getValidSession]);

  /**
   * Đồng bộ phiên active từ server về localStorage 
   * Trả về session data nếu có, null nếu không có phiên active
   */
  const syncActiveSession = useCallback(async (classSessionId) => {
    if (!classSessionId) return null;
    try {
      const response = await AttendanceService.getActiveSessionByClassSession(classSessionId);
      if (!response?.success) return null;

      if (!response?.data) {
        // Server xác nhận không còn phiên active → xóa entry stale trong local Map
        setActiveSessions(prev => {
          if (!prev.has(classSessionId)) return prev;
          const newMap = new Map(prev);
          newMap.delete(classSessionId);
          return newMap;
        });
        return null;
      }

      const { attendanceSession, classInfo } = response.data;
      const sessionData = { ...attendanceSession, classInfo };

      setActiveSessions(prev => {
        const newMap = new Map(prev);
        newMap.set(classSessionId, sessionData);
        return newMap;
      });

      return sessionData;
    } catch (error) {
      console.error('Error syncing active session from server:', error);
      return null;
    }
  }, []);

  /**
   * Hàm lấy thông tin thời gian còn lại của phiên điểm danh, cũng như phần trăm đã trôi qua để hiển thị tiến trình
   */
  const getSessionTiming = useCallback((classSessionId = null, _clockTick = 0, options = {}) => {
    void _clockTick;
    const { fallbackToAny = true } = options;

    let targetSession = null;

    if (classSessionId) {
      targetSession = getValidSession(activeSessions.get(classSessionId));
    }

    if (!targetSession) {
      targetSession = getValidSession(activeSession);
    }

    if (!targetSession && fallbackToAny) {
      for (const session of activeSessions.values()) {
        const validSession = getValidSession(session);
        if (validSession) {
          targetSession = validSession;
          break;
        }
      }
    }

    if (!targetSession) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(targetSession.expires_at);
    const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));

    let totalSeconds = Number(targetSession.session_duration_minutes) * 60;

    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
      const startCandidate = targetSession.started_at || targetSession.created_at;

      if (startCandidate) {
        const startedAt = new Date(startCandidate);
        if (!Number.isNaN(startedAt.getTime())) {
          totalSeconds = Math.max(1, Math.floor((expiresAt - startedAt) / 1000));
        }
      }
    }

    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
      totalSeconds = Math.max(remainingSeconds, 1);
    }

    const elapsedSeconds = Math.max(0, totalSeconds - remainingSeconds);
    const progressPercent = Math.min(100, Math.max(0, (remainingSeconds / totalSeconds) * 100));

    return {
      session: targetSession,
      totalSeconds,
      elapsedSeconds,
      remainingSeconds,
      progressPercent,
    };
  }, [activeSession, activeSessions, getValidSession]);

  // Clean up expired sessions periodically
  useEffect(() => {
    const cleanupExpiredSessions = () => {
      const now = new Date();
      let hasExpired = false;
      
      const newMap = new Map(activeSessions);
      
      for (const [classSessionId, session] of newMap.entries()) {
        const expiresAt = new Date(session.expires_at);
        if (now >= expiresAt) {
          console.log(`Cleaning up expired session: ${classSessionId}`);
          newMap.delete(classSessionId);
          hasExpired = true;
        }
      }
      
      if (hasExpired) {
        setActiveSessions(newMap);
      }
    };

    // Run cleanup every 30 seconds
    const interval = setInterval(cleanupExpiredSessions, 30000);
    
    // Also run on mount
    cleanupExpiredSessions();
    
    return () => clearInterval(interval);
  }, [activeSessions]);

  const value = {
    // State
    activeSession,
    currentQR,
    sessionStats,
    attendanceResults,
    history,
    historyError,
    historyPagination,
    completedSessionSnapshots,
    setActiveSession,

    // Loading states
    createLoading,
    closeLoading,
    nextQRLoading,
    statsLoading,
    attendanceResultsLoading,
    attendanceResultsUpdating,
    historyLoading,
    
    // Actions
    createSession,
    closeSession,
    getNextQR,
    getStats,
    initializeAttendanceResults,
    updateAttendanceResult,
    fetchSessionHistory,
    fetchStudentAttendanceProgress,
    clearSessionHistory,
    clearSession,
    checkActiveSession,
    syncActiveSession,
    getSessionTiming,
    getLatestCompletedSessionSnapshot,
    fetchTeacherAttendanceDashboard,
    fetchTeacherCourseAttendanceSessions,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }
  return context;
};
