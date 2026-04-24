import React, { useEffect, useMemo, useState } from "react";
import {
  Users, GraduationCap, BookOpen, Building2, FileText, AlertCircle,
  CheckCircle, Calendar, Hand, ArrowUpRight, ArrowDownRight,
  PlusCircle, History, Calendar as CalendarIcon
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, 
PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend
} from 'recharts';
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

  // Dữ liệu giả lập cho Biểu đồ (Bạn có thể fetch từ API sau)
  const chartData = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return {
        date: `${day < 10 ? '0' + day : day}/04`,
        success: Math.floor(Math.random() * 20) + 10, // Tạo số ngẫu nhiên từ 10-30
        missed: Math.floor(Math.random() * 10),      // Tạo số ngẫu nhiên từ 0-10
      };
    });
  }, []);

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

  const statCardsConfigs = useMemo(() => [
    { label: "Tổng sinh viên", value: dashboardStats.students.total, growth: dashboardStats.students.growth, icon: GraduationCap, color: "from-blue-500 to-blue-600", path: "/dashboard/admin/students" },
    { label: "Tổng giảng viên", value: dashboardStats.teachers.total, growth: dashboardStats.teachers.growth, icon: Users, color: "from-purple-500 to-purple-600", path: "/dashboard/admin/teachers" },
    { label: "Tổng khóa học", value: dashboardStats.courses.total, growth: dashboardStats.courses.growth, icon: BookOpen, color: "from-amber-500 to-amber-600", path: "/dashboard/admin/courses" },
    { label: "Tổng phòng học", value: dashboardStats.rooms.total, growth: dashboardStats.rooms.growth, icon: Building2, color: "from-rose-500 to-rose-600", path: "/dashboard/admin/rooms" }
  ], [dashboardStats]);

  const quickActions = [
    { label: 'Quản lý tài khoản', sub: 'Thêm, sửa, xóa user', icon: Users, color: 'bg-blue-100', text: 'text-blue-600', path: '/dashboard/admin/accounts' },
    { label: 'Quản lý khóa học', sub: 'Thêm môn học mới', icon: BookOpen, color: 'bg-purple-100', text: 'text-purple-600', path: '/dashboard/admin/courses' },
    { label: 'Quản lý lịch học', sub: 'Xếp lịch học, thi', icon: Calendar, color: 'bg-amber-100', text: 'text-amber-600', path: '/dashboard/admin/schedules' },
    { label: 'Quản lý khảo sát', sub: 'Tạo khảo sát mới', icon: FileText, color: 'bg-emerald-100', text: 'text-emerald-600', path: '/dashboard/admin/surveys' },
  ];

  return (
    <div className="bg-gray-50 p-4 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="h-1 bg-[#153898] mb-6 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Quản trị</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <Calendar className="w-4 h-4 text-[#153898]" />
            <span className="capitalize">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {statCardsConfigs.map((card, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            onClick={() => navigate(card.path)}
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
        {/* --- PHẦN BIỂU ĐỒ VÀ CARD ĐIỂM DANH --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Sub-cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600"><Calendar size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Phiên hôm nay</p>
                <p className="text-xl font-bold text-gray-800">24</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Đã tạo</p>
                <p className="text-xl font-bold text-gray-800">156</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-600"><PlusCircle size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Chưa tạo</p>
                <p className="text-xl font-bold text-gray-800">12</p>
              </div>
            </div>
          </div>

          {/* Main Chart Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  Thống kê phiên điểm danh
                </h3>
                <p className="text-xs text-gray-500 italic mt-1">* Dữ liệu tối đa 31 ngày gần nhất</p>
              </div>
              <div className="flex items-center gap-4">

              </div>
              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors bg-green-50 px-3 py-1 border border-gray-200 hover:bg-gray-100">
                  <ArrowUpRight className="w-4 h-4" />
                  Xuất Excel
                </button>
                <input type="date" className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer text-gray-600" defaultValue="2024-04-01" />
                <span className="text-gray-400 text-xs font-bold">→</span>
                <input type="date" className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer text-gray-600" defaultValue="2024-04-30" />
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
                  <Bar dataKey="success" name="Đã tạo" stackId="a" fill="#10b981" barSize={32} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="missed" name="Chưa tạo" stackId="a" fill="#f59e0b" barSize={32} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 self-start">
          
          {/* 1. Quick Actions Grid 2x2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-3"> 
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                  >
                    {/* Icon nằm bên trái */}
                    <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                      <action.icon className={`w-5 h-5 ${action.text}`} />
                    </div>
                    
                    {/* Text nằm bên phải */}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 leading-tight truncate">
                        {action.label}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
                        Quản lý
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          {/* 2. Pie Chart: Tỉ lệ điểm danh */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Đã tạo', value: 156 },
                      { name: 'Chưa tạo', value: 12 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Tạo hình Donut cho hiện đại
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" /> {/* Xanh - Đã tạo */}
                    <Cell fill="#f59e0b" /> {/* Vàng - Chưa tạo */}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <RechartsLegend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500">
                Hiệu suất tạo phiên: <span className="font-bold text-emerald-600">92.8%</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}