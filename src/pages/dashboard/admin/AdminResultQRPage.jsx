import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useNavigate } from 'react-router-dom';
import {
  Users, UserCheck, UserX, UserPlus, MapPin, Monitor, 
  Clock, Calendar, Edit3, Search, Info, ArrowDown, ArrowUp, FilterX, FileSpreadsheet, FileSearchIcon
} from "lucide-react";
import TeacherPhotosModal from "./components/TeacherPhotosModal";

const AdminResultQRPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    studentId: "",
    fullName: "",
    status: "all",
    deviceCheck: "all",
    locationCheck: "all",
    dob: "",
  });

  // 1. Dữ liệu học phần & Người tạo
  const courseInfo = {
    id: "HP421234",
    name: "Lập trình thiết bị di động",
    type: "TH - Nhóm 1",
    creator: "Nguyễn Văn A",
    creatorID: "GV123456",
    createdAt: "12/12/2025"
  };

  // 2. Thông tin chung về phiên điểm danh
  const sessionStats = {
    startTime: "09:00 AM",
    endTime: "09:05 AM",
    date: "12/12/2025",
    qrTotal: 150, // Số lượng QR đã tạo
    totalStudents: 50, // Sĩ số
    success: 42,
    absent: 5,
    excused: 3
  };

  // 3. Dữ liệu biểu đồ thống kê
  const pieData = [
    { name: "Thành công", value: sessionStats.success, color: "#22c55e" },
    { name: "Vắng", value: sessionStats.absent, color: "#ef4444" },
    { name: "Phép", value: sessionStats.excused, color: "#3b82f6" },
  ];

  // 4. Danh sách sinh viên chi tiết
  const [attendanceList] = useState([
    {
      id: "21010611",
      name: "Trần Minh Tiến",
      dob: "15/05/2003",
      qrGenerated: "09:00:05",
      scanTime: "09:02:15",
      deviceID: "IPHONE-15-X1",
      deviceMatch: true,
      location: "Phòng C102 (HCMAF)",
      locationMatch: true,
      status: "Thành công",
      avatar: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png"
    },
    {
      id: "21010612",
      name: "Lê Văn B",
      dob: "22/11/2003",
      qrGenerated: "09:01:20",
      scanTime: "09:03:00",
      deviceID: "SAMSUNG-S23-U",
      deviceMatch: false,
      location: "Quận 12 (Cách 5km)",
      locationMatch: false,
      status: "Vắng",
      avatar: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png"
    },
    {
      id: "21010613",
      name: "Nguyễn Thị C",
      dob: "01/02/2004",
      qrGenerated: "09:00:10",
      scanTime: "09:04:01",
      deviceID: "XIAOMI-14-PRO",
      deviceMatch: true,
      location: "Phòng C102 (HCMAF)",
      locationMatch: true,
      status: "Có phép",
      avatar: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png"
    },
    {
      id: "21010614",
      name: "Phạm Văn D",
      dob: "12/09/2003",
      qrGenerated: "09:00:15",
      scanTime: "09:02:40",
      deviceID: "IPHONE-13",
      deviceMatch: true,
      location: "Phòng C102 (HCMAF)",
      locationMatch: true,
      status: "Thành công",
      avatar: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png"
    },
    {
      id: "21010615",
      name: "Trần Thị E",
      dob: "30/12/2003",
      qrGenerated: "09:00:20",
      scanTime: "09:05:00",
      deviceID: "OPPO-RENO",
      deviceMatch: false,
      location: "Bên ngoài khuôn viên",
      locationMatch: false,
      status: "Vắng",
      avatar: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png"
    },
    {
      id: "21010616",
      name: "Lý Văn F",
      dob: "07/07/2003",
      qrGenerated: "09:00:30",
      scanTime: "09:03:12",
      deviceID: "PIXEL-8",
      deviceMatch: true,
      location: "Phòng C102 (HCMAF)",
      locationMatch: true,
      status: "Thành công",
      avatar: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/6.png"
    }
  ]);

  const teacherPhotos = [
    {
      id: 1,
      url: "/assets/images/_34A8269.jpg",
      caption: "Ảnh lớp học số 1",
    },
    {
      id: 2,
      url: "/assets/images/_34A8289.jpg",
      caption: "Ảnh lớp học số 2",
    },
    {
      id: 3,
      url: "/assets/images/_34A8277.jpg",
      caption: "Ảnh lớp học số 3",
    },
    {
      id: 4,
      url: "/assets/images/_34A8304.jpg",
      caption: "Ảnh lớp học số 4",
    },
  ];

  const ITEMS_PER_PAGE = 5;

  const filteredAttendanceList = attendanceList.filter((st) => {
    const studentIdKeyword = filters.studentId.trim().toLowerCase();
    const fullNameKeyword = filters.fullName.trim().toLowerCase();
    const matchStudentId = !studentIdKeyword || st.id.toLowerCase().includes(studentIdKeyword);
    const matchFullName = !fullNameKeyword || st.name.toLowerCase().includes(fullNameKeyword);

    const matchStatus = filters.status === "all" || st.status === filters.status;
    const matchDevice =
      filters.deviceCheck === "all" ||
      (filters.deviceCheck === "match" && st.deviceMatch) ||
      (filters.deviceCheck === "mismatch" && !st.deviceMatch);
    const matchLocation =
      filters.locationCheck === "all" ||
      (filters.locationCheck === "match" && st.locationMatch) ||
      (filters.locationCheck === "mismatch" && !st.locationMatch);
    const matchDob = !filters.dob || st.dob === filters.dob;

    return matchStudentId && matchFullName && matchStatus && matchDevice && matchLocation && matchDob;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAttendanceList.length / ITEMS_PER_PAGE));
  const currentPageData = filteredAttendanceList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetFilters = () => {
    setFilters({ studentId: "", fullName: "", status: "all", deviceCheck: "all", locationCheck: "all", dob: "" });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50">
      {/* TOP SECTION */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* LEFT – THỐNG KÊ SỐ LƯỢNG (40%) */}
        <div className="lg:col-span-5  bg-white p-6 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tight">
            KẾT QUẢ ĐIỂM DANH <span className="text-indigo-600">HÔM NAY or NGÀY 12/12/2025</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50  border border-indigo-100">
              <div className="flex items-center gap-3 mb-1">
                <Users className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Sĩ số HP</span>
              </div>
              <p className="text-2xl font-black text-indigo-700">{sessionStats.totalStudents}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="flex items-center gap-3 mb-1">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Thành công</span>
              </div>
              <p className="text-2xl font-black text-emerald-700">{sessionStats.success}</p>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
              <div className="flex items-center gap-3 mb-1">
                <UserX className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Vắng mặt</span>
              </div>
              <p className="text-2xl font-black text-rose-700">{sessionStats.absent}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-1">
                <Info className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold text-slate-500 uppercase">Có phép</span>
              </div>
              <p className="text-2xl font-black text-blue-700">{sessionStats.excused}</p>
            </div>
          </div>
        </div>

        {/* MIDDLE – THÔNG TIN HỌC PHẦN (30%) */}
        <div className="lg:col-span-3 space-y-5">
          {/* Card thông tin học phần - Tone Blue Gradient tươi sáng */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
            {/* Vòng tròn decor tạo hiệu ứng chiều sâu */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Học phần
              </span>
              <h3 className="text-2xl font-black leading-tight mb-6 tracking-tight">
                {courseInfo.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-bold opacity-70 uppercase">Mã số</p>
                  <p className="text-sm font-black">{courseInfo.id}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-bold opacity-70 uppercase">Phân loại</p>
                  <p className="text-sm font-black">{courseInfo.type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Người tạo & Nút hành động */}
          <div className="bg-white p-4 border border-blue-50 shadow-sm">
            <div className="flex items-center gap-4 p-3 mb-3">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl border border-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Giảng viên / Người tạo</p>
                <p className="text-lg font-black text-blue-800 leading-none">{courseInfo.creator}</p>
                <p className="text-xs font-bold text-blue-400/60 mt-1">{courseInfo.creatorID}</p>
              </div>
            </div>

            {/* Nút Xem hình ảnh - Vibrant Blue Style */}
            <button
              onClick={() => setIsPhotosModalOpen(true)}
              className="group w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-2xl transition-all duration-300 shadow-lg shadow-blue-200 active:scale-[0.97]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              XEM HÌNH ẢNH HỌC TẬP
            </button>
          </div>
        </div>
        {/* RIGHT – THỜI GIAN & PIE CHART (30%) */}
        <div className="lg:col-span-4 bg-white p-6 shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 gap-4 mb-6 border-b pb-4 border-slate-50">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">Bắt đầu</p>
              <p className="text-lg font-black text-indigo-600">{sessionStats.startTime}</p>
            </div>
            <div className="text-center border-l">
              <p className="text-[10px] font-black text-slate-400 uppercase">Kết thúc</p>
              <p className="text-lg font-black text-rose-600">{sessionStats.endTime}</p>
            </div>
            <div className="col-span-2 text-center pt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Số QR đã tạo</p>
              <span className="px-4 py-1 bg-amber-100 text-amber-700 rounded-full text-lg font-black">
                {sessionStats.qrTotal}
              </span>
            </div>
          </div>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius="60%" outerRadius="90%" paddingAngle={5}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: DANH SÁCH CHI TIẾT */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-white border-b p-6">
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
            <span>Bộ lọc</span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center text-blue-600 hover:text-blue-800 ml-auto"
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">MSSV</label>
              <input
                type="text"
                value={filters.studentId}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, studentId: e.target.value }));
                  setCurrentPage(1);
                }}
                placeholder="Nhập MSSV"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
              <input
                type="text"
                value={filters.fullName}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, fullName: e.target.value }));
                  setCurrentPage(1);
                }}
                placeholder="Nhập họ tên"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, status: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="Thành công">Thành công</option>
                <option value="Vắng">Vắng</option>
                <option value="Có phép">Có phép</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kiểm tra thiết bị</label>
              <select
                value={filters.deviceCheck}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, deviceCheck: e.target.value }));
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="match">Khớp</option>
                <option value="mismatch">Không khớp</option>
              </select>
            </div>


            {expanded && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kiểm tra vị trí</label>
                  <select
                    value={filters.locationCheck}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, locationCheck: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="match">Khớp</option>
                    <option value="mismatch">Không khớp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input
                    type="text"
                    value={filters.dob}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, dob: e.target.value }));
                      setCurrentPage(1);
                    }}
                    placeholder="dd/mm/yyyy"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
              onClick={() => setCurrentPage(1)}
              title="Tìm kiếm"
            >
              <FileSearchIcon className="w-5 h-5" />
            </button>
            <button
              className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 transition-all duration-200"
              onClick={() => console.log("Export Excel", filteredAttendanceList)}
              title="Tải file excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button
              className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
              onClick={handleResetFilters}
              title="Xóa bộ lọc"
            >
              <FilterX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">MSSV</th>
                <th className="px-6 py-4">Họ tên</th>
                <th className="px-6 py-4">Ngày sinh</th>
                <th className="px-6 py-4">Thời gian tạo QR</th>
                <th className="px-6 py-4">Thời gian quét</th>
                <th className="px-6 py-4">ID Thiết bị</th>
                <th className="px-6 py-4">Vị trí ghi nhận</th>
                <th className="px-6 py-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentPageData.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-indigo-600">{st.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-800">{st.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                      <Calendar className="w-3 h-3" /> {st.dob}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Calendar className="w-3 h-3" /> {st.qrGenerated}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                      <Clock className="w-3 h-3" /> {st.scanTime}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 text-xs font-black p-2 rounded-lg border w-fit ${st.deviceMatch ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      <Monitor className="w-3.5 h-3.5" /> {st.deviceID}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 text-xs font-bold ${st.locationMatch ? 'text-slate-600' : 'text-rose-600'}`}>
                      <MapPin className={`w-3.5 h-3.5 ${st.locationMatch ? 'text-indigo-400' : 'text-rose-500'}`} />
                      {st.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-colors">
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <TeacherPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        photos={teacherPhotos}
      />
    </div>
  );
};

export default AdminResultQRPage;