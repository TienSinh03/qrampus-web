import React, { useEffect, useState } from "react";
// import { useTranslation } from 'react-i18next';
import StatsCard from "../../components/common/StatsCard";
import {
  CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical,
  PencilLine, Users, UserCheck, UserX, UserPlus, SquareStar, SquareCheck,
  SquareUser,
  Calendar,
  CalendarClock,
  PieChart,
  ExternalLink,
  AlarmClockCheck,
  CircleCheckBig,
  GalleryThumbnails,
  Delete,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

import { QRCodeSVG } from "qrcode.react";


const QRPage = () => {
  const navigate = useNavigate();
  // const { t } = useTranslation();
  const meetings = [
    // Thành công (<= 20 giây)
    {
      name: "Nguyễn Văn An",
      date: "26 Nov",
      time: "08:00 - 08:05",
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-sky-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
    },
    {
      name: "Trần Thị Bình",
      date: "26 Nov",
      time: "08:15 - 08:25", // 10s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-pink-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
    },
    {
      name: "Lê Văn Cường",
      date: "26 Nov",
      time: "08:30 - 08:40", // 10s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-orange-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
    },
    {
      name: "Phạm Thu Duyên",
      date: "26 Nov",
      time: "09:00 - 09:15", // 15s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-green-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
    },
    {
      name: "Hoàng Minh Đức",
      date: "26 Nov",
      time: "09:30 - 09:50", // 20s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-red-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
    },

    // Cho phép (<= 30 giây)
    {
      name: "Đỗ Thị Giang",
      date: "26 Nov",
      time: "10:00 - 10:25", // 25s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-cyan-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/6.png",
    },
    {
      name: "Vũ Văn Hùng",
      date: "26 Nov",
      time: "10:30 - 11:00", // 30s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-lime-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/7.png",
    },
    {
      name: "Nguyễn Thị Hương",
      date: "26 Nov",
      time: "11:05 - 11:30", // 25s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-indigo-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/8.png",
    },
    {
      name: "Trần Văn Khoa",
      date: "26 Nov",
      time: "11:35 - 11:58", // 23s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-amber-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
    },
    {
      name: "Lê Minh Lý",
      date: "26 Nov",
      time: "13:00 - 13:28", // 28s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-teal-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
    },

    // Vượt mức (<= 40 giây)
    {
      name: "Phạm Văn Nam",
      date: "26 Nov",
      time: "13:30 - 14:05", // 35s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-blue-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
    },
    {
      name: "Hoàng Thị Oanh",
      date: "26 Nov",
      time: "14:10 - 14:50", // 40s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-purple-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
    },
    {
      name: "Đỗ Minh Quân",
      date: "26 Nov",
      time: "15:00 - 15:35", // 35s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-rose-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
    },
    {
      name: "Vũ Thị Sen",
      date: "26 Nov",
      time: "15:40 - 16:18", // 38s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-fuchsia-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/6.png",
    },
    {
      name: "Nguyễn Văn Tài",
      date: "26 Nov",
      time: "16:20 - 16:59", // 39s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-violet-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/7.png",
    },

    // Không (<= 5 phút)
    {
      name: "Trần Thị Uyên",
      date: "26 Nov",
      time: "17:00 - 17:30", // 30s (dưới 5 phút)
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
    },
    {
      name: "Lê Văn Vinh",
      date: "26 Nov",
      time: "17:40 - 18:25", // 45s (dưới 5 phút)
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
    },
    {
      name: "Phạm Thị Xuân",
      date: "26 Nov",
      time: "18:30 - 19:00", // 30s
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
    },
    {
      name: "Hoàng Minh Yến",
      date: "26 Nov",
      time: "19:05 - 19:43", // 38s
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
    },
    {
      name: "Đỗ Văn Zũng",
      date: "26 Nov",
      time: "20:00 - 20:50", // 50s
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
    },
  ];

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const dateString = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setTime(timeString);
      setDate(dateString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="space-y-6">


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="SĨ SỐ"
          value="21,459"
          percent="(+29%)"
          positive={true}
          subtitle="Số SV học phần"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />

        <StatsCard
          title="SỐ LƯỢNG ĐANG SỬ LÝ"
          value="4,567"
          percent="(+18%)"
          positive={true}
          subtitle="Số SV đang xử lý"
          icon={<UserPlus className="w-6 h-6 text-rose-600" />}
          iconBg="bg-rose-100"
        />

        <StatsCard
          title="SỐ LƯỢNG ĐANG HOẠT ĐỘNG"
          value="19,860"
          percent="(-14%)"
          positive={false}
          subtitle="Số SV đang hoạt động"
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100"
        />

        <StatsCard
          title="SỐ LƯỢNG CHƯA THỰC HIỆN"
          value="237"
          percent="(+42%)"
          positive={true}
          subtitle="Số SV chưa thực hiện"
          icon={<UserX className="w-6 h-6 text-yellow-600" />}
          iconBg="bg-yellow-100"
        />

      </div>
      <div className="grid gap-6 xl:grid-cols-3">

        <div className="rounded-2xl bg-white shadow-sm">
          <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-slate-200">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#e5e7eb,_#cbd5f5)]" />
            <h2 className="absolute bottom-4 left-4  font-semibold text-slate-800 drop-shadow-sm">
              <p className="text-xl font-bold text-slate-800">{time}</p>
              <p className="text-sm text-slate-500 capitalize">{date}</p>

            </h2>
          </div>

          {/* QR CODE */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <QRCodeSVG
                value="https://your-link-or-data-here.com"
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Quét QR để xem thông tin học phần
            </p>
          </div>
        </div>

        {/* THÔNG TIN HỌC PHẦN */}

        <div className="rounded-2xl bg-white shadow-sm">
          {/* Image */}
          <div className="relative h-32 w-full overflow-hidden rounded-t-2xl bg-slate-200">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#e5e7eb,_#cbd5f5)]" />

            {/* Text bottom-left */}
            <h2 className="absolute bottom-4 left-4  font-semibold text-slate-800 drop-shadow-sm">
              LẬP TRÌNH THIẾT BỊ DI DỘNG
            </h2>
          </div>

          <div className="p-6">
            {/* Header event */}
            <div className="mb-6 flex gap-2">
              <div className="flex h-16 w-24 flex-col items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <span className="text-xs font-medium">Jan</span>
                <span className="text-xl font-bold">24</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  <a onClick={() => navigate('/dashboard/study-session')} className="hover:underline" style={{ cursor: "pointer" }}>
                    42345677843
                  </a>

                  <button onClick={() => navigate('/dashboard/study-session')} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  Học phần học về các kỹ thuật lập trình web nâng cao sử dụng
                  các framework phổ biến hiện nay.
                </p>
              </div>
            </div>

            {/* Status buttons */}
            <div className="mb-6 flex items-center justify-between text-xs">
              <button className="flex flex-col items-center gap-1 text-yellow-500 hover:text-yellow-200">
                <SquareStar className="w-5 h-5 " />
                <span>HK1</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-yellow-500 hover:text-yellow-200">
                <SquareStar className="w-5 h-5 " />
                <span>2025-2026</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-green-600 hover:text-slate-700">
                <SquareCheck className="w-5 h-5 " />
                <span>ĐANG TẠO QR</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-violet-600">
                <SquareUser className="w-5 h-5 " />
                <span>Văn A</span>
              </button>

            </div>
            {/* Lịch sử điểm danh gần nhất */}
            <div className="space-y-3 text-xs text-slate-600 border-t pt-4 border-slate-200">
              <div className="flex items-start gap-3">
                <CalendarClock className="w-5 h-5 " />
                <div>
                  <p>Tuesday, 24 January, 10:20 - 12:30</p>
                  <p className="text-slate-400">Lần cũ nhất</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <SquareUser className="w-5 h-5 " />
                <div>
                  <p>Tạo bởi</p>
                  <p className="text-slate-400">
                    Nguyen Van A
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PieChart className="w-5 h-5 " />
                <div>
                  <p>Tổng SV:</p>
                  <p className="text-slate-400">
                    30/50 SV
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* chứa bảng điểm danh hiện tại*/}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Điểm danh hôm nay
            </h2>
            {/* mở ra danh sách KQ hôm đó */}
            <button onClick={() => navigate('/dashboard/results-qr')} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-4 flex gap-2 text-xs font-medium">
            <button className="rounded-full bg-violet-400 px-3 py-1 text-white shadow-sm">
              Thành công
            </button>
            <button className="rounded-full bg-yellow-400 px-3 py-1 text-slate-600 hover:bg-slate-200">
              Cho phép
            </button>
            <button className="rounded-full bg-red-400 px-3 py-1 text-white hover:bg-slate-200">
              Vượt mức
            </button>
            <button className="rounded-full bg-gray-100 px-3 py-1 text-slate-600 hover:bg-slate-200">
              Vượt mức
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto pr-2">
            {meetings.map((m, index) => (
              <div
                key={m.name}
                className={`flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-50
                  ${index !== meetings.length - 1 ? "mb-3" : ""}
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${m.avatarBg} text-lg`}
                  >
                    <img src={m.avatar_url} alt={m.name} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.name}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span>📅</span>
                      <span>{m.date}</span>
                      <span className="mx-1">|</span>
                      <span>{m.time}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${m.tagColor}`}
                >
                  {m.tag}
                </span>
              </div>
            ))}
          </div>
        </div>


      </div>

      {/* Top row */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Xem thống kê hiện tại */}
        <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Tổng quan hôm nay
            </h2>
            <span className="text-xs font-medium text-slate-400">
              Today
            </span>
          </div>

          {/* Stacked progress bar */}
          <div className="mb-6 overflow-hidden rounded-full bg-slate-100">
            <div className="flex h-6 text-[15px] font-semibold text-gray-900">
              <div className="flex items-center justify-center bg-violet-400 w-[39.7%]">
                39.7%
              </div>
              <div className="flex items-center justify-center bg-yellow-400 w-[28.3%]">
                28.3%
              </div>
              <div className="flex items-center justify-center bg-red-400 w-[17.4%]">
                17.4%
              </div>
              <div className="flex items-center justify-center bg-gray-100 w-[14.6%]">
                14.6%
              </div>
            </div>
          </div>

          {/* Detail rows */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <CircleCheckBig className="w-5 h-5 " />
                </span>
                <div>
                  <p className="font-medium text-slate-800">Thành công</p>
                  <p className="text-xs text-slate-500">Nhỏ 20s</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  Thời gian trung bình: 2hr 10min
                </p>
                <p className="text-xs text-slate-400">39.7%</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50 text-yellow-500">
                  <CircleCheckBig className="w-5 h-5 " />
                </span>
                <div>
                  <p className="font-medium text-slate-800">Cho phép</p>
                  <p className="text-xs text-slate-500">Nhỏ hơn 30s</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  Thời gian trung bình: 3hr 24min
                </p>
                <p className="text-xs text-slate-400">28.3%</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <GalleryThumbnails className="w-5 h-5 " />
                </span>
                <div>
                  <p className="font-medium text-slate-800">Vượt mức</p>
                  <p className="text-xs text-slate-500">Nhỏ hơn 40s</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  Thời gian trung bình: 1hr 24min
                </p>
                <p className="text-xs text-slate-400">17.4%</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Delete className="w-5 h-5 " />
                </span>
                <div>
                  <p className="font-medium text-slate-800">Không ghi danh</p>
                  <p className="text-xs text-slate-500">Không có thời gian</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  Thời gian trung bình: 5hr 19min
                </p>
                <p className="text-xs text-slate-400">14.6%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Statistics */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Shipment Statistics
              </h2>
              <p className="text-xs text-slate-500">
                Total number of deliveries 23.8k
              </p>
            </div>
            <select className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
              <option>January</option>
              <option>February</option>
              <option>March</option>
            </select>
          </div>

          {/* Fake chart using simple bars */}
          <div className="mb-4 flex h-40 items-end justify-between gap-2">
            {[
              { day: "1 Jan", ship: 32, del: 24 },
              { day: "2 Jan", ship: 38, del: 30 },
              { day: "3 Jan", ship: 28, del: 26 },
              { day: "4 Jan", ship: 34, del: 22 },
              { day: "5 Jan", ship: 45, del: 35 },
              { day: "7 Jan", ship: 36, del: 32 },
              { day: "9 Jan", ship: 34, del: 29 }
            ].map((d) => (
              <div
                key={d.day}
                className="flex flex-1 flex-col items-center justify-end gap-1"
              >
                <div className="flex w-full items-end justify-center gap-1">
                  <div
                    className="w-3 rounded-t-full bg-amber-400"
                    style={{ height: `${d.ship * 1.4}px` }}
                  />
                  <div
                    className="w-1 rounded-full bg-violet-400"
                    style={{ height: `${d.del * 1.2}px` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-slate-500">Shipment</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              <span className="text-slate-500">Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Delivery Performance */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-slate-800">
            Delivery Performance
          </h2>
          <p className="mb-4 text-xs text-slate-500">
            12% increase in this month
          </p>

          <div className="space-y-3 text-sm">
            {[
              {
                label: "Packages in transit",
                value: "10k",
                change: "+25.8%",
                icon: "🎁"
              },
              {
                label: "Packages out for delivery",
                value: "5k",
                change: "+4.3%",
                icon: "🚚"
              },
              {
                label: "Packages delivered",
                value: "15k",
                change: "-12.5%",
                icon: "✅",
                negative: true
              },
              {
                label: "Delivery success rate",
                value: "95%",
                change: "+35.6%",
                icon: "📈"
              },
              {
                label: "Average delivery time",
                value: "2.5 Days",
                change: "-2.15%",
                icon: "⏰",
                negative: true
              },
              {
                label: "Customer satisfaction",
                value: "4.5/5",
                change: "+5.7%",
                icon: "😊"
              }
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-lg">
                    {item.icon}
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    {item.label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">
                    {item.value}
                  </p>
                  <p
                    className={`text-xs font-medium ${item.negative ? "text-rose-500" : "text-emerald-500"
                      }`}
                  >
                    {item.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Exceptions */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Delivery Exceptions
          </h2>

          <div className="flex flex-col items-center justify-center gap-6">
            {/* Donut chart (fake) */}
            <div className="relative flex h-40 w-40 items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-gradient-to-tr from-lime-300 via-lime-400 to-green-500" />
              <div className="absolute h-28 w-28 rounded-full bg-white" />
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-semibold text-slate-800">
                  30%
                </span>
                <span className="text-xs text-slate-500">
                  AVG. Exceptions
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                <span className="text-slate-500">Incorrect address</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-slate-500">Weather conditions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-300" />
                <span className="text-slate-500">Federal holidays</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-slate-500">
                  Damage during transit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders by Countries */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Orders by Countries
              </h2>
              <p className="text-xs text-slate-500">
                62 deliveries in progress
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2 text-xs font-medium">
            <button className="rounded-full bg-violet-500 px-3 py-1 text-white shadow-sm">
              New
            </button>
            <button className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200">
              Preparing
            </button>
            <button className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200">
              Shipping
            </button>
          </div>

          {/* Orders list */}
          <div className="space-y-4 text-sm">
            {[
              {
                sender: "Micheal Hughes",
                sAddress: "101 Boulder, California (CA), 933130",
                receiver: "Daisy Coleman",
                rAddress: "939 Orange, California (CA), 910614"
              },
              {
                sender: "Glenn Todd",
                sAddress: "1713 Garnet, California (CA), 939573",
                receiver: "Arthur West",
                rAddress: "156 Blaze, California (CA), 925878"
              }
            ].map((o, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3"
              >
                <div className="mb-2">
                  <p className="text-[11px] font-semibold uppercase text-emerald-500">
                    Sender
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {o.sender}
                  </p>
                  <p className="text-xs text-slate-500">{o.sAddress}</p>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <p className="text-[11px] font-semibold uppercase text-violet-500">
                    Receiver
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {o.receiver}
                  </p>
                  <p className="text-xs text-slate-500">{o.rAddress}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Meeting schedule */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Meeting Schedule
            </h2>
            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
              ⋮
            </button>
          </div>

          <div className="space-y-4">
            {meetings.map((m) => (
              <div
                key={m.name}
                className="flex items-center justify-between rounded-xl px-2 py-1 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${m.avatarBg} text-lg`}
                  >
                    {m.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {m.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span>📅</span>
                      <span>{m.date}</span>
                      <span className="mx-1">|</span>
                      <span>{m.time}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${m.tagColor}`}
                >
                  {m.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Highlighted event */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Orders by Countries
              </h2>
              <p className="text-xs text-slate-500">
                62 deliveries in progress
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 flex gap-2 text-xs font-medium">
            <button className="rounded-full bg-violet-500 px-3 py-1 text-white shadow-sm">
              New
            </button>
            <button className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200">
              Preparing
            </button>
            <button className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 hover:bg-slate-200">
              Shipping
            </button>
          </div>

          {/* Orders list */}
          <div className="space-y-4 text-sm">
            {[
              {
                sender: "Micheal Hughes",
                sAddress: "101 Boulder, California (CA), 933130",
                receiver: "Daisy Coleman",
                rAddress: "939 Orange, California (CA), 910614"
              },
              {
                sender: "Glenn Todd",
                sAddress: "1713 Garnet, California (CA), 939573",
                receiver: "Arthur West",
                rAddress: "156 Blaze, California (CA), 925878"
              }
            ].map((o, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-3"
              >
                <div className="mb-2">
                  <p className="text-[11px] font-semibold uppercase text-emerald-500">
                    Sender
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {o.sender}
                  </p>
                  <p className="text-xs text-slate-500">{o.sAddress}</p>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <p className="text-[11px] font-semibold uppercase text-violet-500">
                    Receiver
                  </p>
                  <p className="text-sm font-semibold text-slate-800">
                    {o.receiver}
                  </p>
                  <p className="text-xs text-slate-500">{o.rAddress}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default QRPage;
