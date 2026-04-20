import { createContext, useCallback, useContext, useState } from 'react';
import { toast } from 'sonner';
import surveyService from '@services/survey.service';

const SurveyDashboardContext = createContext(null);

const DEFAULT_SUMMARY = {
  total_students_targeted: 0,
  total_students_participated: 0,
  participation_rate_percent: 0,
  average_rating: 0,
  surveyed_course_sections: 0,
  surveyed_targets: 0,
};

export const SurveyDashboardProvider = ({ children }) => {
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchSurveyStatistics = useCallback(async (forceRefresh = false) => {
    const CACHE_DURATION = 2 * 60 * 1000;

    if (!forceRefresh && lastFetched) {
      const timeSinceLastFetch = Date.now() - lastFetched;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { success: true, data: { summary, items } };
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await surveyService.getTeacherSurveyStatistics();

      if (!response.success) {
        const message = response.message || 'Không thể tải thống kê khảo sát';
        setError(message);
        return { success: false, error: message };
      }

      const payload = response.data || {};
      const nextSummary = payload.summary || DEFAULT_SUMMARY;
      const nextItems = Array.isArray(payload.items) ? payload.items : [];

      setSummary({ ...DEFAULT_SUMMARY, ...nextSummary });
      setItems(nextItems);
      setLastFetched(Date.now());

      return {
        success: true,
        data: {
          summary: { ...DEFAULT_SUMMARY, ...nextSummary },
          items: nextItems,
        },
      };
    } catch (err) {
      const message = err.message || 'Đã có lỗi khi tải thống kê khảo sát';
      setError(message);
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [items, lastFetched, summary]);

  const refreshSurveyStatistics = useCallback(async () => {
    return fetchSurveyStatistics(true);
  }, [fetchSurveyStatistics]);

  const clearSurveyStatistics = useCallback(() => {
    setSummary(DEFAULT_SUMMARY);
    setItems([]);
    setLoading(false);
    setError(null);
    setLastFetched(null);
  }, []);

  const value = {
    summary,
    items,
    loading,
    error,
    lastFetched,
    fetchSurveyStatistics,
    refreshSurveyStatistics,
    clearSurveyStatistics,
  };

  return (
    <SurveyDashboardContext.Provider value={value}>
      {children}
    </SurveyDashboardContext.Provider>
  );
};

export const useSurveyDashboard = () => {
  const context = useContext(SurveyDashboardContext);
  if (!context) {
    throw new Error('useSurveyDashboard must be used within a SurveyDashboardProvider');
  }
  return context;
};
