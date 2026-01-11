import React from "react";
import { Calendar, Bell, Clock, User, Ellipsis } from "lucide-react";
export default function AttendanceDashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

          <h1 className="text-xl font-bold text-blue-700 mb-6">
            Dshboard bộ phận chấm công
          </h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left: Avatar + Basic Info */}
                <div className="md:col-span-1 flex justify-center items-center">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mb-4 transition-all transform hover:scale-105">
                      <img
                        src="https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png"
                        alt="Student"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline hover:text-blue-800 transition-colors"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>



                {/* Center: Main Info */}
                <div className="md:col-span-1 space-y-3">
                  <div>
                    <span className="text-gray-600">Mã nhân sự:</span>
                    <span className="ml-2 font-semibold">0111111</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="ml-2 font-semibold">Trần Minh Tiến</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Giới tính:</span>
                    <span className="ml-2">Nam</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngày sinh:</span>
                    <span className="ml-2">04/11/2003</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Nơi sinh:</span>
                    <span className="ml-2">Đồng Tháp</span>
                  </div>
                </div>

                {/* Right: Academic Info */}
                <div className="md:col-span-1 space-y-3">
                  <div>
                    <span className="text-gray-600">Khoa:</span>
                    <span className="ml-2 font-semibold">Công nghệ thông tin</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="ml-2">0123456789</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Học vị:</span>
                    <span className="ml-2">Thạc sĩ</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Loại hình đào tạo:</span>
                    <span className="ml-2">Chính quy</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngành:</span>
                    <span className="ml-2">Kỹ thuật phần mềm</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Notifications & Schedule */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Notifications */}
                <div className="bg-green-50 rounded-lg p-6 text-center border-2 border-green-200">
                  <div className="flex justify-center mb-3">
                    <div className="relative">
                      <Bell className="w-8 h-8 text-green-600" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        0
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Nhắc nhắc mới, chưa xem
                  </p>
                  <p className="text-4xl font-bold text-green-700 mt-2">0</p>
                  <a href="#" className="text-sm text-green-600 hover:underline mt-3 inline-block">
                    Xem chi tiết
                  </a>
                </div>

                {/* Weekly Classes */}
                <div className="bg-blue-50 rounded-lg p-6 text-center border-2 border-blue-200">
                  <div className="flex justify-center mb-3">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Lịch học trong tuần</p>
                  <p className="text-4xl font-bold text-blue-700 mt-2">0</p>
                  <a href="#" className="text-sm text-blue-600 hover:underline mt-3 inline-block">
                    Xem chi tiết
                  </a>
                </div>

                {/* Weekly Exams */}
                <div className="bg-orange-50 rounded-lg p-6 text-center border-2 border-orange-200">
                  <div className="flex justify-center mb-3">
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-gray-700 font-medium">Lịch thi trong tuần</p>
                  <p className="text-4xl font-bold text-orange-700 mt-700 mt-2">0</p>
                  <a href="#" className="text-sm text-orange-600 hover:underline mt-3 inline-block">
                    Xem chi tiết
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-1 mt-6">

        {/* TRANSACTIONS */}

        <div className="lg:row-span-2 rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-rose-100/70 bg-gradient-to-br from-rose-50 via-white to-rose-100/60">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
            <div>
              <p className="text-ms uppercase tracking-wide text-rose-400 mb-1">
                Học phần
              </p>
              <h2 className="text-sm md:text-base font-semibold text-rose-600">
                Học phần dạy kỳ này
              </h2>
            </div>

            <button className="self-start md:self-auto px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500 text-white shadow-sm hover:bg-rose-600 transition">
              Xem tất cả
            </button>
          </div>

          {/* DANH SÁCH CUỘN DỌC */}
          <div className="relative max-h-64 overflow-y-auto pr-1 space-y-3">
            {/* item 1 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-rose-100 hover:bg-rose-50 transition">
              <div className="mt-0.5 h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center text-white shadow-sm">
                <span className="text-lg">🎓</span>
              </div>
              <div className="text-xs sm:text-sm leading-snug text-slate-700">
                <div className="font-semibold">
                  Lập trình hướng đối tượng
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400">
                  3 tín chỉ • 45 tiết • Lý thuyết + thực hành
                </div>
              </div>
            </div>

            {/* item 2 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-rose-100 hover:bg-rose-50 transition">
              <div className="mt-0.5 h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-400 flex items-center justify-center text-white shadow-sm">
                <span className="text-lg">💻</span>
              </div>
              <div className="text-xs sm:text-sm leading-snug text-slate-700">
                <div className="font-semibold">
                  Cấu trúc dữ liệu & Giải thuật
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400">
                  3 tín chỉ • 45 tiết
                </div>
              </div>
            </div>

            {/* item 3 */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-rose-100 hover:bg-rose-50 transition">
              <div className="mt-0.5 h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-400 flex items-center justify-center text-white shadow-sm">
                <span className="text-lg">📊</span>
              </div>
              <div className="text-xs sm:text-sm leading-snug text-slate-700">
                <div className="font-semibold">
                  Cơ sở dữ liệu
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400">
                  3 tín chỉ • Thực hành trên SQL
                </div>
              </div>
            </div>

            {/* item 4 (ví dụ thêm cho đủ scroll) */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-rose-100 hover:bg-rose-50 transition">
              <div className="mt-0.5 h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-sm">
                <span className="text-lg">📱</span>
              </div>
              <div className="text-xs sm:text-sm leading-snug text-slate-700">
                <div className="font-semibold">
                  Phát triển ứng dụng di động
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400">
                  2 tín chỉ • Project cuối kỳ
                </div>
              </div>
            </div>

            {/* thêm nhiều item nữa nếu muốn để scrollbar hiện rõ hơn */}
          </div>
        </div>




        {/* LOGISTICS */}
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-rose-500" />
              <span className="text-0.5xl font-semibold">Số giờ dạy trong tuần</span>
            </div>
            <div className="text-slate-400 text-xs">
              <Ellipsis w-5 h-5 />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">18h</span>
            <span className="text-sm text-emerald-500">89%</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Xem chi tiết</p>
        </div>

        {/* REPORTS */}
        <div className="rounded-xl bg-white p-4 shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-2xl bg-amber-400" />
              <span className="text-0.5xl font-semibold">Số giờ dạy trong tháng</span>
            </div>
            <div className="text-slate-400 text-xs">
              <Ellipsis w-5 h-5 />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">268h</span>
            <span className="text-sm text-rose-500">89%</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">Xem chi tiết</p>
        </div>

        {/* WEBSITE STATS */}
        <div className="lg:row-span-2 rounded-xl bg-white p-4 shadow">
          <div className="flex items-start justify-between mb-4">
            <span className="text-0.5xl font-semibold">Quá trình chấm công của bạn</span>
            <div className="text-slate-400 text-xs">
              <Ellipsis w-5 h-5 />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-4xl font-semibold">150h</span>
            <div className="flex h-20 items-end gap-1">

            </div>
          </div>
          <p className="text-xs text-slate-400 mb-4">Trạng thái chấm công</p>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Thành công</span>
              </div>
              <div className="flex gap-6">
                <span>86,471</span>
                <span>15%</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                <span>Thất bại</span>
              </div>
              <div className="flex gap-6">
                <span>86,471</span>
                <span>15%</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span >Thủ công</span>
              </div>
              <div className="flex gap-6">
                <span>86,471</span>
                <span>15%</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>Chưa chấm công</span>
              </div>
              <div className="flex gap-6">
                <span>86,471</span>
                <span>15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* NEW VISITORS */}
        <div className="lg:col-span-2 rounded-xl bg-rose-50 p-4 md:p-6 shadow">
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4">
            {/* Text bên trái */}
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-semibold text-rose-500 mb-1">
                Trong trường hợp Giảng viên, chưa điểm danh, không tạo phiên điểm danh
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mb-4">
                Giảng viên vui lòng liên hệ phòng đào tạo để được hỗ trợ thêm về việc chấm công giảng dạy.
              </p>
              <button className="inline-flex items-center px-4 py-2 rounded-md bg-rose-500 text-white text-xs font-semibold shadow-sm hover:bg-rose-600">
                Liên hệ phòng đào tạo
              </button>
            </div>

            {/* Hình bên phải */}
            <div className="w-32 h-24 md:w-40 md:h-28 rounded-lg bg-rose-100 flex items-center justify-center">
              {/* Đổi emoji này thành <img src="..." /> nếu bạn có file hình */}
              <span className="text-5xl">🧑🏻‍💻</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
