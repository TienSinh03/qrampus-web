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

  const value = useMemo(() => ({
    profile,
    loading,
    error,
    lastFetched,
    fetchProfile,
    refreshProfile,
    clearProfile,
  }), [profile, loading, error, lastFetched, fetchProfile, refreshProfile, clearProfile]);

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
