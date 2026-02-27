import React from "react";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Building2,
  UserCheck,
  FileText,
  AlertCircle,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3
} from "lucide-react";
import { useAuth } from "@contexts/AuthContext";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // Mock data - sẽ được thay thế bằng API calls
  const stats = {
    totalStudents: 1250,
    totalTeachers: 85,
    totalCourses: 156,
    totalRooms: 42,
    activeSchedules: 234,
    pendingSurveys: 12,
    todayAttendance: 892,
    systemAlerts: 3,
  };

  const recentActivities = [
    { id: 1, type: 'student', action: 'Đăng ký mới', user: 'Nguyễn Văn A', time: '5 phút trước', status: 'success' },
    { id: 2, type: 'schedule', action: 'Cập nhật lịch học', user: 'GV. Trần Thị B', time: '15 phút trước', status: 'info' },
    { id: 3, type: 'survey', action: 'Khảo sát mới', user: 'GV. Lê Văn C', time: '1 giờ trước', status: 'warning' },
    { id: 4, type: 'attendance', action: 'Điểm danh hoàn tất', user: 'GV. Phạm Thị D', time: '2 giờ trước', status: 'success' },
  ];

  const attendanceStats = [
    { label: 'Có mặt', value: 892, percentage: 71, color: 'emerald' },
    { label: 'Vắng có phép', value: 45, percentage: 4, color: 'blue' },
    { label: 'Vắng không phép', value: 23, percentage: 2, color: 'red' },
    { label: 'Chưa điểm danh', value: 290, percentage: 23, color: 'amber' },
  ];

  const systemHealth = [
    { metric: 'Uptime hệ thống', value: '99.9%', status: 'excellent', trend: 'up' },
    { metric: 'API Response', value: '120ms', status: 'good', trend: 'down' },
    { metric: 'Database Load', value: '45%', status: 'good', trend: 'up' },
    { metric: 'Active Users', value: '347', status: 'excellent', trend: 'up' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-6" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Quản trị</h1>
            <p className="text-gray-600 mt-1">
              Xin chào, <span className="font-semibold">{user?.user_name || 'Admin'}</span> 👋
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng sinh viên</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalStudents.toLocaleString()}</h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500 font-medium">+12.5%</span>
                <span className="text-xs text-gray-500">so với tháng trước</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng giảng viên</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalTeachers}</h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500 font-medium">+5.2%</span>
                <span className="text-xs text-gray-500">so với tháng trước</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng khóa học</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalCourses}</h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-500 font-medium">+8.1%</span>
                <span className="text-xs text-gray-500">so với tháng trước</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Total Rooms */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tổng phòng học</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalRooms}</h3>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-sm text-gray-500 font-medium">Không đổi</span>
                <span className="text-xs text-gray-500">so với tháng trước</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Attendance Today */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Điểm danh hôm nay</h3>
              <p className="text-sm text-gray-600">Tổng: {stats.todayAttendance} sinh viên</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Xem chi tiết
            </button>
          </div>

          <div className="space-y-4">
            {attendanceStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full bg-${stat.color}-400`} />
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-800">{stat.value}</span>
                    <span className="text-xs text-gray-500">{stat.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${stat.color}-400 rounded-full transition-all duration-500`}
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hành động nhanh</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors text-left border border-gray-200">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Quản lý tài khoản</p>
                <p className="text-xs text-gray-500">Thêm, sửa, xóa user</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors text-left border border-gray-200">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Quản lý khóa học</p>
                <p className="text-xs text-gray-500">Thêm môn học mới</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 transition-colors text-left border border-gray-200">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Quản lý lịch học</p>
                <p className="text-xs text-gray-500">Xếp lịch học, thi</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors text-left border border-gray-200">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Quản lý khảo sát</p>
                <p className="text-xs text-gray-500">Tạo khảo sát mới</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-emerald-100' :
                  activity.status === 'warning' ? 'bg-amber-100' :
                  'bg-blue-100'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle className={`w-5 h-5 text-emerald-600`} />
                  ) : activity.status === 'warning' ? (
                    <AlertTriangle className={`w-5 h-5 text-amber-600`} />
                  ) : (
                    <Activity className={`w-5 h-5 text-blue-600`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Tình trạng hệ thống</h3>
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Hoạt động tốt
            </span>
          </div>

          <div className="space-y-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.metric}</p>
                    <p className="text-xs text-gray-500">
                      {item.status === 'excellent' ? 'Xuất sắc' : 'Tốt'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                  {item.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* System Alerts */}
          <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {stats.systemAlerts} cảnh báo hệ thống
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Cần kiểm tra và xử lý ngay
                </p>
                <button className="mt-2 text-xs font-medium text-amber-600 hover:text-amber-700">
                  Xem chi tiết →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
