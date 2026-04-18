import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  MapPin,
  Monitor,
  Clock,
  Calendar,
  Edit3,
  Info,
  ArrowDown,
  ArrowUp,
  FilterX,
  FileSpreadsheet,
  FileSearchIcon,
  RefreshCcw,
} from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import TeacherPhotosModal from "../admin/components/TeacherPhotosModal";
import { useAttendance } from "@contexts/AttendanceContext";

const ITEMS_PER_PAGE = 5;

const EMPTY_SUMMARY = {
  total_students: 0,
  present_count: 0,
  absent_count: 0,
  excused_count: 0,
  late_count: 0,
  finalized_count: 0,
};

const STATUS_META = {
  present: {
    label: "Có mặt",
    color: "#22c55e",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  absent: {
    label: "Vắng",
    color: "#ef4444",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  excused: {
    label: "Có phép",
    color: "#3b82f6",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  late: {
    label: "Đi muộn",
    color: "#f59e0b",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

const readAttendanceSchedule = () => {
  try {
    const raw = sessionStorage.getItem("attendanceSchedule");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading attendanceSchedule:", error);
    return null;
  }
};

const formatTime = (isoText) => {
  if (!isoText) return "--:--:--";
  const parsed = new Date(isoText);
  if (Number.isNaN(parsed.getTime())) return "--:--:--";
  return parsed.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDate = (isoText) => {
  if (!isoText) return "--/--/----";
  const parsed = new Date(isoText);
  if (Number.isNaN(parsed.getTime())) return "--/--/----";
  return parsed.toLocaleDateString("vi-VN");
};

const formatDateTime = (isoText) => {
  if (!isoText) return "--/--/---- --:--:--";
  const parsed = new Date(isoText);
  if (Number.isNaN(parsed.getTime())) return "--/--/---- --:--:--";
  return parsed.toLocaleString("vi-VN", { hour12: false });
};

const ResultQRPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    attendanceResults,
    attendanceResultsLoading,
    initializeAttendanceResults,
  } = useAttendance();

  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    studentId: "",
    fullName: "",
    status: "all",
    deviceCheck: "all",
    locationCheck: "all",
    dob: "",
  });

  const scheduleFromStorage = useMemo(() => readAttendanceSchedule(), []);
  const selectedSchedule = location.state?.schedule || scheduleFromStorage || null;

  useEffect(() => {
    if (!location.state?.schedule) return;

    sessionStorage.setItem(
      "attendanceSchedule",
      JSON.stringify(location.state.schedule)
    );
  }, [location.state?.schedule]);

  const classSessionId =
    selectedSchedule?.id || selectedSchedule?.class_session_id || null;

  useEffect(() => {
    if (!classSessionId) return;

    void initializeAttendanceResults({
      class_session_id: classSessionId,
      overwrite_non_finalized: true,
    });
  }, [classSessionId, initializeAttendanceResults]);

  const handleInitializeResults = useCallback(() => {
    if (!classSessionId) return;

    void initializeAttendanceResults({
      class_session_id: classSessionId,
      overwrite_non_finalized: true,
    });
  }, [classSessionId, initializeAttendanceResults]);

  const resultData = useMemo(() => {
    if (attendanceResults?.class_session_id !== classSessionId) {
      return null;
    }

    return attendanceResults;
  }, [attendanceResults, classSessionId]);

  const summary = useMemo(
    () => resultData?.summary || EMPTY_SUMMARY,
    [resultData]
  );

  const pieData = useMemo(
    () => [
      {
        name: STATUS_META.present.label,
        value: Number(summary.present_count || 0),
        color: STATUS_META.present.color,
      },
      {
        name: STATUS_META.absent.label,
        value: Number(summary.absent_count || 0),
        color: STATUS_META.absent.color,
      },
      {
        name: STATUS_META.excused.label,
        value: Number(summary.excused_count || 0),
        color: STATUS_META.excused.color,
      },
      {
        name: STATUS_META.late.label,
        value: Number(summary.late_count || 0),
        color: STATUS_META.late.color,
      },
    ].filter((item) => item.value > 0),
    [summary]
  );

  const attendanceList = useMemo(() => {
    if (!Array.isArray(resultData?.results)) return [];

    return resultData.results.map((item) => {
      const statusMeta = STATUS_META[item.status] || STATUS_META.absent;

      return {
        id: item.student?.student_code || "---",
        name: item.student?.full_name || "Unknown student",
        dob: item.student?.dob ? formatDate(item.student.dob) : "N/A",
        qrGenerated: formatTime(item.student?.qr_created_at),
        scanTime: formatTime(item.student?.scan_time),
        updatedDate: formatDate(item.student?.scan_time),
        deviceID: item.student?.device_id?.installation_id || "N/A",
        deviceMatch: null,
        location: `(${item.student?.scan_latitude || "?"}, ${item.student?.scan_longitude || "?"})`,
        locationMatch: item.student?.location_verified || false,
        status: statusMeta.label,
        statusBadgeClass: statusMeta.badgeClass,
        note: item.note || "",
      };
    });
  }, [resultData]);

  const courseInfo = useMemo(
    () => ({
      id: selectedSchedule?.courseSection?.code || "---",
      name: selectedSchedule?.courseSection?.name || "Chua co hoc phan",
      type:
        selectedSchedule?.practiceGroup?.group_name ||
        selectedSchedule?.practiceGroup?.groupName ||
        "Chua phan nhom",
      creator: selectedSchedule?.personnel?.full_name || "Chua co giang vien",
      creatorID: selectedSchedule?.personnel?.code || "N/A",
    }),
    [selectedSchedule]
  );

  const sessionStats = useMemo(
    () => ({
      startTime: (selectedSchedule?.start_hour || "").slice(0, 5) || "--:--",
      endTime: (selectedSchedule?.end_hour || "").slice(0, 5) || "--:--",
      date: selectedSchedule?.class_date || "--/--/----",
      syncedCount:
        Number(resultData?.sync?.created || 0) +
        Number(resultData?.sync?.updated || 0),
      totalStudents: Number(summary.total_students || 0),
      success: Number(summary.present_count || 0),
      absent: Number(summary.absent_count || 0),
      excused: Number(summary.excused_count || 0),
    }),
    [resultData?.sync?.created, resultData?.sync?.updated, selectedSchedule, summary]
  );


  // Áp dụng các bộ lọc cho danh sách điểm danh
  const filteredAttendanceList = useMemo(
    () =>
      attendanceList.filter((student) => {
        const studentIdKeyword = filters.studentId.trim().toLowerCase();
        const fullNameKeyword = filters.fullName.trim().toLowerCase();

        const matchStudentId =
          !studentIdKeyword ||
          String(student.id).toLowerCase().includes(studentIdKeyword);

        const matchFullName =
          !fullNameKeyword ||
          String(student.name).toLowerCase().includes(fullNameKeyword);

        const matchStatus = filters.status === "all" || student.status === filters.status;

        const matchDevice = filters.deviceCheck === "all" ||
          (filters.deviceCheck === "match" && student.deviceMatch === true) ||
          (filters.deviceCheck === "mismatch" &&
            student.deviceMatch === false);

        const matchLocation = filters.locationCheck === "all" ||
          (filters.locationCheck === "match" && student.locationMatch === true) ||
          (filters.locationCheck === "mismatch" &&
            student.locationMatch === false);

        const matchDob = !filters.dob || student.dob === filters.dob;

        return (
          matchStudentId &&
          matchFullName &&
          matchStatus &&
          matchDevice &&
          matchLocation &&
          matchDob
        );
      }),
    [attendanceList, filters]
  );

  const totalPages = Math.max(1, Math.ceil(filteredAttendanceList.length / ITEMS_PER_PAGE));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const currentPageData = filteredAttendanceList.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      studentId: "",
      fullName: "",
      status: "all",
      deviceCheck: "all",
      locationCheck: "all",
      dob: "",
    });
    setCurrentPage(1);
  };

  const teacherPhotos = [
    { id: 1, url: "/assets/images/_34A8269.jpg", caption: "Photo 1" },
    { id: 2, url: "/assets/images/_34A8289.jpg", caption: "Photo 2" },
    { id: 3, url: "/assets/images/_34A8277.jpg", caption: "Photo 3" },
    { id: 4, url: "/assets/images/_34A8304.jpg", caption: "Photo 4" },
  ];

  if (!classSessionId) {
    return (
      <div className="min-h-screen rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        <p className="text-lg font-semibold">Chưa có buổi học được chọn</p>
        <p className="mt-2 text-sm">
          Vui lòng quay lại trang lịch dạy để chọn một buổi học và xem kết quả điểm danh.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/qrcode")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Về màn hình QR
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleInitializeResults}
          disabled={attendanceResultsLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw
            className={`h-4 w-4 ${attendanceResultsLoading ? "animate-spin" : ""}`}
          />
          {attendanceResultsLoading ? "Đang khởi tạo..." : "Khởi tạo lại kết quả chốt"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 bg-white p-6 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">
            KẾT QUẢ ĐIỂM DANH <span className="text-indigo-600">NGÀY {formatDate(sessionStats.date)}</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 border border-indigo-100">
              <div className="flex items-center gap-3 mb-1">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Sỉ số</span>
              </div>
              <p className="text-2xl font-black text-indigo-700">{sessionStats.totalStudents}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-1">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Có mặt</span>
              </div>
              <p className="text-2xl font-black text-emerald-700">{sessionStats.success}</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <div className="flex items-center gap-3 mb-1">
                <UserX className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Vắng mặt</span>
              </div>
              <p className="text-2xl font-black text-rose-700">{sessionStats.absent}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-1">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Có phép</span>
              </div>
              <p className="text-2xl font-black text-blue-700">{sessionStats.excused}</p>
            </div>
          </div>
        </div>

        {/* MIDDLE – THÔNG TIN HỌC PHẦN (30%) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Card thông tin học phần - Tone Blue Gradient tươi sáng */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            {/* Vòng tròn decor tạo hiệu ứng chiều sâu */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Học phần
              </span>
              <h3 className="text-2xl font-black leading-tight mb-6 tracking-tight">
                {courseInfo.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-bold opacity-70 uppercase">Mã số</p>
                  <p className="text-sm font-black">{courseInfo.id}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-bold opacity-70 uppercase">Phân loại</p>
                  <p className="text-sm font-black">{courseInfo.type}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-blue-50 shadow-sm">
            <div className="flex items-center gap-4 p-3 mb-3">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl border border-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Giảng viên / Người tạo</p>
                <p className="text-lg font-black text-blue-800 leading-none">{courseInfo.creator}</p>
                <p className="text-xs font-bold text-blue-400/60 mt-1">{courseInfo.creatorID}</p>
              </div>
            </div>
            <button
              onClick={() => setIsPhotosModalOpen(true)}
              className="group w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl transition-all duration-300 shadow-lg shadow-blue-200 active:scale-[0.97]"
            >
              <Edit3 className="w-4 h-4 text-white" />
              Xem hình ảnh
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4 border-slate-50">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Bắt đầu</p>
              <p className="text-lg font-black text-indigo-600">{sessionStats.startTime}</p>
            </div>
            <div className="text-center border-l">
              <p className="text-[10px] font-black text-slate-400 uppercase">Kết thúc</p>
              <p className="text-lg font-black text-rose-600">{sessionStats.endTime}</p>
            </div>
            <div className="col-span-2 text-center pt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Bản ghi đã đồng bộ</p>
              <span className="px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-lg font-black">
                {sessionStats.syncedCount}
              </span>
            </div>
          </div>

          <div className="h-40">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius="60%" outerRadius="90%" paddingAngle={5}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">No chart data</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-white border-b p-6">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>
            <span> Bộ lọc </span>
            <button onClick={() => setExpanded(!expanded)} className="flex items-center text-blue-600 hover:text-blue-800 ml-auto">
              {expanded ? (
                <>
                  <ArrowUp size={16} className="mr-1" /> Thu gọn
                </>
              ) : (
                <>
                  <ArrowDown size={16} className="mr-1" /> Mở rộng
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MSSV</label>
              <input
                type="text"
                value={filters.studentId}
                onChange={(e) => handleFilterChange("studentId", e.target.value)}
                placeholder="Nhập MSSV"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
              <input
                type="text"
                value={filters.fullName}
                onChange={(e) => handleFilterChange("fullName", e.target.value)}
                placeholder="Nhập họ tên"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="Thanh cong">Thành công</option>
                <option value="Vang">Vắng</option>
                <option value="Co phep">Có phép</option>
                <option value="Di muon">Đi muộn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kiểm tra thiết bị</label>
              <select
                value={filters.deviceCheck}
                onChange={(e) => handleFilterChange("deviceCheck", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="match">Khớp</option>
                <option value="mismatch">Không khớp</option>
              </select>
            </div>

            {expanded ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kiểm tra vị trí</label>
                  <select
                    value={filters.locationCheck}
                    onChange={(e) => handleFilterChange("locationCheck", e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="match">Khớp</option>
                    <option value="mismatch">Không khớp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={filters.dob}
                    onChange={(e) => handleFilterChange("dob", e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
              onClick={() => setCurrentPage(1)}
              title="Tìm kiếm"
            >
              <FileSearchIcon className="w-5 h-5" />
            </button>
            <button
              className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 transition-all duration-200"
              onClick={() => console.log("Export Excel", filteredAttendanceList)}
              title="Xuất file excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button
              className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
              onClick={handleResetFilters}
              title="Xóa bộ lọc"
            >
              <FilterX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">MSSV</th>
                <th className="px-6 py-4">Họ tên</th>
                <th className="px-6 py-4">Ngày sinh</th>
                <th className="px-6 py-4">Thời gian tạo QR</th>
                <th className="px-6 py-4">Thời gian </th>
                <th className="px-6 py-4">ID thiết bị</th>
                <th className="px-6 py-4">Vị trí ghi nhận</th>
                <th className="px-6 py-4">Ghi chú</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((student) => (
                <tr key={`${student.id}-${student.name}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4"><p className="text-sm font-black text-indigo-600">{student.id}</p></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-black text-slate-800">{student.name}</p>
                      <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${student.statusBadgeClass}`}>{student.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2 text-xs font-black text-slate-700"><Calendar className="w-3 h-3" /> {student.dob}</div></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Calendar className="w-3 h-3" /> {student.qrGenerated}</div></td>
                  <td className="px-6 py-4"><div className="flex flex-col gap-1 text-xs text-slate-700"><div className="flex items-center gap-2 font-black"><Clock className="w-3 h-3" /> {student.scanTime}</div><span className="text-slate-400">{student.updatedDate}</span></div></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2 text-xs font-black p-2 rounded-lg border w-fit bg-slate-50 text-slate-600 border-slate-200"><Monitor className="w-3.5 h-3.5" /> {student.deviceID}</div></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-600"><MapPin className="w-3.5 h-3.5 text-indigo-400" />{student.location}</div></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-600">{student.note}</div></td>
                  <td className="px-6 py-4"><div className="flex justify-center"><button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors"><Edit3 className="w-5 h-5" /></button></div></td>
                </tr>
              ))}

              {currentPageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-slate-500">
                    {attendanceResultsLoading
                      ? "Đang tải dữ liệu kết quả chốt..."
                      : "Không có dữ liệu phù hợp với bộ lọc."}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <TeacherPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        photos={teacherPhotos}
      />
    </div>
  );
};

export default ResultQRPage;
