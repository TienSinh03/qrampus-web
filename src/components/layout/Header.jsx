import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Bell,
  Search,
  MessageSquare,
  CheckCircle,
  BarChart3,
  Rocket,
  Mail,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';

const Header = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  // Số thông báo chưa đọc (bạn có thể lấy từ API sau)
  const unreadCount = 2;

  const notifications = [
    {
      id: 1,
      maHP: "INT3306",
      lop: "20TCLC_DT3",
      title: "Hạn chót nộp bài tập lớn – Nhóm 5 chưa nộp",
      desc: "Nhóm 5 (21010611...) chưa nộp bài tập lớn môn INT3306",
      time: "02:46",
      sender: "Hệ thống Moodle",
      unread: true,
      label: "urgent",
      initials: "HM",
      icon: <Rocket className="w-4 h-4 text-red-600" />,
    },
    {
      id: 2,
      maHP: "WEB301",
      lop: "21TCLC_DT1",
      title: "Phản hồi bài kiểm tra giữa kỳ đã được gửi",
      desc: "Em cảm ơn thầy đã chấm bài rất chi tiết...",
      time: "02:58",
      sender: "Nguyễn Văn A",
      unread: true,
      label: "personal",
      initials: "NA",
      icon: <CheckCircle className="w-4 h-4 text-green-600" />,
    },
    {
      id: 3,
      maHP: "INT3306",
      lop: "20TCLC_DT3",
      title: "Thông báo nghỉ học – Trần Thị Bình",
      desc: "Em xin phép nghỉ buổi hôm nay do bị ốm...",
      time: "04:04",
      sender: "Trần Thị Bình",
      unread: false,
      label: "important",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
    },
    {
      id: 4,
      maHP: "AI402",
      lop: "22TCLC_AI1",
      title: "Câu hỏi về đề cương môn AI",
      desc: "Thầy ơi phần CNN có thi không ạ?",
      time: "06:02",
      sender: "Lê Văn Cường",
      unread: false,
      label: "question",
      initials: "LC",
      icon: <MessageSquare className="w-4 h-4 text-indigo-600" />,
    },
    {
      id: 5,
      maHP: "PRJ301",
      lop: "21TCLC_DT5",
      title: "Lịch bảo vệ đồ án đợt 1",
      desc: "Lịch bảo vệ đã được xếp, xem chi tiết...",
      time: "06:12",
      sender: "Phòng Đào tạo",
      unread: false,
      label: "official",
      initials: "PT",
      icon: <BarChart3 className="w-4 h-4 text-purple-600" />,
    },
    {
      id: 6,
      maHP: "INT3306",
      lop: "20TCLC_DT3",
      title: "Slide buổi 12 đã cập nhật",
      desc: "Đã upload slide React Native lên Drive",
      time: "07:25",
      sender: "Bạn (giáo viên)",
      unread: false,
      label: "info",
      initials: "GV",
      icon: <Rocket className="w-4 h-4 text-indigo-500" />,
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 bg">
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
              placeholder={t('common.search') || 'Tìm kiếm...'}
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
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-purple-600 rounded-full">
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
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-3 py-1 text-xs font-bold text-white bg-purple-600 rounded-full">
                          {unreadCount} New
                        </span>
                      )}
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif, index) => (
                        <div
                          key={notif.id || index}
                          className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
                        >
                          {/* Avatar or Initials */}
                          {notif.avatar ? (
                            <img
                              src={notif.avatar}
                              alt=""
                              className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 flex-shrink-0">
                              {notif.initials}
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-semibold text-gray-900">
                                {notif.title}
                              </p>
                              {notif.icon}
                            </div>
                            {notif.desc && (
                              <p className="text-sm text-gray-600 mt-0.5">{notif.desc}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>

                          {/* Unread dot */}
                          {index < unreadCount && (
                            <div className="w-2.5 h-2.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-100">
                      <button className="w-full py-3 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition">
                        View All Notifications
                      </button>
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
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">{user?.role || 'Administrator'}</p>
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/account-setting')}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100"
                  >
                    Hồ sơ cá nhân
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100">
                    Đổi mật khẩu
                  </button>
                  <hr className="my-1" />
                  <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    Đăng xuất
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