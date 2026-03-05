import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import courseService from "../../../services/course.service";
import teacherService from "../../../services/teacher.service";
import scheduleService from "../../../services/schedule.service";
import roomService from "../../../services/room.service";
import EmptyState from "../../../components/layout/EmptyState";
import { DEPARTMENTS } from "../../../constants/departments";

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

  const [openUpload, setOpenUpload] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerProps, setDrawerProps] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  // ========== COURSE TABLE STATE ==========
  const [courseRows, setCourseRows] = useState([]);
  const [coursePage, setCoursePage] = useState(1);
  const [coursePagination, setCoursePagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    totalRows: 0
  });
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseFilters, setCourseFilters] = useState({
    semester: '',
    year: '',
    name: '',
    code: ''
  });
  
  // ========== TEACHER TABLE STATE ==========
  const [teacherRows, setTeacherRows] = useState([]);
  const [teacherPage, setTeacherPage] = useState(1);
  const [teacherPagination, setTeacherPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherFilters, setTeacherFilters] = useState({
    code: '',
    name: '',
    department: ''
  });
  
  const [formData, setFormData] = useState({
    day_of_week: '',
    start_hour: '',
    end_hour: '',
    start_date: '',
    end_date: '',
    room_id: '',
    schedule_type: 'LT',
  });

  // ========== FETCH COURSE ROWS ==========
  useEffect(() => {
    fetchCourseRows();
  }, [coursePage]);

  // Helper: Convert time format from "6h30" to "06:30:00"
  const convertTimeFormat = (time) => {
    if (!time) return '';
    // "6h30" -> "06:30:00"
    const match = time.match(/(\d+)h(\d+)/);
    if (match) {
      const hours = match[1].padStart(2, '0');
      const minutes = match[2].padStart(2, '0');
      return `${hours}:${minutes}:00`;
    }
    return time;
  };

  // ========== FETCH AVAILABLE ROOMS ==========
  const fetchAvailableRooms = async () => {
    // Chỉ fetch khi đã có đủ thông tin
    if (!formData.day_of_week || !formData.start_hour || !formData.end_hour || 
        !formData.start_date || !formData.end_date) {
      setRooms([]);
      return;
    }

    setRoomsLoading(true);
    try {
      const response = await roomService.getAvailableRooms({
        day_of_week: formData.day_of_week,
        start_hour: convertTimeFormat(formData.start_hour),
        end_hour: convertTimeFormat(formData.end_hour),
        start_date: formData.start_date,
        end_date: formData.end_date,
      });
      
      if (response.success) {
        const roomsData = response.data?.rooms || [];
        setRooms(roomsData);
      } else {
        setRooms([]);
        toast.error(response.message || 'Không thể tải danh sách phòng trống');
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  };

  // Fetch available rooms when dates change
  useEffect(() => {
    if (formData.start_date && formData.end_date && formData.day_of_week) {
      fetchAvailableRooms();
    }
  }, [formData.start_date, formData.end_date, formData.day_of_week, formData.start_hour, formData.end_hour]);

  const fetchCourseRows = async (filterParams = courseFilters) => {
    try {
      setCourseLoading(true);
      const params = {
        page: coursePage,
        limit: 5
      };
      
      if (filterParams.semester) params.semester = filterParams.semester;
      if (filterParams.year) params.year = filterParams.year;
      if (filterParams.name) params.name = filterParams.name;
      if (filterParams.code) params.code = filterParams.code;
      
      const response = await courseService.getCourseSectionRows(params);
      
      if (response.success) {
        setCourseRows(response.data);
        setCoursePagination(response.pagination);
      } else {
        toast.error(response.message || 'Không thể tải danh sách học phần');
      }
    } catch (error) {
      console.error('Error fetching course rows:', error);
      toast.error('Đã có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setCourseLoading(false);
    }
  };

  const handleCourseFilterChange = (field, value) => {
    setCourseFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchCourses = () => {
    setCoursePage(1);
    fetchCourseRows();
  };

  const handleClearCourseFilters = () => {
    const emptyFilters = { semester: '', year: '', name: '', code: '' };
    setCourseFilters(emptyFilters);
    setCoursePage(1);
    fetchCourseRows(emptyFilters);
  };

  // ========== FETCH TEACHER ROWS ==========
  useEffect(() => {
    fetchTeachers();
  }, [teacherPage]);

  const fetchTeachers = async (filterParams = teacherFilters) => {
    try {
      setTeacherLoading(true);
      
      // Build params for API call
      const params = {
        page: teacherPage,
        limit: 10
      };
      
      if (filterParams.code) params.code = filterParams.code;
      if (filterParams.name) params.name = filterParams.name;
      if (filterParams.department) params.department = filterParams.department;
      
      const response = await teacherService.getAllTeachers(params);
      
      if (response.success) {
        // Map API response to match expected teacher row format
        const teachers = response.data.map(teacher => ({
          id: teacher.id,
          teacher_code: teacher.teacher_code,
          full_name: teacher.full_name,
          department: teacher.department || 'N/A',
          avatar_url: teacher.avatar_url
        }));
        
        setTeacherRows(teachers);
        setTeacherPagination(response.pagination);
      } else {
        toast.error(response.message || 'Không thể tải danh sách giảng viên');
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Đã có lỗi xảy ra khi tải dữ liệu giảng viên');
    } finally {
      setTeacherLoading(false);
    }
  };

  const handleTeacherFilterChange = (field, value) => {
    setTeacherFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchTeachers = () => {
    setTeacherPage(1);
    fetchTeachers();
  };

  const handleClearTeacherFilters = () => {
    const emptyFilters = { code: '', name: '', department: '' };
    setTeacherFilters(emptyFilters);
    setTeacherPage(1);
    fetchTeachers(emptyFilters);
  };

  const openDrawer = (props) => {
    setDrawerProps(props);
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setDrawerProps(null);
  };

  //lịch
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
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
    // Kiểm tra đã chọn học phần và giảng viên chưa
    if (!selectedCourse) {
      toast.warning('Vui lòng chọn học phần trước khi tạo lịch');
      return;
    }
    if (!selectedTeacher) {
      toast.warning('Vui lòng chọn giảng viên trước khi tạo lịch');
      return;
    }
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
        day_of_week: day || "",
        start_hour: startT,
        end_hour: endT,
        start_date: "",
        end_date: "",
        room_id: "",
        schedule_type: selectedCourse?.type || 'LT',
      });
    }
  }, [isDrawerOpen, drawerProps, selectedCourse, selectedTeacher, periodToTime]);

  const handleCreateSchedule = async () => {
    // Validate required selections
    if (!selectedCourse) {
      toast.error('Vui lòng chọn học phần');
      return;
    }
    if (!selectedTeacher) {
      toast.error('Vui lòng chọn giảng viên');
      return;
    }
    if (!formData.room_id) {
      toast.error('Vui lòng chọn phòng học');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      toast.error('Vui lòng chọn ngày bắt đầu và kết thúc');
      return;
    }

    setCreateLoading(true);
    try {
      const templateData = {
        course_section_id: selectedCourse.course_section_id,
        personnel_id: selectedTeacher.id,
        practice_group_id: selectedCourse.type === 'TH' ? selectedCourse.group_id : null,
        schedule_type: formData.schedule_type === 'LT' ? 'theory' : 'practice',
        day_of_week: formData.day_of_week,
        start_hour: convertTimeFormat(formData.start_hour),
        end_hour: convertTimeFormat(formData.end_hour),
        start_date: formData.start_date,
        end_date: formData.end_date,
        room_id: formData.room_id,
        is_active: true
      };

      const response = await scheduleService.createScheduleTemplate(templateData);
      
      if (response.success) {
        const sessionsCount = response.data?.classSessionsCreated || response.classSessionsCreated;
        toast.success(`Tạo lịch dạy thành công${sessionsCount ? `, đã tạo ${sessionsCount} buổi học` : ''}`);
        // Add to local schedules for display
        setSchedules((prev) => [...prev, {
          ...formData,
          fromPeriod: drawerProps?.from,
          toPeriod: drawerProps?.to,
          courseCode: selectedCourse.code,
          instructorCode: selectedTeacher.teacher_code,
        }]);
        closeDrawer();
        clearSelection();
      } else {
        toast.error(response.message || 'Không thể tạo lịch dạy');
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast.error(error.message || 'Đã xảy ra lỗi khi tạo lịch dạy');
    } finally {
      setCreateLoading(false);
    }
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

  // Generate background color for course codes ensuring adjacent ones differ
  const getCourseColorMapping = () => {
    const colors = [
      'bg-blue-50',
      'bg-green-50',
      'bg-yellow-50',
      'bg-purple-50',
      'bg-pink-50',
      'bg-indigo-50',
      'bg-orange-50',
      'bg-teal-50',
      'bg-cyan-50',
      'bg-rose-50',
    ];
    
    const colorMap = {};
    let previousColor = null;
    let colorIndex = 0;
    
    // Get unique course codes in order of appearance
    const uniqueCodes = [];
    courseRows.forEach(row => {
      if (row.code && !uniqueCodes.includes(row.code)) {
        uniqueCodes.push(row.code);
      }
    });
    
    // Assign colors ensuring adjacent codes get different colors
    uniqueCodes.forEach((code) => {
      let selectedColor;
      
      if (previousColor === null) {
        // First course code
        selectedColor = colors[0];
        colorIndex = 0;
      } else {
        // Find next color different from previous
        colorIndex = (colorIndex + 1) % colors.length;
        selectedColor = colors[colorIndex];
      }
      
      colorMap[code] = selectedColor;
      previousColor = selectedColor;
    });
    
    return colorMap;
  };

  const courseColorMap = getCourseColorMapping();

  // Determine learning form based on row type
  const learningForm = selectedCourse?.type === 'LT' ? 'Lý thuyết' : selectedCourse?.type === 'TH' ? 'Thực hành' : null;
  const theoryDisabled = selectedCourse?.type === 'TH' || theoryAssigned;
  const practiceDisabled = selectedCourse?.type === 'LT';


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
                  <select 
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseFilters.semester}
                    onChange={(e) => handleCourseFilterChange('semester', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="1">Học kỳ 1</option>
                    <option value="2">Học kỳ 2</option>
                    <option value="3">Học kỳ 3 (Hè)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã số học phần
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: INT3104"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseFilters.code}
                    onChange={(e) => handleCourseFilterChange('code', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên môn học
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Cấu trúc dữ liệu"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseFilters.name}
                    onChange={(e) => handleCourseFilterChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Năm học
                  </label>
                  <select 
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseFilters.year}
                    onChange={(e) => handleCourseFilterChange('year', e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    <option value="2025">2025-2026</option>
                    <option value="2024">2024-2025</option>
                    <option value="2023">2023-2024</option>
                    <option value="2022">2022-2023</option>
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
                    onClick={handleSearchCourses}
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200" 
                    title="Tìm kiếm"
                  >
                    <FileSearchIcon className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 transition-all duration-200" title="Tải file excel">
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" title="Tải file mẫu excel">
                    <File className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleClearCourseFilters}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" 
                    title="Xóa bộ lọc"
                  >
                    <FilterX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ============= TABLSS CONTAINER: 60% Course + 40% Teacher ============= */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
              
              {/* ============= TABLE MÔN HỌC (60%) ============= */}
              <div className="lg:col-span-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    DANH SÁCH HỌC PHẦN
                  </h3>
                </div>
                <div className="overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow">
                  <table className="w-full table-auto border-collapse text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-gray-100">
                      <tr className="border-b">
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">
                          <input type="radio" name="course" />
                        </th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">Mã HP</th>
                        <th className="h-10 px-2 min-w-[180px] text-[10px] font-semibold text-slate-600 uppercase">Tên học phần</th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">Loại</th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">Nhóm TH</th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">Học kỳ</th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">TC</th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">SV</th>
                        <th className="h-10 px-2 text-center text-[10px] font-semibold text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseLoading ? (
                        <tr>
                          <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                            <div className="flex justify-center items-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                              Đang tải...
                            </div>
                          </td>
                        </tr>
                      ) : courseRows.length === 0 ? (
                        <EmptyState
                          title="Không tìm thấy học phần"
                          description="Không có học phần nào phù hợp với bộ lọc tìm kiếm của bạn."
                          colSpan={9}
                          onAction={handleClearCourseFilters}
                        />
                      ) : (
                        courseRows.map((row) => (
                          <tr key={`${row.course_section_id}-${row.type}-${row.group_id || 'lt'}`}
                            className={`border-b hover:brightness-95 transition-colors h-9 ${courseColorMap[row.code] || 'bg-white'}`}>
                            <td className="px-2 py-1">
                              <input type="radio" name="course" onChange={() => setSelectedCourse(row)} />
                            </td>
                            <td className="px-2 py-1 text-xs font-medium">{row.code}</td>
                            <td className="px-2 py-1 text-xs max-w-[200px] truncate" title={row.name}>{row.name}</td>
                            <td className="px-2 py-1">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                row.type === 'LT' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              }`}>{row.type}</span>
                            </td>
                            <td className="px-2 py-1 text-xs">{row.group_name || '-'}</td>
                            <td className="px-2 py-1 text-xs">
                              {row.semester ? `HK${row.semester.split('-')[1]} ${row.semester.split('-')[0]}` : '-'}
                            </td>
                            <td className="px-2 py-1 text-xs">{row.credits}</td>
                            <td className="px-2 py-1 text-xs">{row.group_max_students}</td>
                            <td className="px-2 py-1">
                              <div className="flex justify-center">
                                <button title="Xem chi tiết">
                                  <Eye className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Pagination currentPage={coursePage} totalPages={coursePagination.totalPages} onPageChange={(page) => setCoursePage(page)} />
                </div>
              </div>

              {/* ============= TABLE GIẢNG VIÊN (40%) ============= */}
              <div className="lg:col-span-2">
                {/* Filter cho giảng viên */}
                <div className="bg-white border p-4 mb-2 rounded-t-lg">
                  <div className="flex items-center gap-2 mb-3 text-gray-800 font-semibold text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
                    </svg>
                    <span>Bộ lọc giảng viên</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Mã GV</label>
                      <input
                        type="text"
                        placeholder="VD: GV001"
                        className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={teacherFilters.code}
                        onChange={(e) => handleTeacherFilterChange('code', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tên GV</label>
                      <input
                        type="text"
                        placeholder="VD: Nguyễn Văn A"
                        className="w-full rounded border px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={teacherFilters.name}
                        onChange={(e) => handleTeacherFilterChange('name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Khoa/Viện</label>
                      <select
                        className="w-full rounded border px-2 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        value={teacherFilters.department}
                        onChange={(e) => handleTeacherFilterChange('department', e.target.value)}
                      >
                        <option value="">Tất cả</option>
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleSearchTeachers}
                      className="flex items-center justify-center gap-2 border border-emerald-400 text-emerald-600 px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-emerald-50 hover:border-emerald-500 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:ring-offset-1 transition-all duration-200"
                      title="Tìm kiếm"
                    >
                      <FileSearchIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleClearTeacherFilters}
                      className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 bg-white px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                      title="Xóa bộ lọc"
                    >
                      <FilterX className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3">
                  <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    DANH SÁCH GIẢNG VIÊN
                  </h3>
                </div>
                <div className="overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow">
                  <table className="w-full table-auto border-collapse text-left text-xs">
                    <thead className="sticky top-0 z-10 bg-gray-100">
                      <tr className="border-b">
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">
                          <input type="radio" name="teacher" />
                        </th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">Avatar</th>
                        <th className="h-10 px-2 text-[10px] font-semibold text-slate-600 uppercase">Mã GV</th>
                        <th className="h-10 px-2 min-w-[120px] text-[10px] font-semibold text-slate-600 uppercase">Họ tên</th>
                        <th className="h-10 px-2 min-w-[100px] text-[10px] font-semibold text-slate-600 uppercase">Khoa</th>
                        <th className="h-10 px-2 text-center text-[10px] font-semibold text-slate-600 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherLoading ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                            <div className="flex justify-center items-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                              Đang tải...
                            </div>
                          </td>
                        </tr>
                      ) : teacherRows.length === 0 ? (
                        <EmptyState
                          title="Không tìm thấy giảng viên"
                          description="Không có giảng viên nào phù hợp với bộ lọc tìm kiếm của bạn."
                          colSpan={6}
                          onAction={handleClearTeacherFilters}
                          actionLabel="Xóa bộ lọc"
                        />
                      ) : (
                        teacherRows.map((u) => (
                          <tr key={u.id} className="border-b hover:bg-slate-50 transition-colors h-9">
                          <td className="px-2 py-1">
                            <input type="radio" name="teacher" onChange={() => setSelectedTeacher(u)} />
                          </td>
                          <td className="px-2 py-1">
                            {u.avatar_url ? (
                              <img 
                                src={u.avatar_url} 
                                alt={u.full_name} 
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-medium">
                                {u.full_name?.charAt(0)?.toUpperCase() || 'G'}
                              </div>
                            )}
                          </td>
                          <td className="px-2 py-1 text-xs font-medium">{u.teacher_code}</td>
                          <td className="px-2 py-1 text-xs max-w-[120px] truncate" title={u.full_name}>{u.full_name}</td>
                          <td className="px-2 py-1 text-xs max-w-[100px] truncate" title={u.department}>{u.department}</td>
                          <td className="px-2 py-1">
                            <div className="flex justify-center">
                              <button title="Xem chi tiết">
                                <Eye className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <Pagination currentPage={teacherPage} totalPages={teacherPagination.totalPages} onPageChange={(page) => setTeacherPage(page)} />
                </div>
              </div>

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
                    {/* Thông tin học phần đã chọn */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Học phần đã chọn</h4>
                      {selectedCourse ? (
                        <div className="text-sm text-blue-700">
                          <p><span className="font-medium">Mã HP:</span> {selectedCourse.code}</p>
                          <p><span className="font-medium">Tên:</span> {selectedCourse.name}</p>
                          <p><span className="font-medium">Loại:</span> {selectedCourse.type === 'LT' ? 'Lý thuyết' : 'Thực hành'}</p>
                          {selectedCourse.group_name && <p><span className="font-medium">Nhóm:</span> {selectedCourse.group_name}</p>}
                        </div>
                      ) : (
                        <p className="text-sm text-blue-500 italic">Chưa chọn học phần</p>
                      )}
                    </div>

                    {/* Thông tin giảng viên đã chọn */}
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="text-sm font-semibold text-emerald-800 mb-2">Giảng viên đã chọn</h4>
                      {selectedTeacher ? (
                        <div className="text-sm text-emerald-700">
                          <p><span className="font-medium">Mã GV:</span> {selectedTeacher.teacher_code}</p>
                          <p><span className="font-medium">Họ tên:</span> {selectedTeacher.full_name}</p>
                          <p><span className="font-medium">Khoa:</span> {selectedTeacher.department}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-emerald-500 italic">Chưa chọn giảng viên</p>
                      )}
                    </div>

                    <hr className="my-4" />

                    {/* Thông tin lịch dạy */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thứ dạy
                        </label>
                        <input
                          type="text"
                          value={formData.day_of_week}
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại lịch
                        </label>
                        <input
                          type="text"
                          value={formData.schedule_type === 'LT' ? 'Lý thuyết' : 'Thực hành'}
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giờ bắt đầu
                        </label>
                        <input
                          type="text"
                          value={formData.start_hour}
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giờ kết thúc
                        </label>
                        <input
                          type="text"
                          value={formData.end_hour}
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-700"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày kết thúc <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phòng học <span className="text-red-500">*</span>
                      </label>
                      {!formData.start_date || !formData.end_date ? (
                        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-400 text-sm">
                          Vui lòng chọn ngày bắt đầu và kết thúc trước
                        </div>
                      ) : roomsLoading ? (
                        <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-500 text-sm flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          Đang tải danh sách phòng trống...
                        </div>
                      ) : (
                        <>
                          <select
                            value={formData.room_id}
                            onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                            className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          >
                            <option value="">-- Chọn phòng học --</option>
                            {rooms.map((room) => (
                              <option key={room.id} value={room.id}>
                                {room.room_code} - {room.room_name}
                              </option>
                            ))}
                          </select>
                          {rooms.length === 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                              Không có phòng trống cho khung giờ này
                            </p>
                          )}
                          {rooms.length > 0 && (
                            <p className="text-xs text-emerald-600 mt-1">
                              Có {rooms.length} phòng trống
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Hiển thị cảnh báo nếu chưa chọn đủ thông tin */}
                    {(!selectedCourse || !selectedTeacher) && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-700">
                          <span className="font-medium">Lưu ý:</span> Vui lòng chọn học phần và giảng viên từ bảng trước khi tạo lịch dạy.
                        </p>
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
                      disabled={createLoading}
                      className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Hủy
                    </button>

                    <button
                      onClick={handleCreateSchedule}
                      disabled={!selectedCourse || !selectedTeacher || !formData.room_id || !formData.start_date || !formData.end_date || createLoading}
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {createLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang tạo...
                        </>
                      ) : (
                        'Tạo lịch dạy'
                      )}
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