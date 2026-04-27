import React, { useMemo, useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  FileSpreadsheet,
  FilterX,
  Settings,
  FileSearchIcon,
  X,
} from "lucide-react";
import Pagination from "../common/Pagination";

const MODAL_TABLE_PAGE_SIZE = 8;

const formatTimeValue = (value) => {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const formatDateValue = (value) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

export default function ModalTeacherAttendanceDetail({
  isOpen,
  selectedCourse,
  onClose,
  filteredSessions,
  semesterOptions = [],
  selectedSemester,
  onSemesterChange,
  selectedMonth,
  onMonthChange,
  selectedStatus,
  onStatusChange,
}) {
  const [expanded, setExpanded] = useState(false);
  const [searchCourseCode, setSearchCourseCode] = useState("");
  const [searchCreator, setSearchCreator] = useState("");
  const [searchCourseName, setSearchCourseName] = useState("");
  const [searchClassName, setSearchClassName] = useState("");
  const [searchGroup, setSearchGroup] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sessionCurrentPage, setSessionCurrentPage] = useState(1);
  const [visibleCols, setVisibleCols] = useState({
    date: true,
    time: true,
    course: true,
    room: false,
    createdAt: true,
    creator: true,
    group: true,
    status: true,
    detail: true,
  });

  const sessionsToRender = useMemo(() => {
    const normalizedMonth = selectedMonth || "Tất cả";
    const normalizedStatus = selectedStatus || "Tất cả";

    return (filteredSessions || []).filter((session) => {
      if (fromDate && session.classDate && session.classDate < fromDate) return false;
      if (toDate && session.classDate && session.classDate > toDate) return false;

      if (normalizedMonth !== "Tất cả") {
        const monthLabel = new Date(`${session.classDate}T00:00:00`).toLocaleString("vi-VN", {
          month: "long",
        });
        if (monthLabel !== normalizedMonth) return false;
      }

      if (normalizedStatus !== "Tất cả") {
        const mappedStatus =
          normalizedStatus === "Đúng giờ"
            ? "on_time"
            : normalizedStatus === "Trễ"
              ? "late"
              : normalizedStatus === "Vắng mặt"
                ? "absent"
                : normalizedStatus.toLowerCase();

        if (String(session.lecturerAttendanceStatus || "").toLowerCase() !== mappedStatus) {
          return false;
        }
      }

      const code = String(session.courseCode || "").toLowerCase();
      const creator = String(session.creatorName || session.creatorCode || "").toLowerCase();
      const courseName = String(session.courseName || "").toLowerCase();
      const className = String(session.className || "").toLowerCase();
      const group = String(session.practiceGroupNumber || session.group || "").toLowerCase();

      if (searchCourseCode.trim() && !code.includes(searchCourseCode.trim().toLowerCase())) return false;
      if (searchCreator.trim() && !creator.includes(searchCreator.trim().toLowerCase())) return false;
      if (searchCourseName.trim() && !courseName.includes(searchCourseName.trim().toLowerCase())) return false;
      if (searchClassName.trim() && !className.includes(searchClassName.trim().toLowerCase())) return false;
      if (searchGroup.trim() && !group.includes(searchGroup.trim().toLowerCase())) return false;

      return true;
    });
  }, [filteredSessions, fromDate, toDate, selectedMonth, selectedStatus, searchCourseCode, searchCreator, searchCourseName, searchClassName, searchGroup]);

  const getStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase();

    switch (normalized) {
      case "on_time":
      case "ontime":
        return (
          <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle2 size={16} className="mr-1" /> Đúng giờ
          </span>
        );
      case "manual_override":
      case "manual":
        return (
          <span className="flex items-center text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle2 size={16} className="mr-1" /> Chấm tay
          </span>
        );
      case "late":
        return (
          <span className="flex items-center text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
            <AlertTriangle size={16} className="mr-1" /> Tạo QR muộn
          </span>
        );
      case "absent":
        return (
          <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
            <AlertTriangle size={16} className="mr-1" /> Vắng mặt
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
            <AlertTriangle size={16} className="mr-1" /> Chưa chốt
          </span>
        );
    }
  };

  const totalSessionPages = useMemo(
    () => Math.max(1, Math.ceil(sessionsToRender.length / MODAL_TABLE_PAGE_SIZE)),
    [sessionsToRender.length]
  );

  const boundedSessionCurrentPage = Math.min(sessionCurrentPage, totalSessionPages);

  const paginatedSessions = useMemo(() => {
    const startIndex = (boundedSessionCurrentPage - 1) * MODAL_TABLE_PAGE_SIZE;
    return sessionsToRender.slice(startIndex, startIndex + MODAL_TABLE_PAGE_SIZE);
  }, [sessionsToRender, boundedSessionCurrentPage]);

  if (!isOpen || !selectedCourse) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] overflow-hidden flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Chi tiết chấm công</h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedCourse.courseCode} - {selectedCourse.courseName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm text-gray-500">Tổng số buổi cần chấm</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {selectedCourse.totalSessions}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm text-gray-500">Đã chấm thành công</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {selectedCourse.successSessions}
              </p>
            </div>

            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm text-gray-500">Chấm thất bại / Cần kiểm tra</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {selectedCourse.failedSessions}
              </p>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-visible">
            <div className="px-5 py-4 border-b flex items-center gap-2 text-gray-800 font-semibold">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
              </svg>

              <span>Bộ lọc thống kê</span>

              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center text-blue-600 hover:text-blue-800 ml-auto text-sm"
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

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoảng ngày
                  </label>

                  <div className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2">
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => {
                        setFromDate(e.target.value);
                        setSessionCurrentPage(1);
                      }}
                      className="flex-1 outline-none min-w-0"
                    />
                    <span className="text-gray-400">&rarr;</span>
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => {
                        setToDate(e.target.value);
                        setSessionCurrentPage(1);
                      }}
                      className="flex-1 outline-none min-w-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Học kỳ/Năm học
                  </label>
                  <select
                    value={selectedSemester}
                    onChange={(e) => {
                      onSemesterChange(e.target.value);
                      setSessionCurrentPage(1);
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    {semesterOptions.map((semester, index) => (
                      <option key={index} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tháng
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      onMonthChange(e.target.value);
                      setSessionCurrentPage(1);
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Tất cả</option>
                    <option>Tháng 1</option>
                    <option>Tháng 2</option>
                    <option>Tháng 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      onStatusChange(e.target.value);
                      setSessionCurrentPage(1);
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Tất cả</option>
                    <option>Đúng giờ</option>
                    <option>Trễ</option>
                    <option>Vắng mặt</option>
                  </select>
                </div>

                {expanded && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã học phần
                      </label>
                      <input
                        type="text"
                        placeholder="Vi du: 4203001549"
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchCourseCode}
                        onChange={(e) => {
                          setSearchCourseCode(e.target.value);
                          setSessionCurrentPage(1);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Người tạo
                      </label>
                      <input
                        type="text"
                        placeholder="Vi du: Nguyen Van An"
                        className="w-full rounded-lg border px-3 py-2"
                        value={searchCreator}
                        onChange={(e) => {
                          setSearchCreator(e.target.value);
                          setSessionCurrentPage(1);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên học phần
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-3 py-2"
                        value={searchCourseName}
                        onChange={(e) => {
                          setSearchCourseName(e.target.value);
                          setSessionCurrentPage(1);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên lớp
                      </label>
                      <input
                        type="text"
                        placeholder="Vi du: 20TCLC_DT3"
                        className="w-full rounded-lg border px-3 py-2"
                        value={searchClassName}
                        onChange={(e) => {
                          setSearchClassName(e.target.value);
                          setSessionCurrentPage(1);
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nhóm thực hành
                      </label>
                      <input
                        type="text"
                        placeholder="Vi du: 1, 2, 3,..."
                        className="w-full rounded-lg border px-3 py-2"
                        value={searchGroup}
                        onChange={(e) => {
                          setSearchGroup(e.target.value);
                          setSessionCurrentPage(1);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-5 pt-5 border-t flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Hiển thị {sessionsToRender.length} buổi chấm công
                </p>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                  <button className="flex items-center justify-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200">
                    <FileSearchIcon className="w-5 h-5" />
                    Tìm kiếm
                  </button>

                  <button className="flex items-center justify-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200">
                    <FileSpreadsheet className="w-5 h-5" />
                    Tải Excel
                  </button>

                  <button className="flex items-center justify-center gap-2 border border-gray-400 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200">
                    <FilterX className="w-5 h-5" />
                    Xóa bộ lọc
                  </button>

                  <details className="relative">
                    <summary className="list-none flex items-center justify-center gap-2 border border-sky-300 text-sky-700 bg-white px-5 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-sky-50 hover:border-sky-400 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200">
                      <Settings className="w-5 h-5" />
                      Hiển thị cột
                    </summary>

                    <div className="absolute right-0 mt-2 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 text-sm">
                      {[
                        ["date", "Ngày"],
                        ["time", "Thời gian"],
                        ["course", "Môn học"],
                        ["room", "Phòng"],
                        ["createdAt", "Giờ tạo QR"],
                        ["creator", "Người tạo"],
                        ["group", "Nhóm thực hành"],
                        ["status", "Trạng thái"],
                      ].map(([key, label]) => {
                        const active = visibleCols[key];

                        return (
                          <div
                            key={key}
                            onClick={() =>
                              setVisibleCols((prev) => ({
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
                            {active && <span>v</span>}
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Danh sách buổi chấm công</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Theo dõi trạng thái tạo QR và ghi nhận điểm danh theo từng buổi.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {visibleCols.date && <th className="px-6 py-4">Ngày </th>}
                    {visibleCols.time && <th className="px-6 py-4">Thời gian</th>}
                    {visibleCols.course && <th className="px-6 py-4">Môn học</th>}
                    {visibleCols.room && <th className="px-6 py-4">Phòng</th>}
                    {visibleCols.createdAt && <th className="px-6 py-4">Giờ tạo QR</th>}
                    {visibleCols.creator && <th className="px-6 py-4">Người tạo</th>}
                    {visibleCols.group && <th className="px-6 py-4">Nhóm thực hành</th>}
                    {visibleCols.status && (
                      <th className="px-6 py-4 text-center">Trạng thái</th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {paginatedSessions.map((session, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      {visibleCols.date && (
                        <td className="px-6 py-4 font-medium">{formatDateValue(session.classDate)}</td>
                      )}

                      {visibleCols.time && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            {`${formatTimeValue(session.startHour)} - ${formatTimeValue(session.endHour)}`}
                          </div>
                        </td>
                      )}

                      {visibleCols.course && (
                        <td className="px-6 py-4">
                          <p className="font-medium">{session.courseCode}</p>
                          <p className="text-sm text-gray-600">{session.courseName}</p>
                        </td>
                      )}

                      {visibleCols.room && (
                        <td className="px-6 py-4 text-gray-600">{session.roomName || session.roomCode || "-"}</td>
                      )}

                      {visibleCols.createdAt && (
                        <td className="px-6 py-4">
                          {session.lecturerCheckinAt ? (
                            <span className="text-sm">{formatTimeValue(session.lecturerCheckinAt)}</span>
                          ) : (
                            <span className="text-red-600 text-sm">- Chưa tạo -</span>
                          )}
                        </td>
                      )}

                      {visibleCols.creator && (
                        <td className="px-6 py-4">
                          <p className="font-medium">{session.creatorName}</p>
                          <p className="text-sm text-gray-600">{session.creatorCode}</p>
                        </td>
                      )}

                      {visibleCols.group && (
                        <td className="px-6 py-4 text-center">{session.practiceGroupNumber || "-"}</td>
                      )}

                      {visibleCols.status && (
                        <td className="px-6 py-4 text-center">{getStatusBadge(session.lecturerAttendanceStatus)}</td>
                      )}
                    </tr>
                  ))}

                  {paginatedSessions.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                        Chưa có dữ liệu chấm công cho học phần này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-4 py-4 border-t bg-slate-50">
              <span className="text-sm text-gray-500">
                Đang hiển thị <strong>{paginatedSessions.length}</strong> / <strong>{sessionsToRender.length}</strong> buổi
              </span>
              <Pagination
                currentPage={boundedSessionCurrentPage}
                totalPages={totalSessionPages}
                onPageChange={setSessionCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}