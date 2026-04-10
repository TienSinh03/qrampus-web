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
import { useState, useMemo } from 'react';
import { ROLES } from '@constants/roles';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout, user, activeRole } = useAuth();

  // Thêm state để kiểm soát chế độ thu gọn
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('2025-2026');
  const [selectedSemester, setSelectedSemester] = useState('HK2');

  const schoolYearOptions = ['2023-2024', '2024-2025', '2025-2026', '2026-2027'];
  const semesterOptions = ['HK1', 'HK2', 'Hè'];

  // Định nghĩa tất cả menu items với roles được phép truy cập
  const allMenuItems = useMemo(() => [
    // ==================== TEACHER DASHBOARD ====================
    { 
      icon: LayoutDashboard, 
      label: 'Teacher Dashboard', 
      path: '/dashboard',
      roles: [ROLES.TEACHER]
    },
    
    // ==================== TEACHER MENU ====================
    { 
      icon: Calendar, 
      label: t('sidebar.schedule'), 
      path: '/dashboard/schedule',
      roles: [ROLES.TEACHER]
    },
    { 
      icon: BarChart3, 
      label: t('sidebar.reports'), 
      path: '/dashboard/report-page',
      roles: [ROLES.TEACHER]
    },
    { 
      icon: ScanQrCode, 
      label: t('sidebar.qrcode'), 
      path: '/dashboard/qrcode',
      roles: [ROLES.TEACHER]
    },
    { 
      icon: BookOpen, 
      label: 'Quản lý Khảo sát', 
      path: '/dashboard/survey-page',
      roles: [ROLES.TEACHER]
    },
    { 
      icon: FileText, 
      label: 'Quản lý Chấm Công', 
      path: '/dashboard/timekeeping',
      roles: [ROLES.TEACHER]
    },
    { 
      icon: ImagePlus, 
      label: 'Quản lý Nghỉ phép', 
      path: '/dashboard/leave-management',
      roles: [ROLES.TEACHER]
    },
    { 
      icon: Bell, 
      label: 'Thông báo', 
      path: '/dashboard/notifications',
      roles: [ROLES.TEACHER, ROLES.ATTENDANCE_STAFF]
    },
    { 
      icon: Settings, 
      label: t('sidebar.settings'), 
      path: '/dashboard/setting',
      roles: [ROLES.TEACHER]
    },

    // ==================== ADMIN DASHBOARD & MENU ====================
    {
      icon: Bell,
      label: 'Thông báo',
      path: '/dashboard/admin/announcement',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: LayoutDashboard, 
      label: 'Admin Dashboard', 
      path: '/dashboard/admin',
      roles: [ROLES.ADMIN],
      separator: true // Thêm separator trước admin section
    },
    { 
      icon: UserCog, 
      label: 'Quản lý Tài khoản', 
      path: '/dashboard/admin/accounts',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: IdCardLanyard, 
      label: 'Quản lý Nhân sự', 
      path: '/dashboard/admin/teachers',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: Users, 
      label: 'Quản lý Sinh viên', 
      path: '/dashboard/admin/students',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: BookOpen, 
      label: 'Quản lý Khảo sát', 
      path: '/dashboard/admin/surveys',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: ScanQrCode, 
      label: 'Quản lý Điểm danh', 
      path: '/dashboard/admin/qrcode',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: BarChart, 
      label: 'Quản lý Thống kê', 
      path: '/dashboard/admin/statistics',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: FolderOpenDot, 
      label: 'Quản lý Khóa học', 
      path: '/dashboard/admin/courses',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: CalendarClock, 
      label: 'Quản lý Lịch dạy', 
      path: '/dashboard/admin/schedules',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: UserStar, 
      label: 'Quản lý Học phần', 
      path: '/dashboard/admin/enrollments',
      roles: [ROLES.ADMIN]
    },
    { 
      icon: Grid2X2, 
      label: 'Quản lý Phòng học', 
      path: '/dashboard/admin/rooms',
      roles: [ROLES.ADMIN]
    },

    // ==================== ATTENDANCE STAFF DASHBOARD ====================
    { 
      icon: LayoutDashboard, 
      label: 'Attendance Dashboard', 
      path: '/dashboard/attendance-dashboard',
      roles: [ROLES.ATTENDANCE_STAFF],
      separator: true // Thêm separator trước attendance section
    },
    {
      icon: CalendarClock,
      label: 'Quản lý Chấm Công',
      path: '/dashboard/attendance-timesheet',
      roles: [ROLES.ATTENDANCE_STAFF]
    },
    {
      icon: Calendar,
      label: 'Danh sách giảng viên',
      path: '/dashboard/attendance-teacher',
      roles: [ROLES.ATTENDANCE_STAFF]
    },
    //lịch dạy
    {
      icon: CalendarClock,
      label: 'Danh sách lLịch dạy',
      path: '/dashboard/attendance-schedule',
      roles: [ROLES.ATTENDANCE_STAFF]
    },
    //quản lý điểm danh
    {
      icon: ScanQrCode,
      label: 'Kết quả Điểm danh',
      path: '/dashboard/attendance-results',
      roles: [ROLES.ATTENDANCE_STAFF]

    }
  ], [t]);

  // Filter menu items dựa trên activeRole của user
  const menuItems = useMemo(() => {
    // Sử dụng activeRole nếu có, nếu không thì dùng tất cả roles của user
    const effectiveRoles = activeRole ? [activeRole] : (user?.roles || []);
    
    if (effectiveRoles.length === 0) {
      return [];
    }

    return allMenuItems.filter(item => {
      // Kiểm tra xem activeRole có trong danh sách roles của item không
      return item.roles.some(role => effectiveRoles.includes(role));
    });
  }, [user?.roles, activeRole, allMenuItems]);

  const userRoles = user?.roles || [];
  const isAttendanceRoleActive =
    activeRole === ROLES.ATTENDANCE_STAFF ||
    (!activeRole && userRoles.length === 1 && userRoles.includes(ROLES.ATTENDANCE_STAFF));

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
            bg-[#153898]
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
                <div className="w-11 h-11 rounded-full bg-[#153898] flex items-center justify-center text-white font-bold text-lg shadow">
                  {user?.user_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.user_name || 'User'}
                  </p>
                  {user?.roles && user.roles.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`
                            text-[10px] px-2 py-0.5 rounded-full font-medium
                            ${role === ROLES.ADMIN ? 'bg-blue-100 text-purple-700' :
                              role === ROLES.TEACHER ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'}
                          `}
                        >
                          {role === ROLES.ADMIN ? 'Admin' :
                           role === ROLES.TEACHER ? 'GV' :
                           'BPCC'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MENU */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 sidebar-scroll">
            {!isCollapsed && isAttendanceRoleActive && (
              <div className="mb-4 border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                  Năm học / Kỳ
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={selectedSchoolYear}
                    onChange={(e) => setSelectedSchoolYear(e.target.value)}
                    className="w-full  border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {schoolYearOptions.map((year) => (
                      <option key={year} value={year}>
                        Năm học {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="w-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {semesterOptions.map((semester) => (
                      <option key={semester} value={semester}>
                        Kỳ {semester}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {menuItems.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500 text-center">
                Không có menu nào khả dụng
              </div>
            ) : (
              menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                const showSeparator = item.separator && index > 0;

                return (
                  <div key={item.path}>
                    {/* Separator line */}
                    {showSeparator && !isCollapsed && (
                      <div className="my-3 border-t border-slate-200" />
                    )}
                    {showSeparator && isCollapsed && (
                      <div className="my-2" />
                    )}

                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={`
                        group relative flex items-center
                        ${isCollapsed ? 'justify-center' : 'gap-3 px-4'}
                        py-3 rounded-sm transition-all duration-200
                        ${active
                        ? 'bg-[#153898] text-white shadow-md'
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
                  </div>
                );
              })
            )}
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