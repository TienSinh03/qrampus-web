import React, { useState } from "react";
import {
  Mail,
  Star,
  Send,
  Archive,
  Trash2,
  Search,
  MoreVertical,
  Menu,
  X,
  AlertCircle,
  Clock,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function AnnouncementPageV2() {
  const [selected, setSelected] = useState([]);
  const [starred, setStarred] = useState([2, 4, 6]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const notifications = [
    {
      id: 1,
      maHP: "INT3306",
      lop: "20TCLC_DT3",
      title: "Hạn chót nộp bài tập lớn – Nhóm 5 chưa nộp",
      sender: "Hệ thống Moodle",
      preview: "Nhóm 5 (21010611...) chưa nộp bài tập lớn môn INT3306",
      time: "02:46",
      unread: true,
      label: "urgent",
    },
    {
      id: 2,
      maHP: "WEB301",
      lop: "21TCLC_DT1",
      title: "Phản hồi bài kiểm tra giữa kỳ đã được gửi",
      sender: "Nguyễn Văn A",
      preview: "Em cảm ơn thầy đã chấm bài rất chi tiết...",
      time: "02:58",
      unread: true,
      label: "personal",
    },
    {
      id: 3,
      maHP: "INT3306",
      lop: "20TCLC_DT3",
      title: "Thông báo nghỉ học – Trần Thị Bình",
      sender: "Trần Thị Bình",
      preview: "Em xin phép nghỉ buổi hôm nay do bị ốm...",
      time: "04:04",
      unread: false,
      label: "important",
    },
    {
      id: 4,
      maHP: "AI402",
      lop: "22TCLC_AI1",
      title: "Câu hỏi về đề cương môn AI",
      sender: "Lê Văn Cường",
      preview: "Thầy ơi phần CNN có thi không ạ?",
      time: "06:02",
      unread: false,
      label: "question",
    },
    {
      id: 5,
      maHP: "PRJ301",
      lop: "21TCLC_DT5",
      title: "Lịch bảo vệ đồ án đợt 1",
      sender: "Phòng Đào tạo",
      preview: "Lịch bảo vệ đã được xếp, xem chi tiết...",
      time: "06:12",
      unread: false,
      label: "official",
    },
    {
      id: 6,
      maHP: "INT3306",
      lop: "20TCLC_DT3",
      title: "Slide buổi 12 đã cập nhật",
      sender: "Bạn (giáo viên)",
      preview: "Đã upload slide React Native lên Drive",
      time: "07:25",
      unread: false,
      label: "info",
    },
  ];

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleStar = (id) => {
    setStarred((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getLabelColor = (label) => {
    const map = {
      urgent: "bg-red-500",
      important: "bg-amber-500",
      personal: "bg-emerald-500",
      question: "bg-blue-500",
      official: "bg-purple-500",
      info: "bg-gray-500",
    };
    return map[label] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              Thông báo giảng viên
            </h1>
            <span className="text-sm text-gray-500 hidden sm:inline">
              ({notifications.filter((n) => n.unread).length} chưa đọc)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow hover:shadow-lg transition hidden sm:flex items-center gap-2"
              onClick={openDrawer}
            >
              Soạn thông báo
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-0 w-72 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="p-4 h-full overflow-y-auto">
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
              >
                <Mail className="w-5 h-5" />
                <span>Thông báo mới</span>
                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {notifications.filter((n) => n.unread).length}
                </span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <Star className="w-5 h-5 text-amber-500" />
                <span>Nhãn sao</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <Send className="w-5 h-5 text-gray-600" />
                <span>Thông báo gửi đi</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <Archive className="w-5 h-5 text-gray-600" />
                <span>Đã lưu trữ</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5 text-gray-600" />
                <span>Thùng rác</span>
              </a>
            </nav>

            <div className="mt-8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-4 mb-3">
                Nhãn
              </p>
              <div className="space-y-1">
                {[
                  "Khẩn cấp",
                  "Thông báo",
                  "Quan trọng",
                  "Quản trị",
                  "Chính thức",
                ].map((label, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${getLabelColor(
                        [
                          "urgent",
                          "important",
                          "personal",
                          "official",
                          "question",
                        ][i]
                      )}`}
                    ></div>
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="divide-y divide-gray-200">
            {notifications.map((noti) => (
              <div
                key={noti.id}
                className={`px-4 sm:px-6 py-4 hover:bg-white transition-all cursor-pointer group ${noti.unread
                    ? "bg-white border-l-4 border-l-indigo-500"
                    : "bg-gray-50"
                  } ${selected.includes(noti.id) ? "bg-indigo-50" : ""}`}
                onClick={() => toggleSelect(noti.id)}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(noti.id)}
                    onChange={() => toggleSelect(noti.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(noti.id);
                    }}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${starred.includes(noti.id)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-400"
                        }`}
                    />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {noti.sender[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span
                              className={`font-medium ${noti.unread ? "text-gray-900" : "text-gray-600"
                                }`}
                            >
                              {noti.sender}
                            </span>
                            <span className="text-indigo-600 font-bold text-xs bg-indigo-100 px-2 py-0.5 rounded">
                              [{noti.maHP}]
                            </span>
                            <span className="text-gray-500 text-xs">
                              {noti.lop}
                            </span>
                            {noti.unread && (
                              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                Mới
                              </span>
                            )}
                          </div>
                          <p
                            className={`mt-1 font-medium ${noti.unread ? "text-gray-900" : "text-gray-700"
                              } truncate`}
                          >
                            {noti.title}
                          </p>
                          <p className="text-gray-600 text-sm truncate">
                            {noti.preview}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="hidden sm:inline">{noti.time}</span>
                        <div
                          className={`w-3 h-3 rounded-full ${getLabelColor(
                            noti.label
                          )}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[1000]"
            onClick={closeDrawer}
          />

          {/* Drawer từ bên phải trượt ra */}
          <div className="fixed inset-y-0 right-0 z-[1001] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            {/* Header Drawer */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-lime-100">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Soạn thông báo mới
                </h3>
              </div>
              <button
                onClick={closeDrawer}
                className="text-gray-500 hover:text-gray-700 focus:outline-none  rounded-full hover:bg-lime-400 transition-all  duration-300 ease-in-out p-2 hover:rotate-90"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-6 space-y-6 overflow-y-auto h-full pb-32">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã học phần kỳ này
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>4212345678912</option>
                    <option>42000735839</option>
                    <option>42000735840</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình thức học
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Lý thuyết</option>
                    <option>Thực hành</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhóm thưc hành
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề thông báo
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nhập tiêu đề thông báo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung thông báo
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nhập nội dung thông báo..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhãn thông báo
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Khẩn cấp</option>
                    <option>Thông báo</option>
                    <option>Quan trọng</option>
                    <option>Quản trị</option>
                    <option>Chính thức</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Buttons - Fixed bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
              <button
                onClick={closeDrawer}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Tạo QR ngay
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
