import { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [openUserMenu, setOpenUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Profile + Dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2"
              onClick={() => setOpenUserMenu((prev) => !prev)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || 'Admin'}
                </p>
              </div>
            </div>

            {openUserMenu && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>

                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    console.log('Thông tin tài khoản');
                  }}
                >
                  Thông tin tài khoản
                </button>

                <button
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    console.log('Đổi mật khẩu');
                  }}
                >
                  Đổi mật khẩu
                </button>

                <button
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    // TODO: gọi hàm logout từ AuthContext
                    console.log('Logout');
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
