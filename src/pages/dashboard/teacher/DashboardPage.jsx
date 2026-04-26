import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Bell, Clock, RefreshCw } from "lucide-react";
import AttendanceCalendar from "@components/teacher/AttendanceCalendar";
import { useTeacherSchedule } from "@contexts/TeacherScheduleContext";
import { usePersonnelProfile } from "@contexts/PersonnelProfileContext";
import { useNavigate } from "react-router-dom";
import attendanceService from "@services/attendance.service";

const _now = new Date();
const FIRST_OF_MONTH = new Date(_now.getFullYear(), _now.getMonth(), 1).toISOString().slice(0, 10);
const LAST_OF_MONTH = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).toISOString().slice(0, 10);

const formatTime = (timeValue) => {
  if (!timeValue) return "--:--";
  return String(timeValue).slice(0, 5);
};

const formatDate = (dateValue) => {
  if (!dateValue) return "--";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString("vi-VN");
};

const getUserStatusLabel = (status) => {
  if (status === "active") return "Đang hoạt động";
  if (status === "inactive") return "Ngưng hoạt động";
  return "--";
};

const getRoleLabel = (role) => {
  if (!role) return "--";
  if (role === "admin") return "Quản trị viên";
  if (role === "teacher") return "Giảng viên";
  if (role === "attendance_staff") return "Nhân viên điểm danh";
  return role;
}

