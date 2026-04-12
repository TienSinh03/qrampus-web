import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { toast } from 'sonner';
import leaveRequestService from '@services/leave.request.service';

const LeaveDashboardContext = createContext(null);

const DEFAULT_SUMMARY = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
};

const buildSummaryFromLeaves = (items = []) => ({
  total: items.length,
  pending: items.filter((item) => item?.status === 'pending').length,
  approved: items.filter((item) => item?.status === 'approved').length,
  rejected: items.filter((item) => item?.status === 'rejected').length,
});

export const LeaveDashboardProvider = ({ children }) => {

  const [teacher, setTeacher] = useState(null);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [semesters, setSemesters] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchLeaveDashboard = useCallback(async (forceRefresh = false) => {
    const CACHE_DURATION = 3 * 60 * 1000;

    if (!forceRefresh && lastFetched && leaves.length > 0) {
      const timeSinceLastFetch = Date.now() - lastFetched;
      if (timeSinceLastFetch < CACHE_DURATION) {
        return { success: true, data: { teacher, summary, semesters, leaves } };
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await leaveRequestService.getTeacherLeaveDashboard();

      if (!response.success) {
        const message = response.message || 'Không thể tải dữ liệu đơn nghỉ';
        setError(message);

        return { success: false, error: message };
      }

      const data = response.data || {};

      setTeacher(data.teacher || null);
      setSummary(data.summary || DEFAULT_SUMMARY);
      setSemesters(Array.isArray(data.semesters) ? data.semesters : []);
      setLeaves(Array.isArray(data.leaves) ? data.leaves : []);
      setLastFetched(Date.now());

      return { success: true, data };
    } catch (err) {
      const errorMessage = err.message || 'Đã xảy ra lỗi khi tải dữ liệu đơn nghỉ';
      setError(errorMessage);

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
      
    } finally {
      setLoading(false);
    }
  }, [lastFetched, leaves, teacher, summary, semesters]);

  const refreshLeaveDashboard = useCallback(async () => {
    return fetchLeaveDashboard(true);
  }, [fetchLeaveDashboard]);

  const approveLeaveRequest = useCallback(async (leaveRequestId) => {
    if (!leaveRequestId) {
      return { success: false, error: 'Thiếu mã đơn nghỉ' };
    }

    setActionLoadingId(leaveRequestId);

    try {
      const response = await leaveRequestService.approveLeaveRequest(leaveRequestId);

      if (!response.success) {
        const message = response.message || 'Không thể duyệt đơn nghỉ';
        toast.error(message);
        return { success: false, error: message };
      }

      const updatedLeave = response.data;

      setLeaves((prev) => {
        const nextLeaves = prev.map((item) => (item.id === updatedLeave.id ? updatedLeave : item));
        
        setSummary(buildSummaryFromLeaves(nextLeaves));

        return nextLeaves;
      });

      toast.success(response.message || 'Đã duyệt đơn nghỉ');
      return { success: true, data: updatedLeave };

    } catch (err) {
      const errorMessage = err.message || 'Không thể duyệt đơn nghỉ';
      toast.error(errorMessage);

      return { success: false, error: errorMessage };

    } finally {
      setActionLoadingId(null);
    }
  }, []);

  const rejectLeaveRequest = useCallback(async (leaveRequestId, rejectedReason) => {
    if (!leaveRequestId) {
      return { success: false, error: 'Thiếu mã đơn nghỉ' };
    }

    if (!rejectedReason || String(rejectedReason).trim().length < 10) {
      return { success: false, error: 'Lý do từ chối phải có ít nhất 10 ký tự' };
    }

    setActionLoadingId(leaveRequestId);

    try {
      const response = await leaveRequestService.rejectLeaveRequest(leaveRequestId, String(rejectedReason).trim());

      if (!response.success) {
        const message = response.message || 'Không thể từ chối đơn nghỉ';
        toast.error(message);
        return { success: false, error: message };
      }

      const updatedLeave = response.data;

      setLeaves((prev) => {
        const nextLeaves = prev.map((item) => (item.id === updatedLeave.id ? updatedLeave : item));
        
        setSummary(buildSummaryFromLeaves(nextLeaves));
        
        return nextLeaves;
      });

      toast.success(response.message || 'Đã từ chối đơn nghỉ');
      return { success: true, data: updatedLeave };

    } catch (err) {
      const errorMessage = err.message || 'Không thể từ chối đơn nghỉ';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  const clearLeaveDashboard = useCallback(() => {
    setTeacher(null);
    setSummary(DEFAULT_SUMMARY);
    setSemesters([]);
    setLeaves([]);
    setLoading(false);
    setError(null);
    setLastFetched(null);
    setActionLoadingId(null);
  }, []);

  const statistics = useMemo(() => {
    if (summary && typeof summary.total === 'number') {
      return summary;
    }

    return {
      total: leaves.length,
      pending: leaves.filter((item) => item.status === 'pending').length,
      approved: leaves.filter((item) => item.status === 'approved').length,
      rejected: leaves.filter((item) => item.status === 'rejected').length,
    };
  }, [leaves, summary]);

  const value = {
    teacher,
    summary,
    statistics,
    semesters,
    leaves,
    loading,
    actionLoadingId,
    error,
    lastFetched,
    fetchLeaveDashboard,
    refreshLeaveDashboard,
    approveLeaveRequest,
    rejectLeaveRequest,
    clearLeaveDashboard,
  };

  return (
    <LeaveDashboardContext.Provider value={value}>
      {children}
    </LeaveDashboardContext.Provider>
  );
};

export const useLeaveDashboard = () => {
  const context = useContext(LeaveDashboardContext);
  if (!context) {
    throw new Error('useLeaveDashboard must be used within a LeaveDashboardProvider');
  }
  return context;
};
