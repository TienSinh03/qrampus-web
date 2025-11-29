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
} from "lucide-react";

const ResultQRPage = () => {
  const { t } = useTranslation();

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
    },
  ];
  const pillStyle = {
    Active: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Inactive: "bg-gray-200 text-gray-600",
  };
  return (
    <div className="min-h-screen space-y-8 lg:space-y-6">
      {/* TOP SECTION: Header + Stats + Pie Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
          {/* Left: Welcome + Stats */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Kết quả điểm danh, <span className="text-purple-700">hôm nay!!!</span>
            </h2>
            <p className="text-gray-500 mt-2 leading-relaxed">
              Your progress this week is Awesome. Let's keep it up <br className="hidden sm:block" />
              and get a lot of points reward!
            </p>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-6 sm:gap-10 mt-8">
              {/* Hours Spent */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">C</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hours Spent</p>
                  <p className="text-xl font-bold text-purple-600">34h</p>
                </div>
              </div>

              {/* Test Results */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">L</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Test Results</p>
                  <p className="text-xl font-bold text-blue-500">82%</p>
                </div>
              </div>

              {/* Courses Completed */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">S</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Course Completed</p>
                  <p className="text-xl font-bold text-yellow-500">14</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Time Spending + Pie Chart */}
          <div className="flex items-center gap-8">
            <div className="hidden lg:block border-l border-gray-300 h-32" />

            <div className="text-center lg:text-right">
              <p className="font-semibold text-gray-700">Time spendings</p>
              <p className="text-sm text-gray-400">Weekly report</p>
              <p className="text-3xl font-bold mt-3">231h 14m</p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full font-medium">
                +18.4%
              </span>
            </div>

            {/* Pie Chart */}
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

                  {/* Total hours in center */}
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

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Column: Tổng quan hôm nay and Shipment Statistics */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tổng quan hôm nay */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Tổng quan hôm nay</h2>
              <span className="text-xs font-medium text-slate-400">Today</span>
            </div>
            <div className="max-h-96 overflow-y-auto pr-2">
              <table className="text-left">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="h-12 px-4">{t('users.name')}</th>
                    <th className="h-12 px-4">{t('users.email')}</th>
                    <th className="h-12 px-4">{t('users.role')}</th>
                    <th className="h-12 px-4">ID</th>
                    <th className="h-12 px-4">{t('users.status')}</th>
                    <th className="h-12 px-4">{t('users.actions')}</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-slate-50">
                      <td className="px-4 h-14 flex items-center gap-2">
                        <img src={u.avatar_url} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="font-medium">{u.full_name}</div>
                          <div className="text-sm text-gray-500">{u.email.split("@")[0]}</div>
                        </div>
                      </td>

                      <td className="px-4">{u.email}</td>
                      <td className="px-4">{u.role}</td>
                      <td className="px-4">{u.user_id}</td>

                      <td className="px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${pillStyle[u.status]}`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="px-4">

                        <div className="flex gap-3">
                          <Trash2 className="text-red-500 cursor-pointer w-5 h-5" />
                          <Eye className="text-blue-500 cursor-pointer w-5 h-5" />
                          {/* More Menu */}
                          <div className="relative">
                            <MoreVertical className="cursor-pointer w-5 h-5" onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)} />

                            {/* Dropdown */}
                            {openMenu === u.id && (
                              <div className="absolute mt-2 w-25 bg-white shadow-lg rounded-md border z-20">
                                <button className="w-full text-left px-4 py-2 hover:bg-slate-100" onClick={() => console.log("Edit", u.id)}>
                                  <PencilLine className="inline w-4 h-4 mr-2" />
                                </button>
                                <button className="w-full text-left px-4 py-2 hover:bg-slate-100" onClick={() => console.log("Lock", u.id)}>
                                  <LockKeyhole className="inline w-4 h-4 mr-2" />
                                </button>
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
          </div>
        </div>

        {/* Right Column: Topic Interest Bar Chart (Now with 60% width) */}
        <div className="bg-white rounded-2xl shadow-sm p-6 xl:col-span-1">
          {/* Horizontal Bar Chart */}
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={interestData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: "#555" }} width={80} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} label={{ position: "right", fill: "#333", fontWeight: 600, fontSize: 13 }}>
                  {interestData.map((entry, i) => <Cell key={`bar-${i}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-8">
            {interestData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700 font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>




    </div>
  );
};

export default ResultQRPage;