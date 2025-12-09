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
} from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: '/dashboard' },
    { icon: Users, label: t('sidebar.users'), path: '/dashboard/users' },
    { icon: Calendar, label: t('sidebar.schedule'), path: '/dashboard/schedule' },
    { icon: BarChart3, label: t('sidebar.reports'), path: '/dashboard/reports' },
    { icon: ScanQrCode, label: t('sidebar.qrcode'), path: '/dashboard/qrcode' },
    { icon: BookOpen, label: 'Quản lý Khảo sát', path: '/dashboard/survey-page' },
    // 
    // chấm Công
    { icon: FileText, label: 'Quản lý Chấm Công', path: '/dashboard/timekeeping' },
    // quản lý nghỉ phép
    { icon: ImagePlus, label: 'Quản lý Nghỉ phép', path: '/dashboard/leave-management' },
    //thông báo
    { icon: Bell, label: 'Quản lý Thông báo', path: '/dashboard/notifications' },


    { icon: Settings, label: t('sidebar.settings'), path: '/dashboard/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
          w-64
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <img src="/assets/images/logo-qrampus.png" alt="Logo" className="w-12 h-12 rounded-2xl" />
              <span className="text-xl font-bold text-gray-800">QRampus</span>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
