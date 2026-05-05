import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    FileSpreadsheet,
    FilterX,
    Settings, X, FileSearchIcon, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAttendance } from "@contexts/AttendanceContext";
import Pagination from "../../../../components/common/Pagination";

const ITEMS_PER_PAGE = 10;

const formatDateTime = (isoValue) => {
    if (!isoValue) return "--";

    const date = new Date(isoValue);
    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

const getScheduleTypeLabel = (scheduleType) => {
    if (scheduleType === "practice") return "TH";
    if (scheduleType === "theory") return "LT";
    return "--";
};

const QRCodeTab = ({ schedule }) => {
    const navigate = useNavigate();

    const {
        history,
        historyLoading,
        historyError,
        fetchSessionHistory,
        clearSessionHistory,
    } = useAttendance();

    const [expanded, setExpanded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        teacherCode: "",
        teacherName: "",
        createdDate: "",
        scheduleType: "all",
        practiceGroup: "",
        creator: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({
        teacherCode: "",
        teacherName: "",
        createdDate: "",
        scheduleType: "all",
        practiceGroup: "",
        creator: "",
    });

    const [visibleCols, setVisibleCols] = useState({
        mahocphan: true,
        tenhocphan: true,
        thoigiantao: true,
        ketthucqr: true,
        magv: false,
        loailich: true,
        nhomth: true,
        tengiangvien: true,
        nguoitao: true,
        siso: true,
        diemdanhthanhcong: true,
        diemdanhthatbai: true,
        hanhdong: true,
    });

    // drawer xuất excel
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const closeDrawer = () => setIsDrawerOpen(false);

    const courseSectionId = schedule?.course_section_id || schedule?.courseSection?.id || null;
    const practiceGroupId = schedule?.practice_group_id || schedule?.practiceGroup?.id || null;

    useEffect(() => {
        if (!courseSectionId) {
            clearSessionHistory();
            return;
        }

        fetchSessionHistory({
            courseSectionId,
            practiceGroupId,
            page: 1,
            limit: 50,
        });
    }, [courseSectionId, practiceGroupId, fetchSessionHistory, clearSessionHistory]);

    const filteredSessions = useMemo(() => {
        const currentScheduleType = getScheduleTypeLabel(schedule?.schedule_type);
        const currentPracticeGroup =
            schedule?.practiceGroup?.group_name || schedule?.practiceGroup?.groupName || "";

        return history.filter((item) => {
            const teacherCodeQuery = appliedFilters.teacherCode.trim().toLowerCase();
            const teacherNameQuery = appliedFilters.teacherName.trim().toLowerCase();
            const createdDate = appliedFilters.createdDate;
            const scheduleTypeFilter = appliedFilters.scheduleType;
            const practiceGroupQuery = appliedFilters.practiceGroup.trim().toLowerCase();
            const creatorQuery = appliedFilters.creator.trim().toLowerCase();

            const createdAtDate = item?.created_at ? String(item.created_at).slice(0, 10) : "";
            const creatorName = String(item?.creator_name || "").toLowerCase();
            const creatorEmail = String(item?.creator_email || "").toLowerCase();
            const creatorId = String(item?.created_by || "").toLowerCase();
            const practiceGroupValue = String(currentPracticeGroup).toLowerCase();

            const matchTeacherCode =
                !teacherCodeQuery ||
                creatorId.includes(teacherCodeQuery) ||
                creatorEmail.includes(teacherCodeQuery);
            const matchTeacherName = !teacherNameQuery || creatorName.includes(teacherNameQuery);
            const matchCreatedDate = !createdDate || createdAtDate === createdDate;
            const matchScheduleType = scheduleTypeFilter === "all" || currentScheduleType === scheduleTypeFilter;
            const matchPracticeGroup = !practiceGroupQuery || practiceGroupValue.includes(practiceGroupQuery);
            const matchCreator = !creatorQuery || creatorName.includes(creatorQuery);

            return (
                matchTeacherCode &&
                matchTeacherName &&
                matchCreatedDate &&
                matchScheduleType &&
                matchPracticeGroup &&
                matchCreator
            );
        });
    }, [history, schedule, appliedFilters]);

    const handleSearch = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        const resetValues = {
            teacherCode: "",
            teacherName: "",
            createdDate: "",
            scheduleType: "all",
            practiceGroup: "",
            creator: "",
        };

        setFilters(resetValues);
        setAppliedFilters(resetValues);
        setCurrentPage(1);
    };

    const totalPages = Math.max(1, Math.ceil(filteredSessions.length / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const paginatedSessions = filteredSessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const courseCode = schedule?.courseSection?.code || schedule?.course_code || "--";
    const courseName = schedule?.courseSection?.name || schedule?.course_name || "--";
    const scheduleType = getScheduleTypeLabel(schedule?.schedule_type);
    const practiceGroupName = schedule?.practiceGroup?.group_name || schedule?.practiceGroup?.groupName || "";
    const visibleColumnCount =
        1 +
        Object.values(visibleCols).filter(Boolean).length +
        (visibleCols.diemdanhthatbai ? 1 : 0);

    const handleOpenSessionDetail = (sessionItem) => {
        if (!sessionItem) return;

        const selectedClassSessionId = sessionItem.class_session_id || schedule?.id || null;

        const schedulePayload = {
            ...schedule,
            id: selectedClassSessionId,
            class_session_id: selectedClassSessionId,
            class_date: sessionItem.class_date,
            start_hour: sessionItem.start_hour,
            session_number: sessionItem.session_number,
            room: {
                ...(schedule?.room || {}),
                room_name: sessionItem.room_name || schedule?.room?.room_name,
            },
            attendanceSession: {
                ...(schedule?.attendanceSession || {}),
                id: sessionItem.id,
                status: sessionItem.status,
                created_at: sessionItem.created_at,
                expires_at: sessionItem.expires_at,
                session_duration_minutes: sessionItem.session_duration_minutes,
                qr_interval: sessionItem.qr_interval,
                quorum_met: sessionItem.quorum_met,
            },
            selectedHistorySession: sessionItem,
        };

        const sessionDetailPayload = {
            schedule: schedulePayload,
            session: sessionItem,
        };

        sessionStorage.setItem("attendanceSchedule", JSON.stringify(schedulePayload));
        sessionStorage.setItem("attendanceSessionDetail", JSON.stringify(sessionDetailPayload));

        navigate("/dashboard/qrcode-session-detail", {
            state: { sessionDetail: sessionDetailPayload },
        });
    };



    return (
        <div className="rounded-b-xl bg-white p-6 shadow-sm">
            {/* Bộ lọc */}
            <div className="bg-white p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
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
                        className="ml-auto flex items-center text-blue-600 hover:text-blue-800"
                    >
                        {expanded ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span className="ml-1">
                            {expanded ? "Thu gọn" : "Mở rộng"}
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Mã giảng viên
                        </label>
                        <input
                            value={filters.teacherCode}
                            onChange={(e) => setFilters((prev) => ({ ...prev, teacherCode: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tên giảng viên
                        </label>
                        <input
                            value={filters.teacherName}
                            onChange={(e) => setFilters((prev) => ({ ...prev, teacherName: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Ngày tạo QR
                        </label>
                        <input
                            type="date"
                            value={filters.createdDate}
                            onChange={(e) => setFilters((prev) => ({ ...prev, createdDate: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Hình thức học
                        </label>
                        <select
                            value={filters.scheduleType}
                            onChange={(e) => setFilters((prev) => ({ ...prev, scheduleType: e.target.value }))}
                            className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value="all">Tất cả</option>
                            <option value="LT">Lý thuyết</option>
                            <option value="TH">Thực hành</option>
                        </select>
                    </div>

                    {expanded && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nhóm thực hành
                                </label>
                                <input
                                    value={filters.practiceGroup}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, practiceGroup: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Người tạo QR
                                </label>
                                <input
                                    value={filters.creator}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, creator: e.target.value }))}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                        </>
                    )}
                </div>

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
                        <button className="flex items-center gap-2 border border-teal-500 text-teal-600 px-5 py-2.5 rounded-lg hover:bg-teal-50" onClick={() => setIsDrawerOpen(true)}>
                            <FileSpreadsheet className="w-5 h-5" />
                            Tải Excel
                        </button>

                        <button
                            onClick={handleResetFilters}
                            className="flex items-center gap-2 border px-5 py-2.5 rounded-lg hover:bg-gray-50"
                        >
                            <FilterX className="w-5 h-5" />
                            Xóa bộ lọc
                        </button>

                        <details className="relative">
                            <summary className="list-none cursor-pointer flex items-center gap-2 border px-5 py-2.5 rounded-lg hover:bg-gray-50">
                                <Settings className="w-5 h-5" />
                                Hiển thị cột
                            </summary>

                            <div className="absolute right-0 mt-2 w-100% bg-white border rounded-lg shadow p-2 z-20">
                                {[
                                    ["mahocphan", "Mã học phần"],
                                    ["tenhocphan", "Tên học phần"],
                                    ["thoigiantao", "Thời gian tạo"],
                                    ["ketthucqr", "Kết thúc QR"],
                                    ["magv", "Mã GV"],
                                    ["loailich", "Loại lịch"],
                                    ["nhomth", "Nhóm TH"],
                                    ["tengiangvien", "Tên giảng viên"],
                                    ["nguoitao", "Người tạo"],
                                ].map(([key, label]) => (
                                    <div
                                        key={key}
                                        onClick={() =>
                                            setVisibleCols((p) => ({ ...p, [key]: !p[key] }))
                                        }
                                        className={`px-3 py-2 rounded cursor-pointer ${visibleCols[key]
                                            ? "bg-sky-50 text-sky-600 font-medium"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </details>
                </div>
                </div>

            </div>

            {/* Action buttons */}

            {/* Table */}
            <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-10 bg-gray-100">
                        <tr>
                            <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">STT</th>
                            
                            {visibleCols.mahocphan && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Mã HP
                                </th>
                            )}

                            {visibleCols.tenhocphan && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Tên HP
                                </th>
                            )}

                            {visibleCols.thoigiantao && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Tạo QR
                                </th>
                            )}

                            {visibleCols.ketthucqr && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Kết thúc
                                </th>
                            )}

                            {visibleCols.magv && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Mã GV
                                </th>
                            )}

                            {visibleCols.loailich && (
                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                    Loại
                                </th>
                            )}

                            {visibleCols.nhomth && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Nhóm TH
                                </th>
                            )}

                            {visibleCols.tengiangvien && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Giảng viên
                                </th>
                            )}

                            {visibleCols.nguoitao && (
                                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">
                                    Người tạo
                                </th>
                            )}

                            {visibleCols.siso && (
                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                    Sĩ số
                                </th>
                            )}

                            {visibleCols.diemdanhthanhcong && (
                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                    Điểm danh thành công
                                </th>
                            )}

                            {visibleCols.diemdanhthatbai && (
                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                    Điểm danh thất bại
                                </th>
                            )}

                            {visibleCols.hanhdong && (
                                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                                    Hành động
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="bg-white">
                        {historyLoading && (
                            <tr>
                                <td className="px-4 py-8 text-center text-gray-500" colSpan={visibleColumnCount}>
                                    Đang tải lịch sử phiên điểm danh...
                                </td>
                            </tr>
                        )}

                        {!historyLoading && historyError && (
                            <tr>
                                <td className="px-4 py-8 text-center text-red-500" colSpan={visibleColumnCount}>
                                    {historyError}
                                </td>
                            </tr>
                        )}

                        {!historyLoading && !historyError && filteredSessions.length === 0 && (
                            <tr>
                                <td className="px-4 py-8 text-center text-gray-500" colSpan={visibleColumnCount}>
                                    Không có dữ liệu lịch sử phiên điểm danh.
                                </td>
                            </tr>
                        )}

                        {!historyLoading && !historyError && paginatedSessions.map((item, index) => {
                            const total = Number(item?.stats?.total || 0);
                            const attended = Number(item?.stats?.attended || 0);
                            const failed = Math.max(0, total - attended);

                            return (
                                <tr key={item.id} className="odd:bg-white even:bg-slate-50/60 hover:bg-sky-50/60 transition-colors">
                                    <td className="border-b border-gray-100 px-4 py-3 text-center font-medium text-gray-700">{startIndex + index + 1}</td>
                                    
                                    {visibleCols.mahocphan && (
                                        <td className="border-b border-gray-100 px-4 py-3 font-medium text-gray-800">
                                            {courseCode}
                                        </td>
                                    )}

                                    {visibleCols.tenhocphan && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                            {courseName}
                                        </td>
                                    )}

                                    {visibleCols.thoigiantao && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                            {formatDateTime(item?.created_at)}
                                        </td>
                                    )}

                                    {visibleCols.ketthucqr && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                            {formatDateTime(item?.expires_at)}
                                        </td>
                                    )}

                                    {visibleCols.magv && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                            {item?.created_by || "--"}
                                        </td>
                                    )}

                                    {visibleCols.loailich && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-center text-gray-700">
                                            {scheduleType}
                                        </td>
                                    )}

                                    {visibleCols.nhomth && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                            {practiceGroupName || "--"}
                                        </td>
                                    )}

                                    {visibleCols.tengiangvien && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                            {item?.creator_name || "--"}
                                        </td>
                                    )}

                                    {visibleCols.nguoitao && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-gray-700">
                                            {item?.creator_name || "--"}
                                        </td>
                                    )}

                                    {visibleCols.siso && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-center font-medium text-gray-700">
                                            {total}
                                        </td>
                                    )}

                                    {visibleCols.diemdanhthanhcong && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-center">
                                            <span className="inline-flex min-w-12 justify-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {attended}
                                            </span>
                                        </td>
                                    )}

                                    {visibleCols.diemdanhthatbai && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-center">
                                            <span className="inline-flex min-w-12 justify-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                                                {failed}
                                            </span>
                                        </td>
                                    )}

                                    {visibleCols.hanhdong && (
                                        <td className="border-b border-gray-100 px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenSessionDetail(item)}
                                                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                                                title="Xem chi tiết"
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

            {!historyLoading && !historyError && (
                <div className="mt-4">
                    <Pagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* xuất excel */}
            {isDrawerOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[999]"
                        onClick={closeDrawer}
                    />

                    {/* Drawer */}
                    <div className=" fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl  flex flex-col">
                        {/* ================= HEADER ================= */}
                        <div className="flex items-center justify-between px-6 py-5 border-b bg-blue-300">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Hỗ trợ xuất Excel
                            </h3>

                            <button
                                onClick={closeDrawer}
                                className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-lime-300 transition-all duration-300 hover:rotate-90"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ================= BODY (SCROLL) ================= */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đặt tên file Excel
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên Sheet
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Chọn cột xuất Excel
                                </label>
                                <div className="space-y-2 mt-2">
                                    {Object.entries(visibleCols).map(([key, isVisible]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={isVisible}
                                                onChange={() =>
                                                    setVisibleCols((prev) => ({
                                                        ...prev,
                                                        [key]: !prev[key],

                                                    }))
                                                }
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                        {/* ================= FOOTER ================= */}
                        <div className=" sticky bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
                            <button
                                onClick={closeDrawer}
                                className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            >
                                Xuất Excel
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default QRCodeTab;
