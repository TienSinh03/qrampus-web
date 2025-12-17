import React, { useState } from "react";
import {
    Mail,
    Star,
    Send,
    Archive,
    Trash2,
    Search,
    MoreVertical,
    Menu,
    X,
    AlertCircle,
    Clock,
    CheckCircle2,
    Info,
    Settings,
    Bell,
    Shield,
    Palette,
    Globe,
    Key,
    User,
    Moon,
    Sun,
    ChevronRight,

} from "lucide-react";

const SettingPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    // Toggle dark mode cho toàn bộ trang (bạn có thể kết hợp với Tailwind dark mode)
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const menuItems = [
        { id: "general", label: "Chung", icon: Settings },
        { id: "account", label: "Tài khoản", icon: User },
        { id: "privacy", label: "Bảo mật", icon: Shield },
        { id: "advanced", label: "Thông tin truy cập", icon: Palette },
    ];

    return (
        <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"} transition-colors`}>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <div
                    className={`${sidebarOpen ? "w-64" : "w-0"
                        } transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col`}
                >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <Settings className="w-8 h-8" />
                            Cài đặt
                        </h1>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full px-6 py-3 flex items-center gap-4 text-left transition-colors ${activeTab === item.id
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                    {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-5 flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full" />
                        </div>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
                                {menuItems.find((i) => i.id === activeTab)?.label || "Cài đặt"}
                            </h2>

                            {/* Ví dụ nội dung cho tab "Giao diện" */}
                            {activeTab === "appearance" && (
                                <div className="space-y-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
                                            <Palette className="w-5 h-5 text-blue-600" />
                                            Chế độ tối
                                        </h3>
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-700 dark:text-gray-300">Bật chế độ tối</span>
                                            <input
                                                type="checkbox"
                                                checked={darkMode}
                                                onChange={(e) => setDarkMode(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className="relative">
                                                <div className="w-14 h-8 bg-gray-300 rounded-full shadow-inner"></div>
                                                <div
                                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transform transition-transform ${darkMode ? "translate-x-6 bg-gray-800" : ""
                                                        }`}
                                                ></div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                        <h3 className="text-lg font-semibold mb-4">Màu chủ đạo</h3>
                                        <div className="grid grid-cols-5 gap-4">
                                            {["blue", "emerald", "purple", "rose", "amber"].map((color) => (
                                                <button
                                                    key={color}
                                                    className={`w-full h-16 rounded-lg bg-${color}-500 hover:scale-110 transition-transform`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Các tab khác bạn có thể thêm nội dung tương tự */}
                            {activeTab === "general" && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-8 text-center">
                                    <Settings className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Chọn một mục cài đặt ở bên trái để bắt đầu.
                                    </p>
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