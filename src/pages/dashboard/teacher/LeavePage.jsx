import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Star, ArrowDown, ArrowUp, FileSpreadsheet, File, FilterX, FileSearchIcon
} from "lucide-react";
import { useLeaveDashboard } from "@contexts/LeaveDashboardContext";
import ModalViewLeaveRequest from "@components/modal/ModalViewLeaveRequest";

const toLower = (value) => String(value || "").toLowerCase().trim();

export default function LeavePage() {
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const {
    leaves,
    statistics,
    semesters: semesterValues,
    loading,
    error,
    fetchLeaveDashboard,
    approveLeaveRequest,
    rejectLeaveRequest,
    actionLoadingId,
  } = useLeaveDashboard();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailLeave, setSelectedDetailLeave] = useState(null);

  const [filters, setFilters] = useState({
    leaveDate: "",
    courseCode: "",
    courseName: "",
    className: "",
    studentCode: "",
    studentName: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    leaveDate: "",
    courseCode: "",
    courseName: "",
    className: "",
    studentCode: "",
    studentName: "",
  });

  useEffect(() => {
    fetchLeaveDashboard();
  }, [fetchLeaveDashboard]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const resetValue = {
      leaveDate: "",
      courseCode: "",
      courseName: "",
      className: "",
      studentCode: "",
      studentName: "",
    };

    setSelectedSemester("all");
    setStatusFilter("all");
    setFilters(resetValue);
    setAppliedFilters(resetValue);
  };

  const openRejectModal = (leaveItem) => {
    if (!leaveItem?.id || leaveItem?.status !== "pending") {
      return;
    }

    setSelectedLeave(leaveItem);
    setRejectReason("");
    setRejectError("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    if (actionLoadingId) {
      return;
    }

    setShowRejectModal(false);
    setSelectedLeave(null);
    setRejectReason("");
    setRejectError("");
  };

  const openDetailModal = (leaveItem) => {
    setSelectedDetailLeave(leaveItem || null);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDetailLeave(null);
  };

  /**
   * Duyệt đơn xin nghỉ
   */
  const handleApproveLeave = async (leaveItem) => {
    if (!leaveItem?.id || leaveItem?.status !== "pending") {
      return;
    }

    const confirmed = window.confirm("Bạn chắc chắn muốn duyệt đơn xin nghỉ này?");

    if (!confirmed) {
      return;
    }

    await approveLeaveRequest(leaveItem.id);
  };


  /**
   * Xử lý từ chối đơn xin nghỉ
   */
  const submitRejectLeave = async () => {

    if (!selectedLeave?.id) {
      return;
    }

    const reason = String(rejectReason || "").trim();
    if (reason.length < 10) {
      setRejectError("Lý do từ chối phải có ít nhất 10 ký tự");
      return;
    }

    setRejectError("");

    const result = await rejectLeaveRequest(selectedLeave.id, reason);

    if (result.success) {
      closeRejectModal();

    } else if (result.error) {
      setRejectError(result.error);
    }

  };

  const filtered = useMemo(() => {
    return leaves.filter((item) => {
      const semester = item?.classSession?.courseSection?.semester || "";
      const status = item?.status || "";
      const leaveDate = item?.classSession?.class_date || "";
      const courseCode = item?.classSession?.courseSection?.code || "";
      const courseName = item?.classSession?.courseSection?.name || "";
      const className = item?.student?.class_name || "";
      const studentCode = item?.student?.student_code || "";
      const studentName = item?.student?.full_name || "";

      if (selectedSemester !== "all" && semester !== selectedSemester) {
        return false;
      }

      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      if (appliedFilters.leaveDate && leaveDate !== appliedFilters.leaveDate) {
        return false;
      }

      if (appliedFilters.courseCode && !toLower(courseCode).includes(toLower(appliedFilters.courseCode))) {
        return false;
      }

      if ( appliedFilters.courseName && !toLower(courseName).includes(toLower(appliedFilters.courseName))    ) {
        return false;
      }

      if (appliedFilters.className && !toLower(className).includes(toLower(appliedFilters.className))) {
        return false;
      }

      if ( appliedFilters.studentCode && !toLower(studentCode).includes(toLower(appliedFilters.studentCode))) {
        return false;
      }

      if ( appliedFilters.studentName && !toLower(studentName).includes(toLower(appliedFilters.studentName)) ) {
        return false;
      }

      return true;
    });
  }, [appliedFilters, leaves, selectedSemester, statusFilter]);

  const semesterOptions = useMemo(() => {
    const values = Array.isArray(semesterValues) ? semesterValues
      : [...new Set(leaves.map((item) => item?.classSession?.courseSection?.semester).filter(Boolean))];

    return [
      { value: "all", label: "Tất cả học kỳ" },
      ...values.map((semester) => ({ value: semester, label: semester })),
    ];
  }, [leaves, semesterValues]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
      <div className="bg-white border shadow-sm rounded-b-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">

          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
            <AlertCircle size={30} />
          </div>

          {/* Title */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl font-bold text-gray-800">
              Thống kê minh chứng
            </h2>
            <p className="text-gray-500 mt-1">
              Tổng hợp tình trạng xử lý đơn nghỉ học
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto text-center">

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-blue-600">
                {statistics.total}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Tổng đơn xin
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-emerald-600">
                {statistics.pending}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Chờ duyệt đơn
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-1">
                {statistics.approved}
                <Star size={18} />
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Đã duyệt
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-purple-600">
                {statistics.rejected}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Từ chối
              </p>
            </div>

          </div>
        </div>
      </div>
      <div className="bg-white border  p-6">
        {/* Header */}
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
          <span>Bộ lọc đơn xin phép</span>
          <button onClick={() => setExpanded(!expanded)} className="flex items-center text-blue-600 hover:text-blue-800 ml-auto">
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

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Học kỳ / năm học
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {semesterOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái đơn
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày nghỉ
            </label>
            <input
              type="date"
              value={filters.leaveDate}
              onChange={(e) => handleFilterChange("leaveDate", e.target.value)}
              placeholder="Ví dụ: 05/04/2025"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã học phần
            </label>
            <input
              type="text"
              value={filters.courseCode}
              onChange={(e) => handleFilterChange("courseCode", e.target.value)}
              placeholder="Ví dụ: 4203001549"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {expanded && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên môn học / học phần
                </label>
                <input
                  type="text"
                  value={filters.courseName}
                  onChange={(e) => handleFilterChange("courseName", e.target.value)}
                  placeholder="Ví dụ: Lập trình thiết bị di động"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên lớp
                </label>
                <input
                  type="text"
                  value={filters.className}
                  onChange={(e) => handleFilterChange("className", e.target.value)}
                  placeholder="Ví dụ: 20TCLC_DT3"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số sinh viên
                </label>
                <input
                  type="text"
                  value={filters.studentCode}
                  onChange={(e) => handleFilterChange("studentCode", e.target.value)}
                  placeholder="Ví dụ: 21210001"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên sinh viên
                </label>
                <input
                  type="text"
                  value={filters.studentName}
                  onChange={(e) => handleFilterChange("studentName", e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Anh"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            {/* Xóa bộ lọc */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
            >
              <FileSearchIcon className="w-5 h-5" />
              Tìm kiếm
            </button>
            <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200">
              <FileSpreadsheet className="w-5 h-5" />
              Tải Excel
            </button>
            <button className="flex items-center gap-2 border border-amber-400 text-amber-400 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none hover:bg-amber-50 focus:ring-1 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200">
              <File className="w-5 h-5" />
              Tải PDF
            </button>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
            >
              <FilterX className="w-5 h-5" />
              Xóa bộ lọc
            </button>

          </div>

        </div>
      </div>

      <div className="mx-auto">
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {error && (
              <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Sinh viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ngày nghỉ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Học phần
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Lý do
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Không có đơn xin nghỉ phù hợp với bộ lọc
                    </td>
                  </tr>
                )}

                {!loading && filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    {/* Sinh viên */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{item?.student?.full_name || '-'}</p>
                        <p className="text-sm text-gray-500">{item?.student?.student_code || '-'}</p>
                      </div>
                    </td>

                    {/* Ngày nghỉ */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar size={14} />
                        {item?.classSession?.class_date ? new Date(item.classSession.class_date).toLocaleDateString("vi-VN") : "-"}
                      </div>
                    </td>

                    {/* Học phần */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{item?.classSession?.courseSection?.name || '-'}</p>
                      <p className="text-xs text-gray-500">{item?.student?.class_name || '-'}</p>
                    </td>

                    {/* Lý do */}
                    <td className="px-6 py-4">
                      <p className="text-sm italic text-gray-700 line-clamp-2">
                        {item?.note || '-'}
                      </p>
                      {(item?.status === "approved" || item?.status === "rejected") && (
                        <p className="text-xs italic text-gray-500 mt-1">
                          Ghi chú: {item?.status === "approved" ? "Đã duyệt" : (item?.rejected_reason || "Từ chối")}
                        </p>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${getStatusBadge(
                          item?.status
                        )}`}
                      >
                        {getStatusIcon(item?.status)}
                        {item?.status === "approved"
                          ? "Đã duyệt"
                          : item?.status === "rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"}
                      </div>
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item?.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApproveLeave(item)}
                              disabled={actionLoadingId === item.id}
                              title="Duyệt đơn"
                              className="p-2 rounded-full hover:bg-emerald-50 text-emerald-600 transition disabled:opacity-50"
                            >
                              <CheckCircle size={18} />
                            </button>

                            <button
                              onClick={() => openRejectModal(item)}
                              disabled={actionLoadingId === item.id}
                              title="Từ chối đơn"
                              className="p-2 rounded-full hover:bg-red-50 text-red-600 transition disabled:opacity-50"
                            >
                              <XCircle size={18} />
                            </button>

                          </>
                        )}

                        <button
                          onClick={() => openDetailModal(item)}
                          className="p-2 rounded-full hover:bg-gray-100 transition"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/** Modal từ chối đơn */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            <div className="border-b px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-800">Từ chối đơn xin nghỉ</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedLeave?.student?.full_name || "Sinh viên"} - {selectedLeave?.student?.student_code || ""}
              </p>
            </div>

            <div className="px-5 py-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">Lý do từ chối</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Nhập lý do từ chối (tối thiểu 10 ký tự)"
                className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />

              {rejectError && (
                <p className="mt-2 text-sm text-red-600">{rejectError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t px-5 py-4">
              <button
                onClick={closeRejectModal}
                disabled={actionLoadingId === selectedLeave?.id}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                onClick={submitRejectLeave}
                disabled={actionLoadingId === selectedLeave?.id}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoadingId === selectedLeave?.id ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
              
            </div>
          </div>
        </div>
      )}

      <ModalViewLeaveRequest
        isOpen={showDetailModal}
        onClose={closeDetailModal}
        leaveData={selectedDetailLeave}
      />
    </div>
  );
}
