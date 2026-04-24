import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Menu,
  Search,
  ChevronDown,
  UserCheck,
  UserLock,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "@contexts/AuthContext";
import { ROLE_LABELS } from "@constants/roles";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const Header = ({ toggleSidebar }) => {
  const { t } = useTranslation();
  const { user, logout, activeRole, needsRoleSelection } = useAuth();

  const navigate = useNavigate();

  const [openUserMenu, setOpenUserMenu] = useState(false);

  const getRoleDisplay = () => {
    if (activeRole) {
      return ROLE_LABELS[activeRole] || activeRole;
    }

    if (!user?.roles || user.roles.length === 0) return 'User';
    return ROLE_LABELS[user.roles[0]] || user.roles[0];
  };

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
