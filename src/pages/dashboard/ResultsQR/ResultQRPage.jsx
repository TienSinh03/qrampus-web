import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useNavigate } from 'react-router-dom';

import {
  CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical,
  PencilLine, Users, UserCheck, UserX, UserPlus, SquareStar, SquareCheck,
  SquareUser,
  Calendar,
  CalendarClock,
  ExternalLink,
  AlarmClockCheck,
  CircleCheckBig,
  GalleryThumbnails,
  Delete,
  ArrowDownToLine,
} from "lucide-react";

const ResultQRPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Pie chart data (time distribution)
  const pieData = [
    { name: "A", value: 40 },
    { name: "B", value: 30 },
    { name: "C", value: 25 },
    { name: "D", value: 20 },
    { name: "E", value: 15 },
  ];

  const pieColors = ["#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#9be878"];
  const totalHours = pieData.reduce((sum, item) => sum + item.value, 0);

  // Bar chart data (topic interest)
  const interestData = [
    { name: "UI Design", value: 35, color: "#a855f7" },
    { name: "UX Design", value: 20, color: "#3b82f6" },
    { name: "Music", value: 14, color: "#65a30d" },
    { name: "Animation", value: 12, color: "#6b7280" },
    { name: "React", value: 10, color: "#dc2626" },
    { name: "SEO", value: 9, color: "#f59e0b" },
  ];
  const [openMenu, setOpenMenu] = useState(null);
  const users = [
    {
      id: 1,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      full_name: "Galen Slixby",
      email: "gslixby0@abc.net.au",
      role: "Editor",
      user_id: "123456",
      status: "Inactive",
    },
    {
      id: 2,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      full_name: "Halsey Redmore",
      email: "hredmore1@imgur.com",
      role: "Author",
      user_id: "125678",
      status: "Pending",
    },
    {
      id: 3,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      full_name: "Marjory Sicely",
      email: "msicely2@who.int",
      role: "Maintainer",
      user_id: "456321",
      status: "Active",
    },
    {
      id: 4,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
      full_name: "Cyrill Risby",
      email: "crisby3@wordpress.com",
      role: "Maintainer",
      user_id: "456789",
      status: "Inactive",
    },
    {
      id: 5,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    }, {
      id: 6,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    }, {
      id: 7,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    }, {
      id: 8,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    }, {
      id: 9,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    },
    {
      id: 10,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    },
    {
      id: 11,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    },
  ];
  const pillStyle = {
    Active: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Inactive: "bg-gray-200 text-gray-600",
  };
  return (
    <div className="min-h-screen space-y-8 lg:space-y-6 overflow-x-hidden">
      {/* TOP SECTION: Header + Stats + Pie Chart */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT – 40% */}
        <div className="lg:col-span-5 sm:col-span-12 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Kết quả điểm danh, <span className="text-purple-700">hôm nay!!!</span>
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">

              {/* Card 1 */}
              <div className="flex items-center gap-4 p-4 bg-purple-50 border border-purple-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-purple-600">C</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours Spent</p>
                  <p className="text-2xl font-bold text-purple-600">34h</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-blue-600">L</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Test Results</p>
                  <p className="text-2xl font-bold text-blue-600">82%</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-yellow-600">S</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courses Completed</p>
                  <p className="text-2xl font-bold text-yellow-600">14</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-emerald-600">✓</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Attendance Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">96%</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* MIDDLE – 30% */}
        <div className="lg:col-span-3 sm:col-span-12 rounded-2xl bg-white p-6 shadow-sm space-y-4">
          {/* Payment Cards */}
          <div className="flex flex-col gap-4">

            {/* Card 1 – Học phần */}
            <div className="group bg-gradient-to-r from-indigo-50 to-purple-50 
                            border border-indigo-100 shadow-sm hover:shadow-md
                            transition-all duration-300 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    Mã học phần
                  </p>
                  <p className="text-xl font-semibold text-slate-800 mb-3">
                    123 123 123 123
                  </p>

                  <p className="text-lg font-semibold text-slate-800">
                    Lập trình thiết bị di động
                  </p>
                  <p className="text-sm text-purple-600 font-medium mt-1">
                    Loại học: TH – N1
                  </p>
                </div>

                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 text-lg font-bold">📘</span>
                </div>
              </div>
            </div>

            {/* Card 2 – Sinh viên */}
            <div className="group bg-gradient-to-r from-emerald-50 to-teal-50
                            border border-emerald-100 shadow-sm hover:shadow-md
                            transition-all duration-300 rounded-2xl p-5">
              <div className="flex items-center gap-4">

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-emerald-600 text-xl font-bold">👤</span>
                </div>

                {/* Info */}
                <div>
                  <p className="text-lg font-semibold text-slate-800">
                    Nguyễn Văn A
                  </p>
                  <p className="text-sm text-gray-500">MÃ GV: 123456</p>
                  <p className="text-sm text-gray-500">Ngày tạo: 12/12/2025</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT – 30% */}
        <div className="lg:col-span-4 sm:col-span-12 rounded-2xl bg-white p-2 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-2">
            {/* Time info */}
            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Thời gian tạo QR */}
              <div>
                <p className="font-semibold text-gray-700">Thời gian tạo QR</p>
                <p className="text-3xl font-bold mt-2 text-purple-600">9:00AM</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Thời gian kết thúc</p>
                <p className="text-3xl font-bold mt-2 text-purple-600">9:05AM</p>
              </div>
              <div className="col-span-2 flex justify-center mt-1">
                <span className="inline-block px-4 py-1 bg-green-100 text-green-600 text-sm rounded-full font-medium">
                  <p className="text-3xl font-bold text-red-600">12/12/2025</p>
                </span>
              </div>

            </div>

            {/* Pie chart */}
            <div className="w-44 h-44 lg:w-48 lg:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius="60%"
                    outerRadius="90%"
                    paddingAngle={3}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={pieColors[i]} />
                    ))}
                  </Pie>

                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold fill-gray-700"
                  >
                    {totalHours}h
                  </text>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Bảng người dùng - CHIẾM 2 CỘT TRÊN MÀN LỚN */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {/* Bắt buộc có min-w để scroll ngang */}
            <div className="flex justify-between mb-6 p-2">
              <input
                type="text"
                placeholder="Search "
                className="border p-2 rounded-lg w-3/4"
              />
              <button onClick={() => navigate('/dashboard/results-qr-extend')} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
                <ExternalLink className="w-4 h-4" />
              </button>

            </div>
            <table className="w-full min-w-[800px] table-fixed border-collapse">
              {/* HEADER CỐ ĐỊNH */}
              <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                <tr >
                  <th className="w-64 px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('users.name')}</th>
                  <th className="w-72 px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('users.email')}</th>
                  <th className="w-32 px-4 py-3 text-left text-sm font-semibold text-gray-700">{t('users.role')}</th>
                  <th className="w-40 px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="w-32 px-4 py-3 text-center text-sm font-semibold text-gray-700">{t('users.status')}</th>
                  <th className="w-40 px-4 py-3 text-center text-sm font-semibold text-gray-700">{t('users.actions')}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors"
                    onClick={() => navigate('/dashboard/results-qr-detail-user')}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Tên + Avatar */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar_url || "/default-avatar.png"}
                          alt={u.full_name}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="truncate">
                          <div className="font-medium text-gray-900 truncate">{u.full_name}</div>
                          <div className="text-sm text-gray-500 truncate">@{u.email.split("@")[0]}</div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4 text-sm text-gray-700 truncate">{u.email}</td>

                    {/* Role */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-600">{u.role}</span>
                    </td>

                    {/* ID */}
                    <td className="px-4 py-4 text-sm text-gray-500 font-mono">{u.user_id}</td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${pillStyle[u.status] || 'bg-gray-100 text-gray-700'}`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer transition" /> */}
                        <Eye className="w-5 h-5 text-blue-500 hover:text-blue-700 cursor-pointer transition" />

                        <div className="relative">
                          {/* <MoreVertical
                            className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(openMenu === u.id ? null : u.id);
                            }}
                          /> */}
                          {openMenu === u.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                              {/* <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2">
                                <PencilLine className="w-4 h-4" /> Edit
                              </button>
                              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                <LockKeyhole className="w-4 h-4" /> Lock Account
                              </button> */}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Optional: Thông báo khi không có dữ liệu */}
          {users.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Không có người dùng nào
            </div>
          )}
        </div>


      </div>
      {/* Right Column: Biểu đồ */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* ... giữ nguyên phần chart của bạn ... */}
        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={interestData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: "#555" }} width={100} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} label={{ position: "right", fill: "#333", fontWeight: 600 }}>
                {interestData.map((entry, i) => (
                  <Cell key={`bar-${i}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          {interestData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <span className="font-bold text-gray-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

    </div>


  );
};

export default ResultQRPage;