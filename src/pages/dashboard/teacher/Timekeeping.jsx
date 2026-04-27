import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Star,
  FileSpreadsheet,
  FilterX,
  Eye,
  Settings,
  FileSearchIcon,
  Calendar
} from "lucide-react";
import { useAttendance } from "@contexts/AttendanceContext";
import ModalTeacherAttendanceDetail from "../../../components/modal/ModalTeacherAttendanceDetail";

const normalizeCourseProgress = (course = {}) => ({
  ...course,
  totalSessions: course.totalTeachingSessions || 0,
  successSessions: (course.onTimeCheckins || 0) + (course.lateCheckins || 0),
  failedSessions: course.absentCheckins || 0,
});

export default function TeacherAttendancePage() {
  const { fetchTeacherAttendanceDashboard } = useAttendance();
  const [selectedSemester, setSelectedSemester] = useState(
    ""
  );
  const [selectedMonth, setSelectedMonth] = useState("Tất cả");
  const [courseCodeFilter, setCourseCodeFilter] = useState("");
  const [courseNameFilter, setCourseNameFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    teacher: null,
    summary: {
      totalTeachingSessions: 0,
      onTimeCheckins: 0,
      lateCheckins: 0,
      absentCheckins: 0,
      manualOverrideCheckins: 0,
      attendanceRate: 0,
    },
    availableSemesters: [],
    courseProgress: [],
  });
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  const openDetailModal = (course) => {
    setSelectedCourse(course);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedCourse(null);
    setIsDetailModalOpen(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoadingDashboard(true);
      setDashboardError("");

      try {
        const response = await fetchTeacherAttendanceDashboard();
        if (!isMounted) return;

        if (response?.success && response?.data) {
          const payload = response.data;
          const courseProgress = Array.isArray(payload.courseProgress) ? payload.courseProgress.map(normalizeCourseProgress) : [];

          const availableSemesters = Array.isArray(payload.availableSemesters) ? payload.availableSemesters : [];

          setDashboardData({
            teacher: payload.teacher || null,
            summary: payload.summary || {
              totalTeachingSessions: 0,
              onTimeCheckins: 0,
              lateCheckins: 0,
              absentCheckins: 0,
              manualOverrideCheckins: 0,
              attendanceRate: 0,
            },
            availableSemesters,
            courseProgress,
          });

          if (availableSemesters.length > 0) {
            setSelectedSemester((current) => current || availableSemesters[0]);
          }
        } else {
          setDashboardError(response?.message || "Không thể tải dashboard chấm công");
        }
      } catch (error) {
        if (!isMounted) return;
        setDashboardError(error?.message || "Không thể tải dashboard chấm công");
      } finally {
        if (isMounted) {
          setIsLoadingDashboard(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [fetchTeacherAttendanceDashboard]);

  const courses = useMemo(() => {
    const allCourses = dashboardData.courseProgress || [];
    const normalizedSemester = selectedSemester || "";
    const codeQuery = courseCodeFilter.trim().toLowerCase();
    const nameQuery = courseNameFilter.trim().toLowerCase();

    return allCourses
      .filter((course) => {
        if (normalizedSemester && course.semester !== normalizedSemester) return false;
        if (codeQuery && !String(course.courseCode || "").toLowerCase().includes(codeQuery)) return false;
        if (nameQuery && !String(course.courseName || "").toLowerCase().includes(nameQuery)) return false;
        return true;
      })
      .map((course) => normalizeCourseProgress(course));
  }, [dashboardData.courseProgress, selectedSemester, courseCodeFilter, courseNameFilter]);

  const dashboardSummary = useMemo(() => {
    return courses.reduce(
      (acc, course) => ({
        totalSessions: acc.totalSessions + (course.totalSessions || 0),
        onTimeSessions: acc.onTimeSessions + (course.onTimeCheckins || 0),
        lateOrManual: acc.lateOrManual + (course.lateCheckins || 0) + (course.manualOverrideCheckins || 0),
        absentSessions: acc.absentSessions + (course.failedSessions || 0),
      }),
      { totalSessions: 0, onTimeSessions: 0, lateOrManual: 0, absentSessions: 0 }
    );
  }, [courses]);

  const filteredSessions = useMemo(() => {
    if (!selectedCourse?.sessions) return [];

    return selectedCourse.sessions.filter((session) => {
      if (selectedMonth !== "Tất cả") {
        const monthName = new Date(`${session.classDate}T00:00:00`).toLocaleString("vi-VN", {
          month: "long",
        });

        if (monthName !== selectedMonth) return false;
      }

      if (selectedStatus !== "Tất cả") {
        const normalizedStatus = String(session.lecturerAttendanceStatus || "").toLowerCase();
        const desiredStatus = selectedStatus === "Đúng giờ" ? "on_time"
            : selectedStatus === "Trễ" ? "late"
              : selectedStatus === "Vắng mặt" ? "absent" : selectedStatus.toLowerCase();

        if (normalizedStatus !== desiredStatus) return false;
      }

      return true;
    });
  }, [selectedCourse, selectedMonth, selectedStatus]);

  const handleResetFilters = () => {
    setSelectedSemester(dashboardData.availableSemesters[0] || "");
    setSelectedMonth("Tất cả");
    setCourseCodeFilter("");
    setCourseNameFilter("");
    setSelectedStatus("Tất cả");
  };

  const [visibleColsCourse, setVisibleColsCourse] = useState({
    course: true,
    process: true,
    status: true,
    action: true
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

        <div className="bg-white border shadow-sm rounded-b-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 text-3xl ">
              {dashboardData.teacher?.fullName?.charAt(0) || "G"}
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl font-bold text-gray-800">
                {dashboardData.teacher?.fullName || "Giảng viên"}
              </h2>
              <p className="text-gray-500 mt-1">
                Mã giảng viên: {dashboardData.teacher?.teacherCode || "-"}
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 w-full lg:w-auto text-center">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-600">
                  {isLoadingDashboard ? "..." : dashboardSummary.totalSessions}
                </p>
                <p className="text-sm text-gray-600 mt-1">Tổng tiết dạy</p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-emerald-600">
                  {isLoadingDashboard ? "..." : dashboardSummary.onTimeSessions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tiết tạo QR đúng giờ
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  {isLoadingDashboard ? "..." : dashboardSummary.lateOrManual}
                  <Star size={18} />
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tiết tạo QR muộn
                </p>
              </div>
            </div>
          </div>
        </div>

        {dashboardError ? (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {dashboardError}
          </div>
        ) : null}

        {/* Filter Section */}
        <div className="bg-white border  p-6">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>

            <span>Bộ lọc học phần thống kê</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã học phần
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseCodeFilter}
                    onChange={(e) => setCourseCodeFilter(e.target.value)}
                  />
                </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên học phần
              </label>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-2"
                value={courseNameFilter}
                onChange={(e) => setCourseNameFilter(e.target.value)}
              />    
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Học kỳ / năm học
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả</option>
                {dashboardData?.availableSemesters?.map((semester, index) => (
                  <option key={index} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>Tất cả</option>
                <option>Đúng giờ</option>
                <option>Trễ</option>
                <option>Vắng mặt</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <button
                className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
                type="button"
              >
                <FileSearchIcon className="w-5 h-5" />
                Tìm kiếm
              </button>

              <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200" type="button">
                <FileSpreadsheet className="w-5 h-5" />
                Tải Excel
              </button>

              <button
                className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                type="button"
                onClick={handleResetFilters}
              >
                <FilterX className="w-5 h-5" />
                Xóa bộ lọc
              </button>

              <details className="relative">
                <summary className="list-none flex items-center gap-2 border border-sky-300 text-sky-700 bg-sky px-5 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-sky-50 hover:border-sky-400 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200">
                  <Settings className="w-5 h-5" />
                  Hiển thị cột
                </summary>

                <div className="absolute right-0 mt-2 w-100% bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 text-sm">
                  {[
                    ["course", "Tên học phần"],
                    ["process", "Tiến trình"],
                    ["status", "Trạng thái"],
                    ["action", "Hành động"],
                  ].map(([key, label]) => {
                    const active = visibleColsCourse[key];

                    return (
                      <div
                        key={key}
                        onClick={() =>
                          setVisibleColsCourse((prev) => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className={`px-3 py-2 rounded cursor-pointer flex items-center justify-between transition
                          ${
                            active
                              ? "bg-sky-50 text-sky-600 font-medium"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Course List Table */}
        <div className="bg-white rounded-b-xl shadow-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {visibleColsCourse.course && (
                    <th className="px-6 py-4 text-left">Tên học phần</th>
                  )}
                  {visibleColsCourse.process && (
                    <th className="px-6 py-4 text-left">Tiến trình</th>
                  )}
                  {visibleColsCourse.status && (
                    <th className="px-6 py-4 text-center">Trạng thái</th>
                  )}
                  {visibleColsCourse.action && (
                    <th className="px-6 py-4 text-center">Hành động</th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {courses.map((course, i) => {
                  const percent = Math.round(
                    (course.successSessions / course.totalSessions) * 100
                  );

                  return (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      {visibleColsCourse.course && (
                        <td className="px-6 py-4">
                          <p className="font-medium">{course.courseCode}</p>
                          <p className="text-sm text-gray-600">
                            {course.courseName}
                          </p>
                        </td>
                      )}

                      {visibleColsCourse.process && (

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700 w-10">
                              {percent}%
                            </span>

                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${percent}%` }}
                              />
                            </div>

                            <span className="text-xs text-gray-500">
                              {course.successSessions}/{course.totalSessions}
                            </span>
                          </div>
                        </td>
                      )}

                      {visibleColsCourse.status && (

                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <span
                              className="inline-flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium"
                              title="Tổng số buổi cần chấm"
                            >
                              <Calendar size={16} />
                              {course.totalSessions}
                            </span>

                            <span
                              className="inline-flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm font-medium"
                              title="Số buổi đã chấm thành công"
                            >
                              <CheckCircle2 size={16} />
                              {course.successSessions}
                            </span>

                            <span
                              className="inline-flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm font-medium"
                              title="Số buổi chấm thất bại"
                            >
                              <AlertTriangle size={16} />
                              {course.failedSessions}
                            </span>
                          </div>
                        </td>
                      )}

                      {visibleColsCourse.action && (

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openDetailModal(course)}
                            className="p-2 rounded-full hover:bg-gray-100"
                            title="Xem chi tiết chấm công"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <ModalTeacherAttendanceDetail
          isOpen={isDetailModalOpen}
          selectedCourse={selectedCourse}
          onClose={closeDetailModal}
          filteredSessions={filteredSessions}
          semesterOptions={dashboardData.availableSemesters || []}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>
    </div>
  );
}