import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  ArrowDown,
  ArrowUp,
  UserCheck,
  Clock,
  MapPin,
  FileSearch as FileSearchIcon,
  FileSpreadsheet,
  FilterX,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import StatsCard from "../../../components/common/StatsCard";
import attendanceService from "../../../services/attendance.service";

const DAY_NAMES = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

const SCHEDULE_TYPE_LABELS = { theory: "Lý thuyết", practice: "Thực hành" };

const STATUS_LABELS = {
  scheduled: "Chưa bắt đầu",
  in_progress: "Đang diễn ra",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  substituted: "Học bù",
};

const getDayOfWeek = (dateStr) => {
  if (!dateStr) return "";
  return DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()];
};

const formatTime = (t) => (t ? t.slice(0, 5) : "");

const EMPTY_FILTERS = {
  maHP: "",
  tenHP: "",
  maGV: "",
  tenGV: "",
  phong: "",
  thu: "",
  loaiLich: "",
  status: "",
  fromDate: "",
  toDate: "",
  semester: "",
};

const AttendanceSchedulePage = () => {
  const [expanded, setExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [sessions, setSessions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, total_pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [todayStats, setTodayStats] = useState({ total: 0, created: 0, not_created: 0 });

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        course_code: appliedFilters.maHP || undefined,
        course_name: appliedFilters.tenHP || undefined,
        teacher_code: appliedFilters.maGV || undefined,
        teacher_name: appliedFilters.tenGV || undefined,
        room: appliedFilters.phong || undefined,
        day_of_week: appliedFilters.thu || undefined,
        schedule_type: appliedFilters.loaiLich || undefined,
        status: appliedFilters.status || undefined,
        from_date: appliedFilters.fromDate || undefined,
        to_date: appliedFilters.toDate || undefined,
        semester: appliedFilters.semester || undefined,
        page: currentPage,
        limit: itemsPerPage,
      };
      Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

      const res = await attendanceService.getAttendanceSchedule(params);
      const data = res?.data || res;
      setSessions(data.sessions || []);
      setPagination(data.pagination || { total: 0, total_pages: 1 });
    } catch (err) {
      setError("Không thể tải danh sách lịch dạy.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, currentPage]);

  const fetchTodayStats = useCallback(async () => {
    try {
      const res = await attendanceService.getScheduleTodayStats();
      const data = res?.data || res;
      setTodayStats(data || { total: 0, created: 0, not_created: 0 });
    } catch {
      // fail silently
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  useEffect(() => {
    fetchTodayStats();
  }, [fetchTodayStats]);

  const handleTempFilterChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(tempFilters);
  };

  const handleClearFilters = () => {
    setTempFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 space-y-5 bg-slate-50 min-h-screen">
      {/* 1. TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Tổng buổi hôm nay"
          value={todayStats.total}
          icon={<Calendar size={20} />}
          color="blue"
        />
        <StatsCard
          title="Đã tạo phiên ĐD"
          value={todayStats.created}
          icon={<UserCheck size={20} />}
          color="green"
        />
        <StatsCard
          title="Chưa tạo phiên ĐD"
          value={todayStats.not_created}
          icon={<Clock size={20} />}
          color="orange"
        />
        <StatsCard
          title="Kết quả tìm kiếm"
          value={pagination.total}
          icon={<MapPin size={20} />}
          color="gray"
        />
      </div>

      {/* 2. BỘ LỌC */}
      <div className="bg-white border p-6">
        <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
          <FileSearchIcon className="w-4 h-4" />
          <span>Bộ lọc lịch dạy</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-blue-600 hover:text-blue-800 ml-auto"
          >
            {expanded ? (
              <>
                <ArrowUp size={16} className="mr-1" />
                Thu gọn
              </>
            ) : (
              <>
                <ArrowDown size={16} className="mr-1" />
                Mở rộng
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã học phần</label>
            <input
              type="text"
              value={tempFilters.maHP}
              onChange={(e) => handleTempFilterChange("maHP", e.target.value)}
              placeholder="Ví dụ: 84145101"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên học phần</label>
            <input
              type="text"
              value={tempFilters.tenHP}
              onChange={(e) => handleTempFilterChange("tenHP", e.target.value)}
              placeholder="Nhập tên học phần"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảng viên</label>
            <input
              type="text"
              value={tempFilters.maGV}
              onChange={(e) => handleTempFilterChange("maGV", e.target.value)}
              placeholder="Ví dụ: GV00501"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
            <input
              type="text"
              value={tempFilters.tenGV}
              onChange={(e) => handleTempFilterChange("tenGV", e.target.value)}
              placeholder="Nhập tên giảng viên"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
            <input
              type="text"
              value={tempFilters.phong}
              onChange={(e) => handleTempFilterChange("phong", e.target.value)}
              placeholder="Ví dụ: H5.1.1"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {expanded && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ</label>
                <select
                  value={tempFilters.thu}
                  onChange={(e) => handleTempFilterChange("thu", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="Thứ hai">Thứ Hai</option>
                  <option value="Thứ ba">Thứ Ba</option>
                  <option value="Thứ tư">Thứ Tư</option>
                  <option value="Thứ năm">Thứ Năm</option>
                  <option value="Thứ sáu">Thứ Sáu</option>
                  <option value="Thứ bảy">Thứ Bảy</option>
                  <option value="Chủ nhật">Chủ nhật</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại lịch</label>
                <select
                  value={tempFilters.loaiLich}
                  onChange={(e) => handleTempFilterChange("loaiLich", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="theory">Lý thuyết</option>
                  <option value="practice">Thực hành</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  value={tempFilters.status}
                  onChange={(e) => handleTempFilterChange("status", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="scheduled">Chưa bắt đầu</option>
                  <option value="in_progress">Đang diễn ra</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                  <option value="substituted">Học bù</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Học kỳ</label>
                <input
                  type="text"
                  value={tempFilters.semester}
                  onChange={(e) => handleTempFilterChange("semester", e.target.value)}
                  placeholder="Ví dụ: 2025-1"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={tempFilters.fromDate}
                  onChange={(e) => handleTempFilterChange("fromDate", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={tempFilters.toDate}
                  onChange={(e) => handleTempFilterChange("toDate", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
            title="Tìm kiếm"
          >
            <FileSearchIcon className="w-5 h-5" />
          </button>

          <button
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
              sessions.length > 0
                ? "border border-emerald-400 text-emerald-400 hover:bg-emerald-100 hover:shadow-md focus:ring-emerald-500"
                : "border border-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            disabled={sessions.length === 0}
            title="Xuất file"
          >
            <FileSpreadsheet className="w-5 h-5" />
            {sessions.length > 0 && (
              <span className="ml-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                {pagination.total}
              </span>
            )}
          </button>

          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
            title="Xóa bộ lọc"
          >
            <FilterX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 3. BẢNG DỮ LIỆU */}
      <div className="bg-white shadow-md border border-slate-200 overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-16 text-blue-500 text-sm font-medium">
            Đang tải dữ liệu...
          </div>
        )}
        {error && !loading && (
          <div className="flex items-center justify-center py-16 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] text-left border-collapse min-w-[1400px]">
              <thead>
                <tr className="bg-[#48a3d6] text-white text-center font-bold uppercase tracking-tight">
                  <th rowSpan="2" className="border border-white/20 p-3 w-12">STT</th>
                  <th rowSpan="2" className="border border-white/20 p-3 w-32">Mã học phần</th>
                  <th rowSpan="2" className="border border-white/20 p-3 w-72 text-left">Tên môn học / học phần</th>
                  <th rowSpan="2" className="border border-white/20 p-3 w-16">TC</th>
                  <th colSpan="6" className="border border-white/20 p-2 text-[13px]">Thông tin lịch dạy</th>
                  <th rowSpan="2" className="border border-white/20 p-3 w-28">Ngày học</th>
                  <th rowSpan="2" className="border border-white/20 p-3 w-28">Điểm danh</th>
                  <th rowSpan="2" className="border border-white/20 p-3 w-32">Mã giảng viên</th>
                  <th rowSpan="2" className="border border-white/20 p-3 w-48 text-left">Giảng viên</th>
                </tr>
                <tr className="bg-[#48a3d6] text-white text-[11px] text-center font-bold uppercase">
                  <th className="border border-white/20 p-2 w-20">Thứ</th>
                  <th className="border border-white/20 p-2 w-16">Buổi</th>
                  <th className="border border-white/20 p-2 w-28">Loại lịch</th>
                  <th className="border border-white/20 p-2 w-24 text-yellow-200">Phòng</th>
                  <th className="border border-white/20 p-2 w-20">Nhóm</th>
                  <th className="border border-white/20 p-2 w-32">Giờ dạy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="p-10 text-center text-slate-400">
                      Không có dữ liệu lịch dạy
                    </td>
                  </tr>
                ) : (
                  sessions.map((row, index) => {
                    const stt = (currentPage - 1) * itemsPerPage + index + 1;
                    const isOngoing = row.status === "in_progress";
                    return (
                      <tr
                        key={row.id}
                        className={`transition-colors cursor-pointer group ${
                          isOngoing ? "bg-green-50/50" : "hover:bg-blue-50/40"
                        }`}
                      >
                        <td className="p-3 text-center border-x text-slate-400 font-medium">{stt}</td>
                        <td className="p-3 font-bold text-blue-600 border-x">{row.course_section?.code}</td>
                        <td className="p-3 font-bold text-slate-700 border-x group-hover:text-blue-700">
                          {row.course_section?.name}
                        </td>
                        <td className="p-3 text-center border-x font-semibold text-slate-600">
                          {row.course_section?.credits}
                        </td>
                        <td className="p-3 text-center border-x font-medium">
                          {getDayOfWeek(row.class_date)}
                        </td>
                        <td className="p-3 text-center border-x font-medium">{row.session_number}</td>
                        <td className="p-3 border-x italic text-slate-500">
                          {SCHEDULE_TYPE_LABELS[row.schedule_type] || row.schedule_type}
                        </td>
                        <td className="p-3 text-center border-x font-black text-red-600 text-[14px]">
                          {row.room?.room_code}
                        </td>
                        <td className="p-3 text-center border-x font-medium text-slate-600">
                          {row.practice_group?.group_name || "-"}
                        </td>
                        <td className="p-3 text-center border-x font-bold text-slate-700">
                          {formatTime(row.start_hour)} - {formatTime(row.end_hour)}
                        </td>
                        <td className="p-3 text-center border-x text-green-700 font-bold">
                          {row.class_date}
                        </td>
                        <td className="p-3 text-center border-x">
                          {row.has_attendance_session ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle size={14} />
                              Đã tạo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                              <XCircle size={14} />
                              Chưa tạo
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center border-x font-mono text-slate-500 font-bold tracking-tighter">
                          {row.personnel?.teacher_code}
                        </td>
                        <td className="p-3 font-black text-slate-800 border-x">
                          <div className="flex items-center gap-2">
                            {isOngoing && (
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                            {row.personnel?.full_name}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. FOOTER PHÂN TRANG */}
        <div className="p-4 bg-slate-50 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-slate-500">
            Đang hiển thị{" "}
            <span className="text-blue-700 font-bold">{sessions.length}</span> ca dạy trong tổng số{" "}
            <span className="text-slate-800 font-bold">{pagination.total}</span> kết quả
          </div>
          <Pagination
            totalPages={pagination.total_pages || 1}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceSchedulePage;