const getRoomInfo = (schedule) => {
  const roomName =
    schedule?.room?.room_name || "Chưa phân phòng";

  const practiceGroupName =
    schedule?.practiceGroup?.group_name || null;

  const scheduleTypeLabel = schedule?.schedule_type === "practice" ? "Thực hành" : schedule?.schedule_type === "theory" ? "Lý thuyết" : null;

  const details = [practiceGroupName, scheduleTypeLabel].filter(Boolean).join("  •  ");
  return details ? `${roomName}  •  ${details}` : roomName;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    todaySchedules,
    todayLoading,
    todayError,
    fetchTodaySchedules,
    refreshTodaySchedules,
  } = useTeacherSchedule();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
    fetchProfile,
  } = usePersonnelProfile();

  const [calFrom, setCalFrom] = useState(FIRST_OF_MONTH);
  const [calTo, setCalTo] = useState(LAST_OF_MONTH);
  const [workload, setWorkload] = useState(null);
  const [workloadLoading, setWorkloadLoading] = useState(false);

  const fetchWorkload = useCallback(async (from, to) => {
    setWorkloadLoading(true);
    try {
      const res = await attendanceService.getTeacherAttendanceWorkload(from, to);
      setWorkload(res?.data || res);
    } catch {
      setWorkload(null);
    } finally {
      setWorkloadLoading(false);
    }
  }, []);

  const handleCalFilter = useCallback((from, to) => {
    setCalFrom(from);
    setCalTo(to);
    fetchWorkload(from, to);
  }, [fetchWorkload]);

  const hasLoadedTodaySchedules = useRef(false);
  const hasLoadedProfile = useRef(false);
  const hasLoadedWorkload = useRef(false);

  useEffect(() => {
    if (hasLoadedTodaySchedules.current) return;
    hasLoadedTodaySchedules.current = true;
    fetchTodaySchedules();
  }, [fetchTodaySchedules]);

  useEffect(() => {
    if (hasLoadedProfile.current) return;
    hasLoadedProfile.current = true;
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (hasLoadedWorkload.current) return;
    hasLoadedWorkload.current = true;
    fetchWorkload(FIRST_OF_MONTH, LAST_OF_MONTH);
  }, [fetchWorkload]);

  const sortedTodaySchedules = useMemo(() => {
    if (!Array.isArray(todaySchedules)) return [];

    return [...todaySchedules].sort((a, b) => {
      const first = a?.start_hour || "";
      const second = b?.start_hour || "";
      return first.localeCompare(second);
    });
  }, [todaySchedules]);

  const handleRefreshTodaySchedules = () => {
    refreshTodaySchedules();
  };

  const roleDisplay = useMemo(() => {
    const roles = profile?.user?.roles;
    if (!Array.isArray(roles) || roles.length === 0) return "--";
    return roles.map((role) => role?.name).filter(Boolean).join(", ");
  }, [profile]);

  const profileAvatar =
    profile?.avatar_url ||
    "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png";

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

          {/* <h1 className="text-xl font-bold text-blue-700 mb-6">
            Thông tin Giảng viên
          </h1> */}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Avatar + Basic Info */}
                <div className="md:col-span-1 flex justify-center items-center">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mb-4 transition-all transform hover:scale-105">
                      <img
                        src={profileAvatar}
                        alt="Teacher avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>



                {/* Center: Main Info */}
                <div className="md:col-span-1 space-y-3">
                  <div>
                    <span className="text-gray-600">Mã nhân sự:</span>
                    <span className="ml-2 font-semibold">{profile?.teacher_code || "--"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="ml-2 font-semibold">{profile?.full_name || "--"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">{profile?.email || "--"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngày sinh:</span>
                    <span className="ml-2">{formatDate(profile?.dob)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="ml-2">{getUserStatusLabel(profile?.user?.status)}</span>
                  </div>
                </div>

                {/* Right: Academic Info */}
                <div className="md:col-span-1 space-y-3">
                  <div>
                    <span className="text-gray-600">Khoa:</span>
                    <span className="ml-2 font-semibold">{profile?.department || "--"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="ml-2">{profile?.phone || "--"}</span>
                  </div>
                  {/* <div>
                    <span className="text-gray-600">Giờ làm việc:</span>
                    <span className="ml-2">{profile?.office_hours || "--"}</span>
                  </div> */}
                  <div>
                    <span className="text-gray-600">Vai trò:</span>
                    <span className="ml-2">{getRoleLabel(roleDisplay)}</span>
                  </div>
                  {/* <div>
                    <span className="text-gray-600">Tên đăng nhập:</span>
                    <span className="ml-2">{profile?.user?.user_name || "--"}</span>
                  </div> */}
                </div>
              </div>

              {profileLoading && (
                <p className="mt-4 text-xs text-slate-400">Đang tải thông tin giảng viên...</p>
              )}

              {profileError && !profileLoading && (
                <p className="mt-4 text-xs text-red-500">{profileError}</p>
              )}

              {/* Bottom Section: Notifications & Schedule */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Notifications */}
                <div className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-200">
                  <div className="flex justify-center mb-3">
                    <div className="relative">
                      <Bell className="w-8 h-8 text-green-600" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        0
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Nhắc nhắc mới, chưa xem
                  </p>
                  <p className="text-4xl font-bold text-green-700 mt-2">0</p>
                  <a href="#" className="text-sm text-green-600 hover:underline mt-3 inline-block">
                    Xem chi tiết
                  </a>
                </div>

                {/* Weekly Classes */}
                <div className="bg-blue-50 rounded-lg p-6 text-center border-2 border-blue-200">
                  <div className="flex justify-center mb-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Buổi dạy trong tuần</p>
                  <p className="text-4xl font-bold text-blue-700 mt-2">
                    {workloadLoading ? '...' : (workload?.overview?.week_sessions ?? 0)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">buổi học</p>
                </div>

                {/* Tháng này */}
                <div className="bg-orange-50 rounded-lg p-6 text-center border-2 border-orange-200">
                  <div className="flex justify-center mb-3">
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Đã tạo ĐD tháng này</p>
                  <p className="text-4xl font-bold text-orange-700 mt-2">
                    {workloadLoading
                      ? '...'
                      : `${workload?.overview?.total_created ?? 0}/${workload?.overview?.total_sessions ?? 0}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">buổi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-1 mt-6">
        <AttendanceCalendar
          data={workload?.data || []}
          overview={workload?.overview || {}}
          loading={workloadLoading}
          fromDate={calFrom}
          onFilter={handleCalFilter}
        />





        {/* LỊCH DẠY HÔM NAY */}
        <div className="lg:row-span-2 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-blue-500">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Lịch dạy hôm nay</p>
                <p className="text-[11px] text-blue-100">
                  {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRefreshTodaySchedules}
              disabled={todayLoading}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition disabled:opacity-40"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 text-white ${todayLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Badge đếm */}
          {sortedTodaySchedules.length > 0 && (
            <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100">
              <span className="text-xs font-semibold text-blue-600">
                {sortedTodaySchedules.length} buổi dạy
              </span>
            </div>
          )}

          {/* Danh sách – có thanh trượt */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 max-h-[420px] sidebar-scroll">

            {/* Loading skeleton */}
            {todayLoading && sortedTodaySchedules.length === 0 && (
              <div className="space-y-2.5 pt-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[72px] rounded-xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            )}

            {/* Error */}
            {todayError && sortedTodaySchedules.length === 0 && !todayLoading && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-xs text-red-600 mb-2">{todayError}</p>
                <button
                  type="button"
                  onClick={handleRefreshTodaySchedules}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Tải lại
                </button>
              </div>
            )}

            {/* Schedule items */}
            {sortedTodaySchedules.map((schedule, index) => {
              const typeLabel =
                schedule?.schedule_type === 'practice' ? 'Thực hành' :
                schedule?.schedule_type === 'theory' ? 'Lý thuyết' : null;
              const typeColor =
                schedule?.schedule_type === 'practice'
                  ? 'bg-violet-100 text-violet-600'
                  : 'bg-sky-100 text-sky-600';

              return (
                <div
                  key={schedule?.id || index}
                  onClick={() => navigate('/dashboard/study-session', { state: { schedule } })}
                  className="group rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200 hover:shadow-md p-3.5 cursor-pointer transition-all"
                >
                  {/* Time pill + type badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {formatTime(schedule?.start_hour)} – {formatTime(schedule?.end_hour)}
                    </div>
                    {typeLabel && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor}`}>
                        {typeLabel}
                      </span>
                    )}
                  </div>

                  {/* Course name */}
                  <p className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors truncate">
                    {schedule?.courseSection?.name || 'Chưa có tên học phần'}
                  </p>

                  {/* Room + group */}
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {schedule?.room?.room_name || 'Chưa phân phòng'}
                    {schedule?.practiceGroup?.group_name && (
                      <span className="text-slate-400"> · {schedule.practiceGroup.group_name}</span>
                    )}
                  </p>
                </div>
              );
            })}

            {/* Empty */}
            {!todayLoading && sortedTodaySchedules.length === 0 && !todayError && (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Calendar className="w-10 h-10 mb-3 opacity-25" />
                <p className="text-xs font-medium">Hôm nay chưa có lịch dạy</p>
              </div>
            )}

            {/* Updating indicator */}
            {todayLoading && sortedTodaySchedules.length > 0 && (
              <p className="text-[11px] text-slate-400 text-center py-1">Đang cập nhật...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
