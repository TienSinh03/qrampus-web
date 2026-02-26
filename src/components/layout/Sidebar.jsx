import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Settings,
  FileText,
  BarChart3,
  Menu,
  X,
  LogOut,
  ScanQrCode,
  ImagePlus,
  Bell,
  BarChart,
  FolderCog,
  IdCardLanyard,
  UserCog,
  CalendarClock,
  FolderOpenDot,
  UserStar,
  Grid2X2,
} from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Thêm state để kiểm soát chế độ thu gọn
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Tự động mở rộng khi ở mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsCollapsed(false);
    }
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: '/dashboard' },
    { icon: Calendar, label: t('sidebar.schedule'), path: '/dashboard/schedule' },
    { icon: BarChart3, label: t('sidebar.reports'), path: '/dashboard/report-page' },
    { icon: ScanQrCode, label: t('sidebar.qrcode'), path: '/dashboard/qrcode' },
    { icon: BookOpen, label: 'Quản lý Khảo sát', path: '/dashboard/survey-page' },
    { icon: FileText, label: 'Quản lý Chấm Công', path: '/dashboard/timekeeping' },
    { icon: ImagePlus, label: 'Quản lý Nghỉ phép', path: '/dashboard/leave-management' },
    { icon: Bell, label: 'Quản lý Thông báo', path: '/dashboard/notifications' },

    { icon: Settings, label: t('sidebar.settings'), path: '/dashboard/setting' },

    // Admin section
    { icon: UserCog, label: 'Quản lý Tài khoản', path: '/dashboard/admin/accounts' },
    { icon: IdCardLanyard, label: 'Quản lý Nhân sự', path: '/dashboard/admin/teachers' },
    { icon: Users, label: 'Quản lý Sinh viên', path: '/dashboard/admin/students' },
    { icon: BookOpen, label: 'Quản lý Khảo sát', path: '/dashboard/admin/surveys' },
    { icon: ScanQrCode, label: 'Quản lý Điểm danh', path: '/dashboard/admin/qrcode' },
    { icon: BarChart, label: 'Quản lý Thống kê', path: '/dashboard/admin/statistics' },
    { icon: FolderOpenDot, label: 'Quản lý Khóa học', path: '/dashboard/admin/courses' },
    { icon: CalendarClock, label: 'Quản lý Lịch dạy', path: '/dashboard/admin/schedules' },
    { icon: UserStar, label: 'Quản lý Học phần', path: '/dashboard/admin/enrollments' },
    { icon: Grid2X2, label: 'Quản lý Phòng học', path: '/dashboard/admin/rooms' },
    { icon: Bell, label: 'Quản lý Thông báo', path: '/dashboard/admin/notifications' },


    // Attendance Department Dashboard
    { icon: FolderCog, label: 'Dashboard Attendance', path: '/dashboard/attendance-dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  // Toggle thu gọn (chỉ áp dụng trên desktop)
  const toggleCollapse = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-white/90 backdrop-blur-xl
          border-r border-slate-200
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full relative">

          {/* LOGO + Collapse Button */}
          <div className={`
            relative flex items-center 
            ${isCollapsed ? 'justify-center' : 'justify-between'} 
            px-4 py-4 border-b 
            bg-gradient-to-r from-blue-500 to-indigo-500
          `}>
            {/* Logo */}
            {isCollapsed ? (
              <img
                src="/src/assets/logo-rutgon.png" // ← Đổi thành img-1 của bạn
                alt="Logo Small"
                className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-md"
              />
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src="/assets/images/logo-qrampus.png"
                  alt="Logo"
                  className="w-10 h-10 rounded-xl bg-white p-1"
                />
                <span className="text-lg font-bold text-white tracking-wide">
                  QRampus
                </span>
              </div>
            )}

            {/* Nút thu gọn - chỉ hiện trên desktop */}
            <button
              onClick={toggleCollapse}
              className="absolute -right-4 top-5 bg-white p-1.5 shadow-lg border border-slate-200 hidden lg:block hover:bg-slate-50 transition"
              title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
            >
              {isCollapsed ? (
                <Menu className="w-5 h-5 text-slate-600" />
              ) : (
                <X className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Nút đóng trên mobile */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* USER INFO - ẩn khi thu gọn */}
          {!isCollapsed && (
            <div className="px-5 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow">
                  {user?.name?.charAt(0) || 'A'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MENU */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 sidebar-scroll">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={`
                    group relative flex items-center
                    ${isCollapsed ? 'justify-center' : 'gap-3 px-4'}
                    py-3 rounded-sm transition-all duration-200
                    ${active
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined} // tooltip khi thu gọn
                >
                  {/* Active indicator */}
                  {active && !isCollapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}

                  <Icon
                    className={`
                      w-6 h-6 shrink-0
                      ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}
                    `}
                  />

                  {!isCollapsed && (
                    <span className="font-medium truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* LOGOUT - cũng thu gọn */}
          <div className="px-4 py-4 border-t">
            <button
              onClick={logout}
              className={`
                flex items-center w-full rounded-sm transition
                ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'}
                text-red-600 hover:bg-red-50
              `}
              title={isCollapsed ? t('common.logout') : undefined}
            >
              <LogOut className="w-6 h-6" />
              {!isCollapsed && (
                <span className="font-medium">{t('common.logout')}</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;