import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import personnelService from '@services/personnel.service';
import { useAuth } from '@contexts/AuthContext';

const PersonnelProfileContext = createContext(null);

export const PersonnelProfileProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const [ teachers, setTeachers ] = useState([]);
  const [ teachersPagination, setTeachersPagination ] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [ teachersLoading, setTeachersLoading ] = useState(false);
  const [ teachersError, setTeachersError ] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setLoading(false);
      setError(null);
      setLastFetched(null);
    }
  }, [isAuthenticated]);

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    const CACHE_DURATION = 5 * 60 * 1000;

    if (!forceRefresh && profile && lastFetched) {
      const timeSinceLastFetch = Date.now() - lastFetched;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { success: true, data: profile };
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await personnelService.getProfile();

      if (response?.success) {
        const normalizedProfile = response.data || null;

        setProfile(normalizedProfile);
        setLastFetched(Date.now());

        return { success: true, data: normalizedProfile };
      }

      const message = response?.message || 'Khong the tai thong tin giang vien';
      setError(message);

      return { success: false, error: message };
    } catch (err) {
      const errorMessage = err.message || 'Da xay ra loi khi tai thong tin giang vien';
      setError(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [profile, lastFetched]);

  const refreshProfile = useCallback(async () => {
    return fetchProfile(true);
  }, [fetchProfile]);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setLoading(false);
    setError(null);
    setLastFetched(null);
  }, []);

  const fetchTeachers = useCallback(async (params = {}) => {
    setTeachersLoading(true);
    setTeachersError(null);
    try {
      const response = await personnelService.getAllTeachers(params);
      if (response?.success) {
        setTeachers(response.data.teachers || []);
        setTeachersPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
        return { success: true, data: response.data };
      }
      const message = response?.message || 'Không thể tải danh sách giảng viên';
      setTeachersError(message);
      return { success: false, error: message };

    } catch (error) {
      const errorMessage = error.message || 'Không thể tải danh sách giảng viên';
      setTeachersError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setTeachersLoading(false);
    }
  }, []);

  const refreshTeachers = useCallback(async (params) => {
    return fetchTeachers(params);
  }, [fetchTeachers]);

  const value = useMemo(() => ({
    profile,
    loading,
    error,
    lastFetched,
    fetchProfile,
    refreshProfile,
    clearProfile,
    teachers,
    teachersPagination,
    teachersLoading,
    teachersError,
    fetchTeachers,
    refreshTeachers,
  }), [profile, loading, error, lastFetched, fetchProfile, refreshProfile, clearProfile, teachers, teachersPagination, teachersLoading, teachersError, fetchTeachers, refreshTeachers]);

  return (
    <PersonnelProfileContext.Provider value={value}>
      {children}
    </PersonnelProfileContext.Provider>
  );
};

export const usePersonnelProfile = () => {
  const context = useContext(PersonnelProfileContext);

  if (!context) {
    throw new Error('usePersonnelProfile must be used within a PersonnelProfileProvider');
  }

  return context;
};
