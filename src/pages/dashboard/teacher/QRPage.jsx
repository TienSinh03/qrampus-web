import React, { useEffect, useState } from "react";
// import { useTranslation } from 'react-i18next';
import StatsCard from "../../../components/common/StatsCard";
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
  View,
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
          <div className="h-32 w-full overflow-hidden rounded-t-2xl bg-[radial-gradient(circle_at_top,_#e5e7eb,_#cbd5f5)] flex flex-col justify-end px-4 pb-4">
            <p className="text-xl font-bold text-slate-800">{time}</p>
            <p className="text-sm text-slate-500 capitalize">{date}</p>
            <a
              onClick={() => window.open('/dashboard/results-qr-extend-student', '_blank')}
              className="mt-2 inline-flex items-center justify-center h-10 px-4 py-3 rounded-full text-slate-500 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all duration-300 ease-in-out shadow-md"
            >
              <View className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Màn hình điểm danh dành cho sinh viên</span>
            </a>


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

            <button
              onClick={() => navigate('/dashboard/qrcode-fullscreen')}
              className="mt-2 inline-flex h-10 p-3 items-center justify-center rounded-full text-slate-500 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all duration-300 ease-in-out shadow-md"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Chi tiết điểm danh</span>
            </button>


          </div>
        </div>

        {/* THÔNG TIN HỌC PHẦN */}

        <div className="rounded-2xl bg-white shadow-sm">
          {/* Image */}
          <div className="h-32 w-full overflow-hidden rounded-t-2xl bg-[radial-gradient(circle_at_top,_#e5e7eb,_#cbd5f5)] flex items-end">
            <h2 className="px-4 pb-4 text-lg font-semibold text-slate-800 drop-shadow-sm">
              LẬP TRÌNH THIẾT BỊ DI ĐỘNG
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
              Không
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto pr-2">
            {meetings.map((m, index) => (
              <div
                key={m.name}
                className={`flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-50
                  ${index !== meetings.length - 1 ? "mb-3" : ""}
                `}
                onClick={() => navigate('/dashboard/results-qr-detail-user')}
                style={{ cursor: "pointer" }}

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

    </div>
  );
};

export default QRPage;
