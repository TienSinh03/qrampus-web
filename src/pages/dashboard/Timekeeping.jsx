import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Filter,
  ChevronDown, TrendingUp, Star,
  ArrowDown, ArrowUp
} from "lucide-react";

export default function TeacherAttendancePage() {
  const [selectedSemester, setSelectedSemester] = useState(
    "Học kỳ I - 2025-2026"
  );
  const [selectedMonth, setSelectedMonth] = useState("Tất cả");

  // Giả sử đây là dữ liệu của 1 giảng viên đang đăng nhập
  const teacherInfo = {
    name: "TS. Nguyễn Văn An",
    employeeCode: "GV00124",
    totalSessions: 58,
    onTimeSessions: 54,
    lateOrManual: 4,
  };

  const sessions = [
    {
      date: "10/12/2025",
      time: "07:30 - 09:10",
      courseCode: "INT3306 3",
      courseName: "Phát triển ứng dụng Web",
      room: "301-B3",
      createdAt: "07:25", // giờ tạo QR
      status: "onTime", // onTime | late | manual | missing
    },
    {
      date: "09/12/2025",
      time: "09:20 - 11:00",
      courseCode: "INT3306 3",
      courseName: "Phát triển ứng dụng Web",
      room: "301-B3",
      createdAt: "09:30",
      status: "late",
    },
    {
      date: "08/12/2025",
      time: "13:30 - 15:10",
      courseCode: "INT3401",
      courseName: "Lập trình di động",
      room: "204-B4",
      createdAt: null,
      status: "manual",
      note: "Đã chấm tay do quên tạo QR",
    },
    // ... thêm nhiều buổi khác
  ];

  const filteredSessions = sessions.filter((s) => {
    if (selectedMonth === "Tất cả") return true;
    const month = new Date(
      s.date.split("/").reverse().join("-")
    ).toLocaleString("vi-VN", { month: "long" });
    return month === selectedMonth;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "onTime":
        return (
          <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle2 size={16} className="mr-1" /> Đúng giờ
          </span>
        );
      case "late":
        return (
          <span className="flex items-center text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
            <AlertTriangle size={16} className="mr-1" /> Tạo QR muộn
          </span>
        );
      case "manual":
        return (
          <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
            <AlertTriangle size={16} className="mr-1" /> Chấm tay
          </span>
        );
      default:
        return null;
    }
  };


  const [expanded, setExpanded] = useState(false);


  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="bg-white border shadow-sm rounded-b-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">

            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 text-3xl ">
              {teacherInfo.name.charAt(4)}
            </div>

            {/* Title */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl font-bold text-gray-800">
                {teacherInfo.name}
              </h2>
              <p className="text-gray-500 mt-1">
                Mã giảng viên: {teacherInfo.employeeCode}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 w-full lg:w-auto text-center">

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-600">
                  {teacherInfo.totalSessions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tổng tiết dạy
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-emerald-600">
                  {teacherInfo.onTimeSessions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tiết tạo QR đúng giờ
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  {teacherInfo.lateOrManual}
                  <Star size={18} />
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tiết tạo QR muộn
                </p>
              </div>



            </div>
          </div>
        </div>





        {/* Filter Section */}
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
                  Mở rộng bộ lọc
                </>
              )}
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng ngày
              </label>

              <div className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <input type="date" className="flex-1 outline-none" />
                <span className="text-gray-400">→</span>
                <input type="date" className="flex-1 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Học kỳ / năm học
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Học kỳ I - 2025-2026</option>
                <option>Học kỳ II - 2024-2025</option>
                <option>Học kỳ I - 2024-2025</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tháng
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Tháng 1</option>
                <option>Tháng 2</option>
                <option>Tháng 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã học phần
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 4203001549"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {expanded && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã học phần
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên học phần
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên lớp
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 20TCLC_DT3"
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </>
            )}


          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              Lọc
            </button>

            <button className="flex items-center gap-2 border border-green-600 text-green-600 px-5 py-2 rounded-lg hover:bg-green-50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-8 14H8v-4h3v4zm0-6H8V7h3v4zm5 6h-3v-7h3v7zm0-9h-3V7h3v1z" />
              </svg>
              Export Excel
            </button>

            <button className="flex items-center gap-2 border px-5 py-2 rounded-lg hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ngày
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Môn học
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Phòng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Giờ tạo QR
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSessions.map((session, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{session.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {session.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{session.courseCode}</p>
                        <p className="text-sm text-gray-600">
                          {session.courseName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{session.room}</td>
                    <td className="px-6 py-4">
                      {session.createdAt ? (
                        <span className="text-sm">{session.createdAt}</span>
                      ) : (
                        <span className="text-red-600 text-sm">
                          — Chưa tạo —
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(session.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
