import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Users,
    Phone,
    Mail,
    Building2,
    IdCard,
    BookAudio,
} from "lucide-react";
import teacherService from "@services/teacher.service";
import { useCourse } from "@contexts/CourseContext";

const AdminQRDetailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { teacherId } = useParams();

    const {
        teacherCourses,
        teacherCoursesLoading,
        teacherCoursesError,
        fetchTeacherCourses,
    } = useCourse();

    const teacherInfo = location.state?.teacher || null;
    const [selectedSemester, setSelectedSemester] = useState("");

    const gradients = [
        "from-blue-500 to-indigo-500",
        "from-emerald-500 to-teal-500",
        "from-violet-500 to-purple-500",
        "from-orange-500 to-amber-500",
    ];

    useEffect(() => {
        if (!teacherId) return;

        fetchTeacherCourses(
            teacherId,
            selectedSemester ? { semester: selectedSemester } : {}
        );
    }, [teacherId, selectedSemester, fetchTeacherCourses]);

    const semesters = useMemo(() => {
        const unique = new Set(
            (teacherCourses || []).map((course) => course?.semester).filter(Boolean)
        );
        return Array.from(unique).sort((a, b) => b.localeCompare(a));
    }, [teacherCourses]);

    const infoRows = [
        { icon: IdCard, label: "Mã nhân sự", value: teacherInfo?.teacher_code || "-" },
        { icon: Users, label: "Tên giảng viên", value: teacherInfo?.full_name || "-" },
        { icon: Phone, label: "Số điện thoại", value: teacherInfo?.phone || "-" },
        { icon: Mail, label: "Email", value: teacherInfo?.email || "-" },
        {
            icon: Building2,
            label: "Khoa",
            value: teacherInfo?.department || "-",
            colSpan: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top accent */}
            <div className="h-1 bg-[#153898] mb-6" />

            {/* ================= GIẢNG VIÊN ================= */}
            <div className="bg-white shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-7 h-7 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                        Chi tiết giảng viên
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex justify-center md:justify-start">
                        <img
                            src={teacherInfo?.avatar_url || "https://via.placeholder.com/144"}
                            alt={teacherInfo?.full_name || "Giảng viên"}
                            className="w-36 h-36 rounded-full border-4 border-blue-100 shadow-md object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {infoRows.map(({ icon: Icon, label, value, colSpan }, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-4 ${colSpan ? "md:col-span-2" : ""}`}
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= HỌC PHẦN ================= */}
            <div className="bg-white rounded-b-xl shadow-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <BookAudio className="w-7 h-7 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">
                            Danh sách học phần
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">Học kỳ</label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="rounded-lg border px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Tất cả</option>
                            {semesters.map((semester) => (
                                <option key={semester} value={semester}>
                                    {semester}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* {teacherCoursesError && (
                    <div className="mb-4 text-sm text-red-600">
                        {teacherCoursesError}
                    </div>
                )} */}

                {teacherCoursesLoading && (
                    <div className="text-sm text-gray-500">Đang tải học phần...</div>
                )}

                {!teacherCoursesLoading && teacherCourses.length === 0 && (
                    <div className="text-sm text-gray-500">Chưa có học phần phù hợp.</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {!teacherCoursesLoading &&
                        teacherCourses.map((course, index) => (
                            <div
                                key={course.id || `${course.code}-${index}`}
                                onClick={() =>
                                    navigate(
                                        "/dashboard/admin/qrcode/session/qrcode-detail/session-detail"
                                    )
                                }
                                className="group cursor-pointer bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div
                                    className={`h-0.5 bg-gradient-to-r ${
                                        gradients[index % gradients.length]
                                    }`}
                                />

                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {course.name || "Chưa có tên học phần"}
                                    </h3>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Mã học phần</span>
                                            <span className="font-semibold text-gray-800">
                                                {course.code || "-"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Học kỳ</span>
                                            <span className="font-semibold text-gray-800">
                                                {course.semester || "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default AdminQRDetailPage;
