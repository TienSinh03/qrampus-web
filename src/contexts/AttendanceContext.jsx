import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AttendanceService from '@services/attendance.service';
import { toast } from 'sonner';

const AttendanceContext = createContext(null);

const ACTIVE_SESSIONS_KEY = 'attendance_active_sessions';

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
  
  // Loading states
  const [createLoading, setCreateLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [nextQRLoading, setNextQRLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Session stats
  const [sessionStats, setSessionStats] = useState(null);
  
  // History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    try {
      const sessionsArray = Array.from(activeSessions.entries());
      localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessionsArray));
    } catch (error) {
      console.error('Error saving active sessions to localStorage:', error);
    }
  }, [activeSessions]);

  // Listen to localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === ACTIVE_SESSIONS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setActiveSessions(new Map(parsed));
        } catch (error) {
          console.error('Error syncing active sessions from other tab:', error);
        }
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
  const closeSession = useCallback(async (sessionId) => {
    setCloseLoading(true);
    try {
      const response = await AttendanceService.closeAttendanceSession(sessionId);

      if (response.success) {
        // xóa phiên hiện tại nếu đúng phiên đang active
        setActiveSession(null);
        setCurrentQR(null);
        setSessionStats(null);
        
        if (activeSession?.class_session_id) {
          setActiveSessions(prev => {
            const newMap = new Map(prev);
            newMap.delete(activeSession.class_session_id);
            return newMap;
          });
        }
        
        toast.success('Đóng phiên điểm danh thành công');

        return response.data;
      } else {
        toast.error(response.message || 'Đóng phiên điểm danh thất bại');
        return null;
      }
    } catch (error) {
      const errorMessage = error.message || 'Đóng phiên điểm danh thất bại';
      toast.error(errorMessage);
      console.error('Close session error:', error);
      return null;
    } finally {
      setCloseLoading(false);
    }
  }, [activeSession]);

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
      const errorMessage = error.message || 'Tạo QR mới thất bại';
      toast.error(errorMessage);
      console.error('Get next QR error:', error);
      return null;
    } finally {
      setNextQRLoading(false);
    }
  }, []);



  /**
   * Kiểm tra xem có phiên điểm danh đang active cho class session không
   */
  const checkActiveSession = useCallback((classSessionId) => {
    // Trước tiên, kiểm tra trong activeSessions map
    const session = activeSessions.get(classSessionId);
    
    if (session) {

      const now = new Date();
      const expiresAt = new Date(session.expires_at);
      
      if (now < expiresAt) {
        return session;

      } else {
        console.log(`Session ${classSessionId} has expired, removing...`);
        setActiveSessions(prev => {
          const newMap = new Map(prev);
          newMap.delete(classSessionId);
          return newMap;
        });

        return null;
      }
    }
    
    return null;
  }, [activeSessions]);

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
    history,
    setActiveSession,

    // Loading states
    createLoading,
    closeLoading,
    nextQRLoading,
    statsLoading,
    historyLoading,
    
    // Actions
    createSession,
    closeSession,
    getNextQR,
    checkActiveSession,
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
