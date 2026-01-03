import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Palette,
  Menu,
  X,
  ChevronRight,
  Key,
  Globe,
  Bell,
} from "lucide-react";

/* ====== COMPONENT DÙNG CHUNG ====== */
const SettingCard = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
      {...props}
    />
  </div>
);

const Toggle = ({ label }) => (
  <label className="flex items-center justify-between">
    <span className="text-gray-700">{label}</span>
    <input type="checkbox" className="w-5 h-5 accent-purple-600" />
  </label>
);

/* ====== SETTING PAGE ====== */
const SettingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  const menuItems = [
    { id: "general", label: "Chung", icon: Settings },
    { id: "account", label: "Tài khoản", icon: User },
    { id: "privacy", label: "Bảo mật", icon: Shield },
    { id: "advanced", label: "Thông tin truy cập", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}
        >
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold flex items-center gap-3">
              <Settings className="w-6 h-6" />
              Cài đặt
            </h1>
          </div>

          <nav className="py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full px-6 py-3 flex items-center gap-4 text-left transition
                    ${
                      activeTab === item.id
                        ? "bg-purple-50 text-purple-600 border-r-4 border-purple-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ===== MAIN ===== */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* HEADER */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full" />
          </header>

          {/* CONTENT */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl font-bold text-gray-800">
                {menuItems.find((i) => i.id === activeTab)?.label}
              </h2>

              {/* ===== CHUNG ===== */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <SettingCard title="Cài đặt chung">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Ngôn ngữ" defaultValue="Tiếng Việt" />
                      <Input label="Múi giờ" defaultValue="GMT+7 (Việt Nam)" />
                    </div>
                  </SettingCard>

                  <SettingCard title="Thông báo">
                    <Toggle label="Nhận email thông báo" />
                    <Toggle label="Thông báo trên hệ thống" />
                  </SettingCard>
                </div>
              )}

              {/* ===== TÀI KHOẢN ===== */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <SettingCard title="Thông tin cá nhân">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Họ và tên" defaultValue="Nguyễn Văn A" />
                      <Input
                        label="Email"
                        defaultValue="admin@iuh.edu.vn"
                        disabled
                      />
                      <Input label="Số điện thoại" defaultValue="0123456789" />
                    </div>
                  </SettingCard>

                  <SettingCard title="Ảnh đại diện">
                    <button className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Tải ảnh mới
                    </button>
                  </SettingCard>
                </div>
              )}

              {/* ===== BẢO MẬT ===== */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <SettingCard title="Đổi mật khẩu">
                    <Input label="Mật khẩu hiện tại" type="password" />
                    <Input label="Mật khẩu mới" type="password" />
                    <Input label="Xác nhận mật khẩu" type="password" />
                    <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Cập nhật mật khẩu
                    </button>
                  </SettingCard>

                  <SettingCard title="Bảo mật nâng cao">
                    <Toggle label="Xác thực 2 lớp (2FA)" />
                    <Toggle label="Đăng xuất khỏi các thiết bị khác" />
                  </SettingCard>
                </div>
              )}

              {/* ===== THÔNG TIN TRUY CẬP ===== */}
              {activeTab === "advanced" && (
                <div className="space-y-6">
                  <SettingCard title="Thiết bị đăng nhập gần đây">
                    <ul className="divide-y">
                      <li className="py-3 flex justify-between">
                        <span>Chrome • Windows</span>
                        <span className="text-sm text-gray-500">Hôm nay</span>
                      </li>
                      <li className="py-3 flex justify-between">
                        <span>Safari • iPhone</span>
                        <span className="text-sm text-gray-500">Hôm qua</span>
                      </li>
                    </ul>
                  </SettingCard>

                  <SettingCard title="Địa chỉ IP hiện tại">
                    <p className="text-gray-700">192.168.1.10</p>
                  </SettingCard>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
