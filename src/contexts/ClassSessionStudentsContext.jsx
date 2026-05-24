import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import teacherService from '@services/teacher.service';
import { toast } from 'sonner';

const ClassSessionStudentsContext = createContext(null);

export const ClassSessionStudentsProvider = ({ children }) => {
  const [studentsData, setStudentsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [currentClassSessionId, setCurrentClassSessionId] = useState(null);

  /**
   * Fetch students for a class session
   */
  const fetchStudents = useCallback(async (classSessionId, params = {}, forceRefresh = false) => {
    if (!classSessionId) {
      setError('Class session ID is required');
      return { success: false, error: 'Class session ID is required' };
    }

    // Skip if same session and data is fresh (within 5 minutes)
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    if (
      !forceRefresh &&
      currentClassSessionId === classSessionId &&
      studentsData &&
      lastFetched
    ) {
      const timeSinceLastFetch = Date.now() - lastFetched;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { success: true, data: studentsData };
      }
    }

    setLoading(true);
    setError(null);
    setCurrentClassSessionId(classSessionId);

    try {
      const response = await teacherService.getClassSessionStudents(classSessionId, params);
      
      if (response.success) {
        setStudentsData(response.data);
        setLastFetched(Date.now());
        return { success: true, data: response.data };
      }
      
      const errorMsg = 'Không thể tải danh sách sinh viên';
      setError(errorMsg);
      return { success: false, error: errorMsg };

    } catch (err) {
      const errorMessage = err.message || 'Đã xảy ra lỗi khi tải danh sách sinh viên';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setLoading(false);
    }
  }, [currentClassSessionId, studentsData, lastFetched]);

  /**
   * Refresh students (force fetch)
   */
  const refreshStudents = useCallback(async (classSessionId, params = {}) => {
    return fetchStudents(classSessionId, params, true);
  }, [fetchStudents]);

  /**
   * Clear students data
   */
  const clearStudents = useCallback(() => {
    setStudentsData(null);
    setLastFetched(null);
    setError(null);
    setCurrentClassSessionId(null);
  }, []);

  /**
   * Get students list
   */
  const students = useMemo(() => {
    return studentsData?.students || [];
  }, [studentsData]);

  /**
   * Get total students count
   */
  const totalStudents = useMemo(() => {
    return studentsData?.totalStudents || 0;
  }, [studentsData]);


  const value = {
    studentsData,
    students,
    totalStudents,
    loading,
    error,
    lastFetched,
    currentClassSessionId,
    fetchStudents,
    refreshStudents,
    clearStudents,
  };

  return (
    <ClassSessionStudentsContext.Provider value={value}>
      {children}
    </ClassSessionStudentsContext.Provider>
  );
};

/**
 * Custom hook to use Class Session Students Context
 */
export const useClassSessionStudents = () => {
  const context = useContext(ClassSessionStudentsContext);
  if (!context) {
    throw new Error('useClassSessionStudents must be used within a ClassSessionStudentsProvider');
  }
  return context;
};
