import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu,
  Bell,
  Search,
  MessageSquare,
  CheckCircle,
  Mail,
  AlertCircle,
  Loader2,
  ChevronDown,
  UserCheck,
  UserLock,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@contexts/AuthContext";
import { useNotification } from "@contexts/NotificationContext";
import { ROLE_LABELS } from "@constants/roles";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import DOMPurify from 'dompurify';

const formatNotificationTime = (sentAt) => {
  if (!sentAt) return "--:--";

  const date = new Date(sentAt);
  if (Number.isNaN(date.getTime())) return "--:--";

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getNotificationInitials = (notification) => {
  const source =
    notification?.metadata?.student_name ||
    notification?.title ||
    "TB";

  const parts = String(source).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "TB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getNotificationIcon = (notification) => {
  if (notification?.type === "leave_request") {
    return <MessageSquare className="w-4 h-4 text-blue-600" />;
  }

  if (notification?.type === "attendance_success") {
    return <CheckCircle className="w-4 h-4 text-emerald-600" />;
  }

  if (notification?.priority === "high") {
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  }

  return <Mail className="w-4 h-4 text-slate-600" />;
};

const Header = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const { user, logout, activeRole, needsRoleSelection } = useAuth();
  const {
    notifications,
    pagination,
    unreadCount,
    loading: notificationsLoading,
    loadingMore: notificationsLoadingMore,
    fetchNotifications,
    loadMoreNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useNotification();

  const navigate = useNavigate();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  // Helper function to format role display 
  const getRoleDisplay = () => {
    if (activeRole) {
      return ROLE_LABELS[activeRole] || activeRole;
    }

    if (!user?.roles || user.roles.length === 0) return 'User';
    return ROLE_LABELS[user.roles[0]] || user.roles[0];
  };

  useEffect(() => {
    if (!openNotif) {
      return;
    }

    fetchNotifications({ limit: 20, offset: 0 });
  }, [openNotif, fetchNotifications]);

  const handleNotificationScroll = useCallback((event) => {
    const element = event.currentTarget;
    const threshold = 24;

    const reachedBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - threshold;

    if (!reachedBottom || notificationsLoading || notificationsLoadingMore) {
      return;
    }

    const total = Number(pagination?.total || 0);

    if (notifications.length >= total) {
      return;
    }

    loadMoreNotifications();
  }, [
    notificationsLoading,
    notificationsLoadingMore,
    pagination?.total,
    notifications.length,
    loadMoreNotifications,
  ]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 bg z-60">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t("common.search") || "Tìm kiếm..."}
              className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setOpenNotif(!openNotif)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-[#153898] rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Notifications */}
            {openNotif && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenNotif(false)}
                />
                <div className="absolute right-0 mt-3 w-96 z-50">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Thông báo của bạn
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-3 py-1 text-xs font-bold text-white bg-[#153898] rounded-full">
                          {unreadCount}  thông báo mới
                        </span>
                      )}
                    </div>

                    {/* List */}
                    <div
                      className="max-h-96 overflow-y-auto"
                      onScroll={handleNotificationScroll}
                    >
                      {notificationsLoading && notifications.length === 0 && (
                        <div className="px-6 py-8 flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang tải thông báo...
                        </div>
                      )}

                      {!notificationsLoading && notifications.length === 0 && (
                      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="mb-3 text-gray-300">
                          <img
                            src="/assets/images/svg_notification.svg"
                            alt="Không có thông báo"
                            className="w-24 h-24 object-contain"
                          />
                        </div>
                        
                        <p className="text-sm text-gray-500">Chưa có thông báo</p>
                      </div>
                      )}

                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={() => {
                            if (!notif.is_read) {
                              markNotificationAsRead(notif.id);
                            }
                          }}
                          className={`w-full text-left flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${
                            notif.is_read ? "bg-white" : "bg-blue-100/50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                            {getNotificationInitials(notif)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                                {notif.title}
                              </p>
                              {getNotificationIcon(notif)}
                            </div>
                            <div className="flex flex-row justify-between">

                              {notif.message && (
                                  <p 
                                    className="text-sm text-gray-600 mt-0.5 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notif.message) }}
                                  />
                              )}

                              {!notif.is_read && (
                                <div className="w-2.5 h-2.5 bg-blue-900 rounded-full mt-2 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatNotificationTime(notif.sent_at)}
                            </p>
                          </div>

                        </button>
                      ))}

                      {notificationsLoadingMore && notifications.length > 0 && (
                        <div className="px-6 py-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Đang tải thêm thông báo...
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => navigate("/dashboard/notifications")}
                          className="w-full py-3 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl transition"
                        >
                          Xem tất cả thông báo
                        </button>
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllNotificationsAsRead}
                            className="w-full py-2.5 text-sm font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition"
                          >
                            Đánh dấu tất cả đã đọc
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition"
            >
              <div className="w-9 h-9 bg-[#153898] rounded-full flex items-center justify-center text-white font-bold">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{(user?.full_name || user?.name || user?.user_name || "A").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.user_name || user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleDisplay()}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
            </button>

            {/* User Dropdown */}
            {openUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenUserMenu(false)}
                />
                <div
                  className="
                    fixed bottom-0 left-0 right-0 
                    sm:absolute sm:bottom-auto sm:right-0 sm:left-auto sm:mt-2
                    w-full sm:w-60
                    bg-white rounded-t-2xl sm:rounded-xl
                    shadow-2xl border border-gray-200
                    z-50 overflow-hidden
                  "
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm">
                      Chào mừng đã trở lại
                    </p>
                  </div>

                  {/* Menu Item */}
                  <button
                    onClick={() => navigate("/dashboard/account-setting")}
                    className="w-full flex items-center gap-3 
                              px-4 py-3 text-sm 
                              hover:bg-gray-100 transition"
                  >
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span className="truncate">Hồ sơ cá nhân</span>
                  </button>

                  <button
                    onClick={() => navigate("/dashboard/change-password")}
                    className="w-full flex items-center gap-3 
                              px-4 py-3 text-sm 
                              hover:bg-gray-100 transition"
                  >
                    <UserLock className="w-4 h-4 shrink-0" />
                    <span className="truncate">Đổi mật khẩu</span>
                  </button>

                  {needsRoleSelection() && (
                    <button
                      onClick={() => navigate("/role")}
                      className="w-full flex items-center gap-3 
                                px-4 py-3 text-sm 
                                hover:bg-gray-100 transition"
                    >
                      <ArrowLeftRight className="w-4 h-4 shrink-0" />
                      <span className="truncate">Đổi vai trò</span>
                    </button>
                  )}

                  <div className="border-t border-gray-100" />

                  <button
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full flex items-center gap-3 
                              px-4 py-3 text-sm 
                              text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="truncate">Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
