import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Send,
    Eye,
    Clock,
    Book,
    User,
    Layers,
    X,
    Download,
    DownloadCloudIcon,
    DownloadIcon,
    MoveDownLeftIcon,
    Camera, // Thêm icon X để đóng drawer
} from "lucide-react";
import TeacherPhotosModal from "./components/TeacherPhotosModal";
import { useCourse } from "@contexts/CourseContext";
import { useAttendance } from "@contexts/AttendanceContext";
import Pagination from "../../../components/common/Pagination";

const ViewIcon = Eye;

const AdminSessionQRPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);
    const { teacher, course } = location.state || {};

    const {
        teacherCourseAssignments,
        teacherCourseAssignmentsLoading,
        teacherCourseAssignmentsError,
        fetchTeacherCourseAssignments,
    } = useCourse();

    const {
        history,
        historyLoading,
        historyError,
        historyPagination,
        fetchSessionHistory,
    } = useAttendance();

    const teacherId = teacher?.id || teacher?.personnelId;
    const courseSectionId = course?.id || course?.course_section_id;
    const [selectedPracticeGroupId, setSelectedPracticeGroupId] = useState(undefined);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterDate, setFilterDate] = useState("");
    const SESSION_LIMIT = 15;
    // XEM Ảnh
    const [isOpen, setOpen] = useState(false);
    const [selectedClassSessionId, setSelectedClassSessionId] = useState(null);
    // Giả lập dữ liệu ảnh (thực tế sẽ lấy từ API/backend)
    const teacherPhotos = [
        {
            id: 1,
            url: "/public/assets/images/_34A8269.jpg",
            caption: "Ghi số lượng sv..............",
        },
        {
            id: 2,
            url: "/public/assets/images/_34A8289.jpg",
            caption: "Ghi số lượng sv..............",
        },
        {
            id: 3,
            url: "/public/assets/images/_34A8277.jpg",
            caption: "Ghi số lượng sv..............",
        },
        {
            id: 4,
            url: "/public/assets/images/_34A8304.jpg",
            caption: "Ghi số lượng sv..............",
        },
    ];

    const formatDate = (value) => {
        if (!value) return "--";
        const dateValue = new Date(value);
        if (Number.isNaN(dateValue.getTime())) return value;
        return dateValue.toLocaleDateString("vi-VN");
    };

    const formatTimeValue = (value) => {
        if (!value) return "--:--";
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return String(value);
        
        return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
    };

    const getRowDate = (row) => {
        if (row.class_date) return row.class_date;

        if (row.created_at) {
            const createdAt = new Date(row.created_at);
            if (!Number.isNaN(createdAt.getTime())) {
                return createdAt.toISOString().slice(0, 10);
            }
        }

        return "";
    };

    useEffect(() => {
        if (!teacherId || !courseSectionId) return;
        fetchTeacherCourseAssignments(teacherId, courseSectionId);
    }, [teacherId, courseSectionId, fetchTeacherCourseAssignments]);

    const { theoryAssignments, practiceAssignments } = useMemo(() => {
        const assignments = teacherCourseAssignments?.assignments || [];
        return {
            theoryAssignments: assignments.filter((assignment) => assignment.practice_group_id === null),
            practiceAssignments: assignments.filter((assignment) => assignment.practice_group_id !== null),
        };
    }, [teacherCourseAssignments]);

    const assignmentTeacher = teacherCourseAssignments?.teacher || teacher || {};
    const selectedCreatorId = assignmentTeacher?.id || teacherId || null;
    const displayTeacherName = assignmentTeacher.full_name || teacher?.full_name || "Chưa cập nhật";
    const displayTeacherCode = assignmentTeacher.teacher_code || assignmentTeacher.code || teacher?.teacher_code || "---";

    const defaultPracticeGroupId = useMemo(() => {
        if (theoryAssignments.length > 0) return null;
        if (practiceAssignments.length > 0) {
            return practiceAssignments[0].practice_group_id ?? null;
        }
        return null;
    }, [theoryAssignments, practiceAssignments]);

    const resolvedPracticeGroupId = useMemo(() => {
        if (selectedPracticeGroupId === undefined) return defaultPracticeGroupId;
        if (selectedPracticeGroupId === null) return null;

        const exists = practiceAssignments.some(
            (assignment) => assignment.practice_group_id === selectedPracticeGroupId
        );

        return exists ? selectedPracticeGroupId : defaultPracticeGroupId;
    }, [selectedPracticeGroupId, defaultPracticeGroupId, practiceAssignments]);

    const handleSelectTheory = () => {
        setSelectedPracticeGroupId(null);
    };

    const handleSelectPractice = (practiceGroupId) => {
        setSelectedPracticeGroupId(practiceGroupId ?? null);
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [courseSectionId, selectedCreatorId, resolvedPracticeGroupId]);

    useEffect(() => {
        let isActive = true;

        const loadSessionHistory = async () => {
            if (!courseSectionId || !selectedCreatorId) return;

            try {
                const response = await fetchSessionHistory({
                    courseSectionId,
                    practiceGroupId: resolvedPracticeGroupId,
                    createdBy: selectedCreatorId,
                    page: currentPage,
                    limit: SESSION_LIMIT,
                });

                if (!isActive) return;

                if (response?.success) return;
            } catch (error) {
                if (!isActive) return;
            }
        };

        loadSessionHistory();

        return () => {
            isActive = false;
        };
    }, [
        courseSectionId,
        selectedCreatorId,
        resolvedPracticeGroupId,
        currentPage,
        fetchSessionHistory,
    ]);

    const filteredHistory = useMemo(() => {
        if (!filterDate) return history;
        return (history || []).filter((row) => getRowDate(row) === filterDate);
    }, [history, filterDate]);

    const handleOpenSessionDetail = (sessionItem) => {
        if (!sessionItem) return;

        const selectedClassSessionId = sessionItem.class_session_id || null;

        const schedulePayload = {
            id: selectedClassSessionId,
            class_session_id: selectedClassSessionId,
            class_date: sessionItem.class_date,
            start_hour: sessionItem.start_hour,
            session_number: sessionItem.session_number,
            practice_group_id: sessionItem.practice_group_id,
            practice_group_name: sessionItem.practice_group_name,
            practice_group_number: sessionItem.practice_group_number,
            room: {
                room_name: sessionItem.room_name,
            },
            attendanceSession: {
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
            course,
            teacher
        };

        sessionStorage.setItem("attendanceSchedule", JSON.stringify(schedulePayload));
        sessionStorage.setItem("attendanceSessionDetail", JSON.stringify(sessionDetailPayload));

        navigate("/dashboard/admin/qrcode/session/qrcode-detail/sessions/detail", {
            state: { sessionDetail: sessionDetailPayload },
        });
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* ===== MAIN CONTENT ===== */}
            <div className="rounded-b-xl shadow p-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* LEFT - COURSE INFO */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Book className="w-6 h-6 text-green-600" />
                            {course?.name || "Tên học phần"}
                        </h2>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span><span className="font-medium">GV:</span> {teacher?.full_name || "Nguyễn Văn A"} ({teacher?.teacher_code || "100000001"})</span>
                            </div>

                            {/* <div className="flex items-center gap-1">
                                <Layers className="w-4 h-4" />
                                <span><span className="font-medium">Hình thức:</span> Lý thuyết</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span><span className="font-medium">Tiết:</span> 4-6</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span><span className="font-medium">Nhóm TH:</span> 0</span>
                            </div> */}
                        </div>
                    </div>

                    {/* RIGHT - META + FILTER */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        {/* Course code */}
                        <div className="text-sm text-gray-600">
                            <span className="block text-gray-400 text-xs">Mã học phần</span>
                            <span className="font-semibold text-gray-800">{course?.code || "---"}</span>
                        </div>

                        {/* Filter by date */}
                        <div className="flex flex-col text-sm">
                            <label className="text-gray-400 text-xs mb-1">Lọc theo ngày</label>
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(event) => setFilterDate(event.target.value)}
                                className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Status */}
                        <div className="flex flex-col text-sm">
                            <span className="text-gray-400 text-xs mb-1">Trạng thái</span>
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>


                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Lịch sử tạo phiên</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Mã học phần</th>
                                <th className="p-3 text-left">Thời gian tạo phiên</th>
                                <th className="p-3 text-left">Tên học phần</th>
                                <th className="p-3 text-left">Ngày tạo</th>
                                <th className="p-3 text-left">Sĩ số học phần</th>
                                <th className="p-3 text-left">Nhóm</th>
                                <th className="p-3 text-left">Hình thức học</th>
                                <th className="p-3 text-left">Số SV thành công</th>
                                <th className="p-3 text-left">Số SV vắng</th>
                                <th className="p-3 text-left">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyLoading && (
                                <tr className="border-t">
                                    <td className="p-4 text-center text-sm text-gray-500" colSpan={10}>
                                        Đang tải lịch sử tạo phiên...
                                    </td>
                                </tr>
                            )}

                            {!historyLoading && historyError && (
                                <tr className="border-t">
                                    <td className="p-4 text-center text-sm text-red-500" colSpan={10}>
                                        {historyError}
                                    </td>
                                </tr>
                            )}

                            {!historyLoading && !historyError && filteredHistory.length === 0 && (
                                <tr className="border-t">
                                    <td className="p-4 text-center text-sm text-gray-500" colSpan={10}>
                                        Chưa có phiên điểm danh nào.
                                    </td>
                                </tr>
                            )}

                            {!historyLoading && !historyError && filteredHistory.map((row) => {
                                const totalStudents = row.stats?.total ?? 0;
                                const attendedStudents = row.stats?.attended ?? 0;
                                const absentStudents = Math.max(totalStudents - attendedStudents, 0);
                                const learningType = row.practice_group_id ? "Thực hành" : "Lý thuyết";
                                const groupLabel = row.practice_group_id
                                    ? row.practice_group_number
                                        ? `Nhóm ${row.practice_group_number}`
                                        : row.practice_group_name || "Nhóm"
                                    : "-";

                                return (
                                    <tr key={row.id} className="border-t">
                                        <td className="p-3">{course?.code || "---"}</td>
                                        <td className="p-3">{formatTimeValue(row.created_at)} - {formatTimeValue(row.expires_at)}</td>
                                        <td className="p-3">{course?.name || "---"}</td>
                                        <td className="p-3">{formatDate(row.class_date || row.created_at)}</td>
                                        <td className="p-3">{totalStudents}</td>
                                        <td className="p-3">{groupLabel}</td>
                                        <td className="p-3">{learningType}</td>
                                        <td className="p-3 font-medium text-green-600">{attendedStudents}</td>
                                        <td className="p-3 font-medium text-red-500">{absentStudents}</td>
                                        <td className="p-5 flex space-x-2">
                                            <button
                                                aria-label="View Details"
                                                title="Xem chi tiết"
                                                className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                                                onClick={() => handleOpenSessionDetail(row)}
                                            >
                                                <ViewIcon size={16} />
                                            </button>
                                            <button
                                                aria-label="View Photos"
                                                title="Xem ảnh đã chụp trong buổi học này"
                                                className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                                                onClick={() => {
                                                    setSelectedClassSessionId(row.class_session_id);
                                                    setOpen(true);
                                                }}
                                            >
                                                <Camera size={16} />
                                            </button>

                                            <button
                                                aria-label="Download Report"
                                                title="Tải báo cáo dạng excel, tải danh sách sinh viên điểm danh, ngày hôm đó"
                                                className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                                            >
                                                <Download size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <TeacherPhotosModal
                    isOpen={isOpen}
                    onClose={() => setOpen(false)}
                    photos={teacherPhotos}
                    classSessionId={selectedClassSessionId}
                    teacherId={teacherId}
                />

                <div className="flex items-center justify-between px-2 mt-4">
                    <span className="text-sm text-gray-500">
                        Hiển thị <strong>{filteredHistory.length}</strong> / <strong>{historyPagination.total || 0}</strong> phiên
                    </span>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={historyPagination.totalPages || 1}
                        onPageChange={setCurrentPage}
                        disabled={historyLoading}
                    />
                </div>


                {/* Footer */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                    {/* LEFT */}
                    <div className="bg-white rounded-xl p-5 shadow space-y-5">
                        <p className="text-sm font-medium text-gray-600">Giảng viên quản lý Học phần</p>

                        {teacherCourseAssignmentsError && (
                            <p className="text-sm text-red-500">
                                {teacherCourseAssignmentsError}
                            </p>
                        )}

                        {teacherCourseAssignmentsLoading && (
                            <p className="text-sm text-gray-500">Đang tải phân công giảng viên...</p>
                        )}

                        {/* Giảng viên Lý thuyết */}
                        {!teacherCourseAssignmentsLoading && (
                            <div
                                className={`border rounded-lg p-4 bg-blue-50/40 transition ${
                                    resolvedPracticeGroupId === null
                                        ? "border-blue-300 ring-2 ring-blue-200"
                                        : "border-blue-100"
                                } ${theoryAssignments.length > 0 ? "cursor-pointer" : ""}`}
                                onClick={theoryAssignments.length > 0 ? handleSelectTheory : undefined}
                                role={theoryAssignments.length > 0 ? "button" : undefined}
                                tabIndex={theoryAssignments.length > 0 ? 0 : undefined}
                                onKeyDown={(event) => {
                                    if (!theoryAssignments.length) return;
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        handleSelectTheory();
                                    }
                                }}
                            >
                                <p className="text-sm font-semibold text-blue-600 mb-3">Giảng viên Lý thuyết</p>

                                {theoryAssignments.length > 0 ? (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-gray-800">{displayTeacherName}</p>
                                            <p className="text-xs text-gray-500">Mã GV: {displayTeacherCode}</p>
                                        </div>

                                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">Lý thuyết</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Chưa có phân công lý thuyết.</p>
                                )}
                            </div>
                        )}

                        {/* Giảng viên Thực hành */}
                        {!teacherCourseAssignmentsLoading && (
                            <div className="border border-green-100 rounded-lg p-4 bg-green-50/40">
                                <p className="text-sm font-semibold text-green-600 mb-3">Giảng viên Thực hành</p>

                                {practiceAssignments.length > 0 ? (
                                    <div className="space-y-3">
                                        {practiceAssignments.map((assignment) => {
                                            const groupLabel = assignment.number_group ? `Nhóm ${assignment.number_group}` : assignment.group_name || "Nhóm";

                                            return (
                                                <div
                                                    key={assignment.practice_group_id || groupLabel}
                                                    className={`flex justify-between items-center bg-white rounded-lg px-4 py-2 shadow-sm transition cursor-pointer ${
                                                        resolvedPracticeGroupId === assignment.practice_group_id
                                                            ? "ring-2 ring-green-200 border border-green-200"
                                                            : "border border-transparent"
                                                    }`}
                                                    onClick={() => handleSelectPractice(assignment.practice_group_id)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter" || event.key === " ") {
                                                            event.preventDefault();
                                                            handleSelectPractice(assignment.practice_group_id);
                                                        }
                                                    }}
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {displayTeacherName}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Mã GV: {displayTeacherCode}
                                                        </p>
                                                    </div>

                                                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                                                        {groupLabel}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">Chưa có phân công thực hành.</p>
                                )}
                            </div>
                        )}

                    </div>

                    {/* RIGHT – INFO CARD */}
                    <div className="bg-white rounded-xl p-5 shadow space-y-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <p className="font-semibold text-gray-800">
                                Mô tả phiên điểm danh
                            </p>
                            <span className="text-xs text-gray-500">
                                #423456789123
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Tổng Sinh viên
                            </span>
                            <span className="font-semibold text-gray-800">
                                90
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Số buổi học
                            </span>
                            <span className="font-semibold text-gray-800">
                                15 buổi
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Số lượt tạo QR
                            </span>
                            <span className="font-semibold text-gray-800">
                                12 buổi
                            </span>
                        </div>

                    </div>
                </div>

            </div>


            {isDrawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-60"
                        onClick={closeDrawer}
                    />

                    {/* Drawer từ bên phải trượt ra */}
                    <div className="fixed inset-y-0 right-0 z-60 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                        {/* Header Drawer */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-lime-100">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Mở phiên điểm danh</h3>
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none  rounded-full hover:bg-lime-400 transition-all  duration-300 ease-in-out p-2 hover:rotate-90"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body Form */}
                        <div className="p-6 space-y-6 overflow-y-auto h-full pb-32">
                            <div className="grid grid-cols-1 gap-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giảng viên
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="Nguyễn Văn A"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã giảng viên
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="100000001"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã học phần
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="42000735839"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Người tạo
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="QTV, ADMIN"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiết học
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="1-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thời gian tạo QR
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option>2 phút</option>
                                        <option>4 phút</option>
                                        <option selected>5 phút</option>
                                        <option>10 phút</option>
                                    </select>
                                </div>

                            </div>
                        </div>


                        {/* Footer Buttons - Fixed bottom */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
                            <button
                                onClick={closeDrawer}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                Tạo QR ngay
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminSessionQRPage;