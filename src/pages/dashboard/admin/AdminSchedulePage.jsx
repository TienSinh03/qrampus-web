import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";

import { toast } from "sonner";


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
const AdminSchedulePage = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  // const [checked, setChecked] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerProps, setDrawerProps] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    courseCode: '',
    instructorCode: '',
    startDate: '',
    endDate: '',
    room: '',
    theoryQuantity: '',
  });

  const openDrawer = (props) => {
    setDrawerProps(props);
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerProps(null);
  };



  const totalPages = 5;

  const monhoc = [
    {
      id: 1,
      course_code: "4203001549",
      course_name: "Lập trình Web nâng cao",
      semester: "HK1",
      academic_year: "2024-2025",
      status: "Active",
      learning_code: 3,
      learning_form: "Kết hợp",
      department: "Khoa Công nghệ thông tin",
    },
    {
      id: 2,
      course_code: "4203002010",
      course_name: "Hệ quản trị Cơ sở dữ liệu",
      semester: "HK1",
      academic_year: "2024-2025",
      status: "Active",
      learning_code: 2,
      learning_form: "Thực hành",
      department: "Khoa Công nghệ thông tin",

    },
    {
      id: 3,
      course_code: "4203003122",
      course_name: "Phân tích và Thiết kế hệ thống",
      semester: "HK2",
      academic_year: "2024-2025",
      status: "Pending",
      learning_code: 1,
      learning_form: "Lý thuyết",
      department: "Khoa Công nghệ thông tin",

    },
    {
      id: 4,
      course_code: "4203014501",
      course_name: "Đồ án chuyên ngành CNTT",
      semester: "HK2",
      academic_year: "2024-2025",
      status: "Active",
      learning_code: 3,
      learning_form: "Kết hợp",
      department: "Khoa Công nghệ thông tin",

    },
    {
      id: 5,
      course_code: "4203001588",
      course_name: "An toàn và Bảo mật thông tin",
      semester: "HK3",
      academic_year: "2024-2025",
      status: "Closed",
      learning_code: 1,
      learning_form: "Lý thuyết",
      department: "Khoa Công nghệ thông tin",
    }
  ];

  const teacher = [
    {
      id: 1,
      instructor_code: "1000001",
      instructor: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      department: "Khoa Công nghệ thông tin",
    },
    {
      id: 2,
      instructor_code: "1000002",
      instructor: "Trần Thị B",
      email: "tranthib@example.com",
      department: "Khoa Công nghệ thông tin",
    },
    {
      id: 3,
      instructor_code: "1000003",
      instructor: "Lê Hoàng C",
      email: "lehoangc@example.com",
      department: "Khoa Thương mại Du lịch",
    },
    {
      id: 4,
      instructor_code: "1000004",
      instructor: "Phạm Minh D",
      email: "phamminhd@example.com",
      department: "Khoa Điện tử",
    },
    {
      id: 5,
      instructor_code: "1000005",
      instructor: "Vũ Thị E",
      email: "vuthie@example.com",
      department: "Khoa Tài chính Ngân hàng",
    }
  ];


  //lịch
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
  const sessions = [
    {
      name: "BUỔI SÁNG",
      color: "bg-emerald-100 text-emerald-700",
      slots: [
        { period: "1", time: "6h30 - 7h20" },
        { period: "2", time: "7h20 - 8h10" },
        { period: "3", time: "8h10 - 9h00" },
        { period: "Nghỉ", time: "Giải lao 10 phút", break: true },
        { period: "4", time: "9h10 - 10h00" },
        { period: "5", time: "10h00 - 10h50" },
        { period: "6", time: "10h50 - 11h40" },
      ],
    },
    {
      name: "BUỔI CHIỀU",
      color: "bg-amber-100 text-amber-700",
      slots: [
        { period: "7", time: "12h30 - 13h20" },
        { period: "8", time: "13h20 - 14h10" },
        { period: "9", time: "14h10 - 15h00" },
        { period: "Nghỉ", time: "Giải lao 10 phút", break: true },
        { period: "10", time: "15h10 - 16h00" },
        { period: "11", time: "16h00 - 16h50" },
        { period: "12", time: "16h50 - 17h40" },
      ],
    },
    {
      name: "BUỔI TỐI",
      color: "bg-indigo-100 text-indigo-700",
      slots: [
        { period: "13", time: "18h00 - 18h50" },
        { period: "14", time: "18h50 - 19h40" },
        { period: "Nghỉ", time: "Giải lao 10 phút", break: true },
        { period: "15", time: "19h50 - 20h40" },
        { period: "16", time: "20h40 - 21h30" },
      ],
    },
  ];

  const [periodToTime, setPeriodToTime] = useState({});

  useEffect(() => {
    const map = {};
    sessions.forEach((session) => {
      session.slots.forEach((slot) => {
        if (!slot.break) {
          const [start, end] = slot.time.split(" - ");
          map[slot.period] = { start, end };
        }
      });
    });
    setPeriodToTime(map);
  }, []);

  // ================= LỊCH - KÉO CHỌN TIẾT =================
  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);

  const handleMouseDown = (cell) => {
    if (getScheduleForCell(cell.day, cell.period)) return; // Không cho kéo nếu đã có lịch
    setIsDragging(true);
    setStartCell(cell);
    setSelectedCells([cell]);
  };

  const handleMouseEnter = (cell) => {
    if (!isDragging || !startCell) return;
    if (cell.day !== startCell.day) return;

    const start = Number(startCell.period);
    const end = Number(cell.period);

    const min = Math.min(start, end);
    const max = Math.max(start, end);

    const range = [];
    for (let i = min; i <= max; i++) {
      if (getScheduleForCell(cell.day, i)) continue; // Bỏ qua nếu có lịch
      range.push({ day: cell.day, period: i });
    }

    setSelectedCells(range);
  };

  const handleMouseUp = () => {
    if (selectedCells.length > 0) {
      openDrawer({
        day: selectedCells[0].day,
        from: selectedCells[0].period,
        to: selectedCells[selectedCells.length - 1].period,
        onCancel: clearSelection,
      });
      console.log("Selected:", selectedCells);
    }
    setIsDragging(false);
    setStartCell(null);
  };

  const isSelected = (day, period) =>
    selectedCells.some(
      (c) => c.day === day && c.period === Number(period)
    );

  const clearSelection = () => {
    setSelectedCells([]);
    setIsDragging(false);
    setStartCell(null);
  };


  // chọn nhóm modal
  const [isTheory, setIsTheory] = React.useState(false);
  const [isPractice, setIsPractice] = React.useState(false);

  const [practiceGroups, setPracticeGroups] = React.useState({
    group1: { checked: false, quantity: "" },
    group2: { checked: false, quantity: "" },
    group3: { checked: false, quantity: "" },
    group4: { checked: false, quantity: "" },
  });

  const [theoryAssigned, setTheoryAssigned] = useState(false);
  const [assignedGroups, setAssignedGroups] = useState({
    group1: false,
    group2: false,
    group3: false,
    group4: false,
  });

  useEffect(() => {
    if (isDrawerOpen && selectedCourse) {
      const courseCode = selectedCourse.course_code;
      const hasTheory = schedules.some(s => s.courseCode === courseCode && s.isTheory);
      setTheoryAssigned(hasTheory);

      const assigned = {};
      ['group1', 'group2', 'group3', 'group4'].forEach(g => {
        assigned[g] = schedules.some(s => s.courseCode === courseCode && s.practiceGroups?.[g]?.checked);
      });
      setAssignedGroups(assigned);

      const form = selectedCourse.learning_form;
      let theory = false;
      let practice = false;
      if (form === "Lý thuyết") {
        theory = true;
      } else if (form === "Thực hành") {
        practice = true;
      } else if (form === "Kết hợp") {
        theory = true;
        practice = true;
      }
      setIsTheory(theory && !hasTheory);
      setIsPractice(practice);

      if (!practice) {
        setPracticeGroups({
          group1: { checked: false, quantity: "" },
          group2: { checked: false, quantity: "" },
          group3: { checked: false, quantity: "" },
          group4: { checked: false, quantity: "" },
        });
      }
    }
  }, [isDrawerOpen, selectedCourse, schedules]);

  useEffect(() => {
    if (isDrawerOpen && drawerProps) {
      const { day, from, to } = drawerProps;
      const startT = periodToTime[from]?.start || "";
      const endT = periodToTime[to]?.end || "";
      setFormData({
        day: day || "",
        startTime: startT,
        endTime: endT,
        courseCode: selectedCourse?.course_code || "",
        instructorCode: selectedTeacher?.instructor_code || "",
        startDate: "",
        endDate: "",
        room: "",
        theoryQuantity: "",
      });
    }
  }, [isDrawerOpen, drawerProps, selectedCourse, selectedTeacher, periodToTime]);

  const handleCreateSchedule = () => {
    const newSchedule = {
      ...formData,
      fromPeriod: drawerProps?.from,
      toPeriod: drawerProps?.to,
      isTheory,
      isPractice,
      practiceGroups: isPractice ? practiceGroups : null,
    };
    setSchedules((prev) => [...prev, newSchedule]);
    toast.success("Lịch dạy đã được tạo");
    closeDrawer();
    clearSelection();
  };

  const getScheduleForCell = (day, period) => {
    if (!selectedTeacher) return null;
    return schedules.find(s =>
      s.instructorCode === selectedTeacher.instructor_code &&
      s.day === day &&
      Number(s.fromPeriod) <= Number(period) &&
      Number(s.toPeriod) >= Number(period)
    );
  };

  const learningForm = selectedCourse?.learning_form;
  const theoryDisabled = learningForm === "Thực hành" || theoryAssigned;
  const practiceDisabled = learningForm === "Lý thuyết";


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
                subtitle="lịch dạy đã tạo"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Lịch dạy"
                value="4567"
                percent="(+18%)"
                positive={true}
                subtitle="kỳ này"
                icon={<UserPlus className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Tổng lịch dạy"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="tồn tại sinh viên"
                icon={<UserCheck className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Tổng lịch dạy"
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="chưa có sinh viên"
                icon={<UserX className="w-6 h-6 text-yellow-600" />}
                iconBg="bg-yellow-100"
              />
            </div>


            {/* FILTERS  MÔN*/}
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
                    Khoa/Viện
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Khoa Công nghệ thông tin</option>
                    <option>Khoa Điện tử - Viễn thông</option>
                    <option>Khoa Cơ khí</option>
                    <option>Khoa Kinh tế</option>
                  </select>
                </div>

              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-4 w-full justify-start md:justify-end md:w-auto">
                <div className="flex flex-wrap items-center gap-2 ">
                  {/* <button className="flex items-center gap-2 border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200" title="Tạo lịch dạy cho 1 giảng viên, thủ công">
                    <CirclePlus className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-rose-400 text-rose-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:ring-offset-1 transition-all duration-200" title="Khóa khảo sát">
                    <Lock className="w-5 h-5" />
                  </button> */}
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
                </div>
              </div>
            </div>
            {/* TABLE Môn */}
            <div className="w-full overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow mb-6">
              <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">

                {/* ================== HEADER ================== */}
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr className="border-b">
                    {/* Checkbox */}
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      <input
                        type="radio"
                        name="course"
                      />
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Mã học phần
                    </th>
                    <th className="h-12 px-4 min-w-[220px] text-xs font-semibold text-slate-600 uppercase">
                      Tên học phần
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Học kỳ
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Năm học
                    </th>
                    <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-slate-600 uppercase">
                      Hình thức học
                    </th>
                    <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-slate-600 uppercase">
                      Khoa/Viện
                    </th>
                    {/* Actions */}
                    <th className="h-12 px-4 text-center text-xs font-semibold text-slate-600 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {monhoc.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b hover:bg-slate-50 transition-colors h-11"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-2">
                        <input type="radio" name="course" onChange={() => setSelectedCourse(u)} />
                      </td>
                      <td className="px-4 py-2">
                        {u.course_code}
                      </td>
                      <td className="px-4 py-2 max-w-[260px] truncate" title={u.course_name}>
                        {u.course_name}
                      </td>
                      <td className="px-4 py-2">
                        {u.semester}
                      </td>
                      <td className="px-4 py-2">
                        {u.academic_year}
                      </td>

                      <td className="px-4 py-2 hidden lg:table-cell">
                        {u.learning_form}
                      </td>
                      <td
                        className="px-4 py-2 hidden lg:table-cell"
                      >
                        {u.department}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-2">
                        <div className="flex justify-center gap-3">
                          <button title="Xem chi tiết khảo sát">
                            <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* PAGINATION */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>

            {/* FILTERS  GV*/}
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
                <span>Bộ lọc thống kê</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã giảng viên
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên giảng viên
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: ....."
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email giảng viên
                  </label>
                  <input
                    type="email"
                    placeholder="Ví dụ: ....."
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
              </div>
            </div>
            {/* TABLE giảng viên */}
            <div className="w-full overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow mb-6">
              <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">

                {/* ================== HEADER ================== */}
                <thead className="sticky top-0 z-10 bg-gray-100">
                  <tr className="border-b">

                    {/* Checkbox */}
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      <input type="radio" name="teacher" />
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Mã giảng viên
                    </th>
                    <th className="h-12 px-4 min-w-[220px] text-xs font-semibold text-slate-600 uppercase">
                      Tên giảng viên
                    </th>

                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Mail
                    </th>

                    <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-slate-600 uppercase">
                      Khoa/Viện
                    </th>

                    {/* Actions */}
                    <th className="h-12 px-4 text-center text-xs font-semibold text-slate-600 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {teacher.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b hover:bg-slate-50 transition-colors h-11"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-2">
                        <input type="radio" name="teacher" onChange={() => setSelectedTeacher(u)} />
                      </td>
                      <td className="px-4 py-2">
                        {u.instructor_code}
                      </td>
                      <td className="px-4 py-2 max-w-[260px] truncate" title={u.instructor}>
                        {u.instructor}
                      </td>
                      <td className="px-4 py-2">
                        {u.email}
                      </td>
                      <td className="px-4 py-2 hidden lg:table-cell">
                        {u.department}
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-2">
                        <div className="flex justify-center gap-3">
                          <button title="Xem chi tiết giảng viên">
                            <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* PAGINATION */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />

            </div>



            {/* TIMETABLE */}
            <div className="p-6 bg-white shadow-lg overflow-x-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Thời khóa biểu
              </h2>

              <table className="min-w-full border border-gray-200 text-sm select-none">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-3 py-2">Buổi</th>
                    <th className="border px-3 py-2">Tiết</th>
                    <th className="border px-3 py-2">Thời gian</th>
                    {days.map((day) => (
                      <th key={day} className="border px-3 py-2">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody onMouseLeave={handleMouseUp}>
                  {sessions.map((session) =>
                    session.slots.map((slot, idx) => (
                      <tr key={session.name + idx}>
                        {idx === 0 && (
                          <td
                            rowSpan={session.slots.length}
                            className={`border px-3 py-2 font-semibold text-center ${session.color}`}
                          >
                            {session.name}
                          </td>
                        )}

                        <td className="border px-3 py-2 text-center font-medium">
                          {slot.period}
                        </td>

                        <td className="border px-3 py-2">
                          {slot.break ? (
                            <span className="italic text-gray-500">
                              {slot.time}
                            </span>
                          ) : (
                            slot.time
                          )}
                        </td>

                        {days.map((day) =>
                          slot.break ? (
                            <td
                              key={day}
                              className="border bg-gray-50"
                            />
                          ) : (
                            <td
                              key={day}
                              onMouseDown={() =>
                                handleMouseDown({
                                  day,
                                  period: slot.period,
                                })
                              }
                              onMouseEnter={() =>
                                handleMouseEnter({
                                  day,
                                  period: slot.period,
                                })
                              }
                              onMouseUp={handleMouseUp}
                              className={`
                        border px-3 py-3 text-center cursor-pointer
                        transition
                        ${isSelected(day, slot.period)
                                  ? "bg-emerald-500 text-white"
                                : getScheduleForCell(day, slot.period) ? "bg-blue-200 text-blue-800" : "hover:bg-emerald-100"
                                }
                      `}
                            >
                                {getScheduleForCell(day, slot.period) ? (
                                  <div className="text-sm">
                                    <p>{getScheduleForCell(day, slot.period).courseCode}</p>
                                    <p>Phòng: {getScheduleForCell(day, slot.period).room}</p>
                                    {/* Thêm thông tin khác nếu cần */}
                                  </div>
                                ) : (
                                    <span className="text-sm ">
                                      Kéo tạo lịch
                                    </span>
                                )}
                            </td>
                          )
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>



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
                      Tạo lịch dạy
                    </h3>

                    <button
                      onClick={() => {
                        closeDrawer();
                        clearSelection();
                      }}
                      className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-lime-300 transition-all duration-300 hover:rotate-90"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* ================= BODY (SCROLL) ================= */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thứ dạy
                      </label>
                      <input
                        type="text"
                        value={formData.day}
                        onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian bắt đầu tiết
                      </label>
                      <input
                        type="text"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian kết thúc tiết
                      </label>
                      <input
                        type="text"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã học phần
                      </label>
                      <input
                        type="text"
                        value={formData.courseCode}
                        onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã giảng viên
                      </label>
                      <input
                        type="text"
                        value={formData.instructorCode}
                        onChange={(e) => setFormData({ ...formData, instructorCode: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày bắt đầu
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày kết thúc
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phòng học
                      </label>
                      <input
                        type="text"
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={isTheory}
                          onChange={(e) => setIsTheory(e.target.checked)}
                          className="h-5 w-5 text-blue-600"
                          disabled={theoryDisabled}
                        />
                        <span className="ml-2 text-gray-700 font-medium">
                          Lý thuyết
                        </span>
                      </label>

                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={isPractice}
                          onChange={(e) => setIsPractice(e.target.checked)}
                          className="h-5 w-5 text-blue-600"
                          disabled={practiceDisabled}
                        />
                        <span className="ml-2 text-gray-700 font-medium">
                          Thực hành
                        </span>
                      </label>
                    </div>
                    {/* NẾU CHỌN LÝ THUYẾT → HIỂN THỊ SỐ LƯỢNG SV */}
                    {isTheory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số lượng SVHP lý thuyết
                        </label>
                        <input
                          type="number"
                          placeholder="Ví dụ: 120"
                          value={formData.theoryQuantity}
                          onChange={(e) => setFormData({ ...formData, theoryQuantity: e.target.value })}
                          className="w-full rounded-lg border border-blue-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    )}
                    {/* NẾU CHỌN THỰC HÀNH → HIỂN THỊ SỐ LƯỢNG SV */}
                    {isPractice && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Nhóm thực hành
                        </label>

                        {[
                          { key: "group1", label: "Nhóm TH 1" },
                          { key: "group2", label: "Nhóm TH 2" },
                          { key: "group3", label: "Nhóm TH 3" },
                          { key: "group4", label: "Nhóm TH 4" },
                        ].map((g) => {
                          const group = practiceGroups[g.key];
                          const disabled = assignedGroups[g.key];

                          return (
                            <div
                              key={g.key}
                              className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50"
                            >
                              {/* Checkbox */}
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={group.checked}
                                  onChange={(e) =>
                                    setPracticeGroups({
                                      ...practiceGroups,
                                      [g.key]: {
                                        ...group,
                                        checked: e.target.checked,
                                      },
                                    })
                                  }
                                  className="h-4 w-4 text-blue-600"
                                  disabled={disabled}
                                />
                                <span className="ml-2 text-gray-700">
                                  {g.label}
                                </span>
                              </label>

                              {/* Input số lượng */}
                              <input
                                type="number"
                                min={0}
                                placeholder="Số SV"
                                disabled={!group.checked || disabled}
                                value={group.quantity}
                                onChange={(e) =>
                                  setPracticeGroups({
                                    ...practiceGroups,
                                    [g.key]: {
                                      ...group,
                                      quantity: e.target.value,
                                    },
                                  })
                                }
                                className={`w-28 rounded-lg border px-3 py-1.5 ${group.checked && !disabled
                                    ? "border-blue-300 focus:ring-2 focus:ring-blue-200"
                                    : "bg-gray-100 border-gray-200 cursor-not-allowed"
                                  }
                                  `}
                              />
                              <span className="text-sm text-gray-500">
                                SV
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* ================= FOOTER ================= */}
                  <div className=" sticky bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
                    <button
                      onClick={() => {
                        closeDrawer();
                        clearSelection();
                      }}
                      className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                    >
                      Hủy
                    </button>

                    <button
                      onClick={handleCreateSchedule}
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    >
                      Tạo lịch học
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default AdminSchedulePage;