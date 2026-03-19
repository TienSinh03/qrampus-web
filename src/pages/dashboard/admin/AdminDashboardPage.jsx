import React, { useEffect, useMemo, useState } from "react";
import {
  Users, GraduationCap, BookOpen, Building2, FileText, AlertCircle,
  TrendingUp, Activity, CheckCircle, AlertTriangle, ArrowUpRight,
  ArrowDownRight, Calendar, BarChart3, Hand
} from "lucide-react";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import reportService from "@services/report.service";

// --- Sub-Components ---
const GrowthIndicator = ({ growth }) => {
  const n = Number(growth || 0);
  const isPositive = n > 0;
  const isNegative = n < 0;

  if (isPositive || isNegative) {
    return (
      <div className="flex items-center gap-1">
        {isPositive ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
        <span className={`text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? `+${n.toFixed(1)}%` : `${n.toFixed(1)}%`}
        </span>
        <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-gray-500 font-medium">Không đổi</span>
      <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
    </div>
  );
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState({
    students: { total: 0, growth: 0 },
    teachers: { total: 0, growth: 0 },
    courses: { total: 0, growth: 0 },
    rooms: { total: 0, growth: 0 },
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoadingStats(true);
        const response = await reportService.getDashboardStats();
        if (response?.success && response?.data) {
          setDashboardStats({
            students: { total: response.data.students?.total || 0, growth: response.data.students?.growth || 0 },
            teachers: { total: response.data.teachers?.total || 0, growth: response.data.teachers?.growth || 0 },
            courses: { total: response.data.courses?.total || 0, growth: response.data.courses?.growth || 0 },
            rooms: { total: response.data.rooms?.total || 0, growth: response.data.rooms?.growth || 0 },
          });
        } else {
          setStatsError("Không thể tải thống kê dashboard");
        }
      } catch (error) {
        setStatsError(error.message || "Lỗi kết nối hệ thống");
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchDashboardStats();
  }, []);

  // 1. Cấu hình các Card chính dùng .map()
  const statCardsConfigs = useMemo(() => [
    {
      label: "Tổng sinh viên",
      value: dashboardStats.students.total,
      growth: dashboardStats.students.growth,
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600",
      path: "/dashboard/admin/students",
      title: "Tổng số sinh viên trong hệ thống",
      isCurrency: false
    },
    {
      label: "Tổng giảng viên",
      value: dashboardStats.teachers.total,
      growth: dashboardStats.teachers.growth,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      path: "/dashboard/admin/teachers",
      title: "Tổng số giảng viên trong hệ thống"
    },
    {
      label: "Tổng khóa học",
      value: dashboardStats.courses.total,
      growth: dashboardStats.courses.growth,
      icon: BookOpen,
      color: "from-amber-500 to-amber-600",
      path: "/dashboard/admin/courses",
      title: "Tổng số khóa học trong hệ thống"
    },
    {
      label: "Tổng phòng học",
      value: dashboardStats.rooms.total,
      growth: dashboardStats.rooms.growth,
      icon: Building2,
      color: "from-rose-500 to-rose-600",
      path: "/dashboard/admin/rooms",
      title: "Tổng số phòng học trong hệ thống"
    }
  ], [dashboardStats]);

  // Dữ liệu giả lập khác
  const staticStats = { activeSchedules: 234, pendingSurveys: 12, todayAttendance: 892, systemAlerts: 3 };

  const attendanceStats = [
    { label: 'Có mặt', value: 892, percentage: 71, color: 'bg-emerald-400' },
    { label: 'Vắng có phép', value: 45, percentage: 4, color: 'bg-blue-400' },
    { label: 'Vắng không phép', value: 23, percentage: 2, color: 'bg-red-400' },
    { label: 'Chưa điểm danh', value: 290, percentage: 23, color: 'bg-amber-400' },
  ];

  const quickActions = [
    { label: 'Quản lý tài khoản', sub: 'Thêm, sửa, xóa user', icon: Users, color: 'bg-blue-100', text: 'text-blue-600', path: '/dashboard/admin/accounts' },
    { label: 'Quản lý khóa học', sub: 'Thêm môn học mới', icon: BookOpen, color: 'bg-purple-100', text: 'text-purple-600', path: '/dashboard/admin/courses' },
    { label: 'Quản lý lịch học', sub: 'Xếp lịch học, thi', icon: Calendar, color: 'bg-amber-100', text: 'text-amber-600', path: '/dashboard/admin/schedules' },
    { label: 'Quản lý khảo sát', sub: 'Tạo khảo sát mới', icon: FileText, color: 'bg-emerald-100', text: 'text-emerald-600', path: '/dashboard/admin/surveys' },
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="h-1 bg-[#153898] mb-6 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Quản trị</h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              Xin chào, <span className="font-semibold text-gray-900">{user?.user_name || 'Admin'}</span>
              <Hand className="w-5 h-5 text-yellow-500 animate-bounce" />
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <Calendar className="w-4 h-4 text-[#153898]" />
            <span className="capitalize">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        {statsError && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4" /> {statsError}
          </div>
        )}
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCardsConfigs.map((card, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            onClick={() => navigate(card.path)}
            title={card.title}
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1 truncate">{card.label}</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                  {isLoadingStats ? <span className="animate-pulse">...</span> : card.value.toLocaleString()}
                </h3>
                <div className="mt-2 min-h-[20px]">
                  {!isLoadingStats && <GrowthIndicator growth={card.growth} />}
                </div>
              </div>
              <div className={`h-11 w-11 md:h-12 md:w-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Điểm danh hôm nay</h3>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Tổng: {staticStats.todayAttendance}
            </span>
          </div>
          <div className="space-y-6">
            {attendanceStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{stat.label}</span>
                  <span className="text-gray-900 font-bold">{stat.value} ({stat.percentage}%)</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color} transition-all duration-700 ease-out`} 
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Map */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Hành động nhanh</h3>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, i) => (
              <button 
                key={i}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left"
              >
                <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                  <action.icon className={`w-5 h-5 ${action.text}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800">{action.label}</p>
                  <p className="text-xs text-gray-500 truncate">{action.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}