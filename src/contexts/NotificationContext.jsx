/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from '@contexts/AuthContext';
import notificationService from '@services/notification.service';
import {
  connectAppSocket,
  disconnectAppSocket,
  emitSocketEvent,
  subscribeSocketEvent,
} from '@/socket/appSocket';
import { toast } from 'sonner';

const NotificationContext = createContext(null);

const DEFAULT_PAGINATION = {
  total: 0,
  offset: 0,
  limit: 20,
  totalPages: 0,
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const notificationsRef = useRef([]);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  const resetState = useCallback(() => {
    setNotifications([]);
    setPagination(DEFAULT_PAGINATION);
    setUnreadCount(0);
    setLoading(false);
    setLoadingMore(false);
    setError(null);
    setSocketConnected(false);
  }, []);

  const fetchNotifications = useCallback(async (params = {}) => {
    if (!isAuthenticated) {
      return { success: false, error: 'Unauthenticated' };
    }

    const normalizedParams = {
      limit: Number(params.limit ?? 20),
      offset: Number(params.offset ?? 0),
      unread: params.unread,
      type: params.type,
    };

    const isLoadMore = normalizedParams.offset > 0;

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const response = await notificationService.getNotifications(normalizedParams);

      if (!response?.success) {
        const message = response?.message || 'Khong the tai danh sach thong bao';
        setError(message);
        return { success: false, error: message };
      }

      const payload = response.data || {};
      const incomingNotifications = Array.isArray(payload.notifications)
        ? payload.notifications
        : [];

      if (normalizedParams.offset > 0) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const nextItems = incomingNotifications.filter((item) => !existingIds.has(item.id));
          return [...prev, ...nextItems];
        });
      } else {
        setNotifications(incomingNotifications);
      }

      setPagination(payload.pagination || DEFAULT_PAGINATION);
      setUnreadCount(Number(payload.unreadCount) || 0);

      return { success: true, data: payload };
    } catch (err) {
      const errorMessage = err.message || 'Da xay ra loi khi tai thong bao';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [isAuthenticated]);

  const loadMoreNotifications = useCallback(async () => {
    if (loading || loadingMore) {
      return { success: false, error: 'Loading in progress' };
    }

    const total = Number(pagination.total || 0);
    const loaded = notificationsRef.current.length;

    if (total > 0 && loaded >= total) {
      return { success: false, error: 'No more notifications' };
    }

    const nextLimit = Number(pagination.limit || 20);
    const nextOffset = loaded;

    return fetchNotifications({
      limit: nextLimit,
      offset: nextOffset,
    });
  }, [fetchNotifications, loading, loadingMore, pagination.total, pagination.limit]);

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const response = await notificationService.getUnreadCount();

      if (!response?.success) {
        return;
      }

      const nextUnreadCount = Number(response?.data?.unreadCount) || 0;
      setUnreadCount(nextUnreadCount);
    } catch {
      // no-op: keep current badge count if request fails
    }
  }, [isAuthenticated]);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    if (!notificationId) {
      return { success: false, error: 'Missing notificationId' };
    }

    try {
      const response = await notificationService.markAsRead(notificationId);

      if (!response?.success) {
        const message = response?.message || 'Khong the danh dau da doc';
        return { success: false, error: message };
      }

      const target = notificationsRef.current.find((item) => item.id === notificationId);

      setNotifications((prev) => prev.map((item) => (
        item.id === notificationId ? { ...item, is_read: true } : item
      )));

      if (target && !target.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Khong the danh dau da doc' };
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      const response = await notificationService.markAllAsRead();

      if (!response?.success) {
        const message = response?.message || 'Khong the danh dau tat ca da doc';
        return { success: false, error: message };
      }

      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Khong the danh dau tat ca da doc' };
    }
  }, []);

  const sendSocketEvent = useCallback((eventName, payload) => {
    return emitSocketEvent(eventName, payload);
  }, []);

  const handleSocketNewNotification = useCallback((payload) => {
    if (!payload?.id) {
      return;
    }

    const isDuplicate = notificationsRef.current.some((item) => item.id === payload.id);

    if (isDuplicate) {
      return;
    }

    const normalizedNotification = {
      ...payload,
      is_read: Boolean(payload.is_read),
    };

    setNotifications((prev) => [normalizedNotification, ...prev]);

    setPagination((prev) => ({
      ...prev, total: Number(prev.total || 0) + 1,
    }));

    if (!normalizedNotification.is_read) {
      setUnreadCount((prev) => prev + 1);
    }

    toast.success('Bạn có thông báo mới');

  }, []);

  const handleSocketReadStatus = useCallback((payload) => {
    const notificationId = payload?.notification_id;

    if (!notificationId) {
      return;
    }

    if (notificationId === '*') {
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
      setUnreadCount(0);
      return;
    }

    const target = notificationsRef.current.find((item) => item.id === notificationId);

    setNotifications((prev) => prev.map((item) => (
      item.id === notificationId ? { ...item, is_read: true } : item
    )));

    if (target && !target.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (!isAuthenticated || !accessToken) {
      disconnectAppSocket();
      resetState();
      return undefined;
    }

    fetchNotifications();
    refreshUnreadCount();

    const socket = connectAppSocket(accessToken);
    setSocketConnected(Boolean(socket?.connected));

    const unsubscribeConnect = subscribeSocketEvent('connect', () => {
      setSocketConnected(true);
      refreshUnreadCount();
    });

    const unsubscribeDisconnect = subscribeSocketEvent('disconnect', () => {
      setSocketConnected(false);
    });

    const unsubscribeReconnect = subscribeSocketEvent('reconnect', () => {
      refreshUnreadCount();
      fetchNotifications();
    });

    const unsubscribeNew = subscribeSocketEvent('notification:new', handleSocketNewNotification);
    const unsubscribeRead = subscribeSocketEvent('notification:read', handleSocketReadStatus);

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeReconnect();
      unsubscribeNew();
      unsubscribeRead();
      disconnectAppSocket();
    };
  }, [
    isAuthenticated,
    fetchNotifications,
    refreshUnreadCount,
    handleSocketNewNotification,
    handleSocketReadStatus,
    resetState,
  ]);

  const value = useMemo(() => ({
    notifications,
    pagination,
    unreadCount,
    loading,
    loadingMore,
    error,
    socketConnected,
    fetchNotifications,
    loadMoreNotifications,
    refreshUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendSocketEvent,
  }), [
    notifications,
    pagination,
    unreadCount,
    loading,
    loadingMore,
    error,
    socketConnected,
    fetchNotifications,
    loadMoreNotifications,
    refreshUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendSocketEvent,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
};
