import React, { useState } from "react";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";

import {
  CirclePlus,
  Trash2,
  LockKeyhole,
  CloudUpload,
  Eye,
  MoreVertical,
  PencilLine,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  X, ArrowDown, ArrowUp, FileSpreadsheet, FilterX,
  CheckLine,
  Lock,
  File, Camera, FileSearchIcon,
  GitPullRequest,
  ArrowUpWideNarrow, Settings
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminSurveyPage = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  // const [checked, setChecked] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const closeDrawer = () => setIsDrawerOpen(false);

  //gọi userfetch open
  // useEffect(() => {
  //   const handleClick = (e) => {
  //     if (!e.target.closest(".dropdown-menu")) {
  //       setOpenMenu(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClick);
  //   return () => document.removeEventListener("click", handleClick);
  // }, []);

  const totalPages = 5;

  const survey = [
    {
      id: 1,
      course_code: "4203001549",
      course_name: "Lập trình nâng cao",
      semester: "HK1",
      academic_year: "2024-2025",
      status: "Active",
      learning_form: "Lý thuyết",
      practical_group: "",
      created_at: "2024-09-01",
      end_at: "2024-10-01",
      instructor_code: "GV001",
      instructor: "Nguyễn Văn A",
      department: "Khoa Công nghệ thông tin",
      // trung bình điểm dánh giá
      average_rating: 4.5,
    }, {
      id: 2,
      course_code: "4203001550",
      course_name: "Cơ sở dữ liệu",
      semester: "HK1",
      academic_year: "2024-2025",
      status: "Pending",
      learning_form: "Thực hành",
      practical_group: "1",
      created_at: "2024-09-05",
      end_at: "2024-10-05",
      instructor_code: "GV002",
      instructor: "Trần Thị B",
      department: "Khoa Công nghệ thông tin",
      average_rating: 4.2,
    }, {
      id: 1,
      course_code: "4203001549",
      course_name: "Lập trình nâng cao",
      semester: "HK1",
      academic_year: "2024-2025",
      status: "Active",
      learning_form: "Lý thuyết",
      practical_group: "",
      created_at: "2024-09-01",
      end_at: "2024-10-01",
      instructor_code: "GV001",
      instructor: "Nguyễn Văn A",
      department: "Khoa Công nghệ thông tin",
      // trung bình điểm dánh giá
      average_rating: 4.5,
    }, {
      id: 2,
      course_code: "4203001550",
      course_name: "Cơ sở dữ liệu",
      semester: "HK1",
      academic_year: "2024-2025",
      status: "Pending",
      learning_form: "Thực hành",
      practical_group: "1",
      created_at: "2024-09-05",
      end_at: "2024-10-05",
      instructor_code: "GV002",
      instructor: "Trần Thị B",
      department: "Khoa Công nghệ thông tin",
      average_rating: 4.2,
    }

  ];

  const [expanded, setExpanded] = useState(false);
  // cột , bảng
  const [visibleCols, setVisibleCols] = useState({
    courseCode: true,
    courseName: true,
    semester: true,
    academicYear: true,
    status: true,
    learningForm: false,
    practicalGroup: false,
    createdAt: false,
    endAt: false,
    instructorCode: false,
    instructor: true,
    department: false,
    averageRating: false,
  });
  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Tổng"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="Khảo sát đã tạo"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Học phần đã tạo"
                value="4567"
                percent="(+18%)"
                positive={true}
                subtitle="kỳ này"
                icon={<UserPlus className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Đang mở"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="số học phần"
                icon={<UserCheck className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Đã khóa"
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="số học phần"
                icon={<UserX className="w-6 h-6 text-yellow-600" />}
                iconBg="bg-yellow-100"
              />
            </div>
            {/* FILTERS */}
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
                <span>Bộ lọc thống kê</span>
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
                    Học kỳ
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>HK1_2024-2025</option>
                    <option>HK2_2023-2024</option>
                    <option>HK3_2022-2023</option>


                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã số học phần
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Đến hạn khảo sát</option>
                    <option>Đang mở</option>
                    <option>Đã khóa</option>
                    <option>Đang lên lịch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoa/Viện
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Khoa Công nghệ thông tin</option>
                    <option>Khoa Điện tử - Viễn thông</option>
                    <option>Khoa Cơ khí</option>
                    <option>Khoa Kinh tế</option>
                  </select>
                </div>


                {expanded && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên môn học
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ....."
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã giảng viên
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên giảng viên
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày tạo
                      </label>
                      <input
                        type="date"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                  </>
                )}


              </div>
              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-4 w-full justify-start md:justify-end md:w-auto">
                <div className="flex flex-wrap items-center gap-2 ">
                  <button className="flex items-center gap-2 border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200" title="Tạo khảo sát, thủ công">
                    <CirclePlus className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-rose-400 text-rose-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:ring-offset-1 transition-all duration-200" title="Khóa khảo sát">
                    <Lock className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-emerald-400 text-emerald-300 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200" title="Tạo khảo sát cho toàn bộ họ phần, khi lọc học phần đã đến hạn">
                    <ArrowUpWideNarrow className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setOpenUpload(true)}
                    className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                    title="Upload danh sách học phần cần khảo sát"
                  >
                    <CloudUpload className="w-5 h-5" />
                  </button>
                  <button
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200" title="Tìm kiếm"
                  >
                    <FileSearchIcon className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 transition-all duration-200" title="Tải file excel">
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" title="Tải file mẫu excel">
                    <File className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" title="Xóa bộ lọc">
                    <FilterX className="w-5 h-5" />
                  </button>
                  <details className="relative">
                    <summary className="list-none flex items-center gap-2 border border-sky-300 text-sky-700 bg-sky px-5 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-sky-50 hover:border-sky-400 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200">
                      <Settings className="w-5 h-5" />
                    </summary>

                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 text-sm">
                      {[
                        ["courseCode", "Mã học phần"],
                        ["courseName", "Tên học phần"],
                        ["semester", "Học kỳ"],
                        ["academicYear", "Năm học"],
                        ["learningForm", "Hình thức học"],
                        ["practicalGroup", "Nhóm TH"],
                        ["createdAt", "Ngày tạo"],
                        ["endAt", "Ngày kết thúc"],
                        ["instructorCode", "Mã GV"],
                        ["instructor", "Giảng viên"],
                        ["department", "Khoa"],
                        ["averageRating", "Điểm đánh giá"],
                        ["status", "Trạng thái"],

                      ].map(([key, label]) => {
                        const active = visibleCols[key];

                        return (
                          <div
                            key={key}
                            onClick={() =>
                              setVisibleCols(prev => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            className={`px-3 py-2 rounded cursor-pointer flex items-center justify-between transition
                                ${active
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


            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-b-lg border border-gray-200">
              <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">
                {/* ================== HEADER ================== */}
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="border-b">

                    {/* Checkbox */}
                    <th className="w-12 px-4 text-xs font-semibold text-gray-600 uppercase">
                      <input type="checkbox" />
                    </th>

                    {visibleCols.courseCode && (
                      <th className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Mã học phần
                      </th>
                    )}

                    {visibleCols.courseName && (
                      <th className="h-12 px-4 min-w-[220px] text-xs font-semibold text-gray-600 uppercase">
                        Tên học phần
                      </th>
                    )}

                    {visibleCols.semester && (
                      <th className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Học kỳ
                      </th>
                    )}

                    {visibleCols.academicYear && (
                      <th className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Năm học
                      </th>
                    )}

                    {visibleCols.learningForm && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Hình thức học
                      </th>
                    )}

                    {visibleCols.practicalGroup && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Nhóm TH
                      </th>
                    )}

                    {visibleCols.createdAt && (
                      <th className="h-12 px-4 hidden md:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Ngày tạo
                      </th>
                    )}

                    {visibleCols.endAt && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Ngày kết thúc
                      </th>
                    )}

                    {visibleCols.instructorCode && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Mã GV
                      </th>
                    )}

                    {visibleCols.instructor && (
                      <th className="h-12 px-4 min-w-[180px] text-xs font-semibold text-gray-600 uppercase">
                        Giảng viên
                      </th>
                    )}

                    {visibleCols.department && (
                      <th className="h-12 px-4 hidden xl:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Khoa
                      </th>
                    )}

                    {visibleCols.averageRating && (
                      <th className="h-12 px-4 hidden xl:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Điểm ĐG
                      </th>
                    )}

                    {visibleCols.status && (
                      <th className="h-12 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Trạng thái
                      </th>
                    )}

                    {/* Action */}
                    <th className="h-12 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {survey.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b hover:bg-slate-50 transition-colors h-11"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-2">
                        <input type="checkbox" />
                      </td>

                      {visibleCols.courseCode && (
                        <td className="px-4 py-2">
                          {u.course_code}
                        </td>
                      )}

                      {visibleCols.courseName && (
                        <td
                          className="px-4 py-2 max-w-[260px] truncate"
                          title={u.course_name}
                        >
                          {u.course_name}
                        </td>
                      )}

                      {visibleCols.semester && (
                        <td className="px-4 py-2">
                          {u.semester}
                        </td>
                      )}

                      {visibleCols.academicYear && (
                        <td className="px-4 py-2">
                          {u.academic_year}
                        </td>
                      )}

                      {visibleCols.learningForm && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.learning_form}
                        </td>
                      )}

                      {visibleCols.practicalGroup && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.practical_group}
                        </td>
                      )}

                      {visibleCols.createdAt && (
                        <td className="px-4 py-2 hidden md:table-cell">
                          {u.created_at}
                        </td>
                      )}

                      {visibleCols.endAt && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.end_at}
                        </td>
                      )}

                      {visibleCols.instructorCode && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.instructor_code}
                        </td>
                      )}

                      {visibleCols.instructor && (
                        <td
                          className="px-4 py-2 max-w-[180px] truncate"
                          title={u.instructor}
                        >
                          {u.instructor}
                        </td>
                      )}

                      {visibleCols.department && (
                        <td className="px-4 py-2 hidden xl:table-cell">
                          {u.department}
                        </td>
                      )}

                      {visibleCols.averageRating && (
                        <td className="px-4 py-2 hidden xl:table-cell">
                          {u.average_rating}
                        </td>
                      )}

                      {visibleCols.status && (
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-[72px] px-2 py-0.5 rounded-full text-xs font-medium
                  ${u.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : u.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-gray-200 text-gray-600"
                              }
                `}
                          >
                            {u.status}
                          </span>
                        </td>
                      )}

                      {/* Action */}
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Nút Xem chi tiết */}
                          <button 
                            title="Xem chi tiết câu hỏi" 
                            onClick={() => window.location.href = "/dashboard/admin/surveys/detail-survey"}
                            className="p-2 transition-colors duration-200 rounded-lg hover:bg-blue-50 group"
                          >
                            <Eye className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                          </button>

                          {/* Nút Chỉnh sửa */}
                          <button 
                            title="Xem chi tiết câu trả lời"
                            className="p-2 transition-colors duration-200 rounded-lg hover:bg-green-50 group"
                          >
                            <FileSearchIcon className="w-5 h-5 text-green-500 group-hover:text-green-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />

            {/* MODAL UPLOAD */}
            <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />

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
                      Cập nhật hồ sơ tài khoản
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
                        Cập nhật mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã giảng viên / Sinh viên
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên Giảng viên
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Khoa / Viện
                      </label>
                      <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500">
                        <option>Khoa Công nghệ thông tin</option>
                        <option>Khoa Điện tử - Viễn thông</option>
                        <option>Khoa Cơ khí</option>
                        <option>Khoa Kinh tế</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phân quyền tài khoản
                      </label>
                      <select className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <option>Giảng viên</option>
                        <option>Quản trị viên</option>
                        <option>Bộ phận chấm công</option>
                      </select>
                    </div>

                    {/* Ảnh đại diện */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh đại diện
                      </label>
                      <input
                        type="file"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    {/* thiết kế khung ảnh hiện tại */}
                    <div className="relative w-28 h-28 mx-auto">
                      <img
                        src={"https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png"}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-sky-500 p-2 rounded-full text-white shadow hover:bg-sky-600 cursor-pointer"
                      >
                        <Camera size={16} />
                      </label>
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
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminSurveyPage;
