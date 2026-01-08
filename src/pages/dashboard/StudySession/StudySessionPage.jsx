import React, { useState } from "react";
import DescriptionTab from "./tabs/DescriptionTab";
import StudentStudySession from "./tabs/StudentStudySession";
import ScheduleStudySession from "./tabs/ScheduleStudySession";
import QRCodeTab from "./tabs/QRCodeTab";
import { FileImage, FileUser, Calendar, QrCode, SquareStar, ScanQrCode, X, Camera } from "lucide-react";

const StudySessionPage = () => {
    const [currentTab, setCurrentTab] = useState("description");

    const renderTab = () => {
        switch (currentTab) {
            case "description":
                return <DescriptionTab />;
            case "student":
                return <StudentStudySession />;
            case "schedule":
                return <ScheduleStudySession />;
            case "qr":
                return <QRCodeTab />;
            default:
                return <DescriptionTab />;
        }
    };


  //model tạo qR
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);


    return (
      <div className="mx-auto">
            {/* HEADER - bạn giữ nguyên code UI ở trên của bạn */}
            <div className="overflow-hidden bg-white shadow-sm">
                {/* Cover */}
                <div className="h-10 w-full bg-[linear-gradient(120deg,#7dd3fc_0%,#67e8f9_25%,#a5f3fc_25%,#a5f3fc_50%,#fed7aa_50%,#fed7aa_75%,#fecaca_75%,#fecaca_100%)]" />

                {/* Info row */}
                <div className="flex flex-col items-start gap-4 px-6 pb-4 pt-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar card */}
                        <div className="-mt-16 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-indigo-100 shadow-sm">
                            {/* Thay bằng <img src="..." /> nếu có hình thật */}
                            <div className="flex h-full w-full items-center justify-center text-5xl">
                                🙂
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                LẬP TRÌNH THIẾT BỊ DI DỘNG
                            </h2>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <h2>42345677843</h2>
                                <span className="flex items-center gap-1">
                                    <SquareStar className="w-5 h-5 " />
                                    HK1
                                </span>
                                <span className="flex items-center gap-1">
                    <span>
                      <Calendar className="w-5 h-5 " />
                    </span> 2025 - 2026
                                </span>
                            </div>
                        </div>
                    </div>
            <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50  focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 w-full md:w-auto"
              title="Tạo điểm danh, sẽ được truy cập vào tab điểm danh" onClick={openDrawer}>
              <ScanQrCode className="w-5 h-5" />
              <span>Tạo điểm danh</span>
            </button>
          </div>

                {/* Tabs */}
                <div className="px-6 py-3 border-t border-slate-100 md:hidden">
                    <select
                        value={currentTab}
                        onChange={(e) => setCurrentTab(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="description"> Mô tả</option>
                        <option value="student">Sinh viên</option>
                        <option value="schedule">Lịch học</option>
                        <option value="qr">Lịch sử điểm danh</option>
                    </select>
                </div>
                <div className="hidden md:flex border-t border-slate-100 px-6">
                    <button
                        onClick={() => setCurrentTab("description")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "description"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <FileImage className="w-4 h-4" /> Mô tả
                    </button>

                    <button
                        onClick={() => setCurrentTab("student")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "student"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <FileUser className="w-4 h-4" /> Sinh viên
                    </button>

                    <button
                        onClick={() => setCurrentTab("schedule")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "schedule"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <Calendar className="w-4 h-4" /> Lịch học
                    </button>

                    <button
                        onClick={() => setCurrentTab("qr")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "qr"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <QrCode className="w-4 h-4" /> Lịch sử điểm danh
                    </button>
                </div>
            </div>
        {isDrawerOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-[1000]"
              onClick={closeDrawer}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col">
              {/* ================= HEADER ================= */}
              <div className="flex items-center justify-between px-6 py-5 border-b bg-blue-300">
                <h3 className="text-xl font-semibold text-gray-800">
                  Tạo điểm danh mới
                </h3>

                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-lime-300 transition-all duration-300 hover:rotate-90"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ================= BODY (SCROLL) ================= */}
              <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-6">

                {/* Thời gian điểm danh */}
                <div className="bg-white rounded-xl border p-4 space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Thời gian điểm danh
                  </label>
                  <select
                    className="w-full rounded-lg border px-4 py-2 text-sm
                 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>2 phút</option>
                    <option>4 phút</option>
                    <option>5 phút</option>
                  </select>
                </div>

                {/* Cách thức điểm danh */}
                <div className="bg-white rounded-xl border p-4 space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Cách thức điểm danh <span className="text-red-500">*</span>
                  </label>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-purple-600
                     focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Thời gian quét QR
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-purple-600
                     focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Hình ảnh minh chứng toàn lớp
                      </span>
                    </label>
                  </div>
                </div>

                {/* Thu thập thông tin */}
                <div className="bg-white rounded-xl border p-4 space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    Thu thập thông tin
                  </label>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-purple-600
                     focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Thu thập ID thiết bị
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-purple-600
                     focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">
                        Thu thập vị trí người dùng
                      </span>
                    </label>
                  </div>
                </div>

              </div>


              {/* ================= FOOTER ================= */}
              <div className=" sticky bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
                <button
                  onClick={closeDrawer}
                  className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>

                <button
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                >
                  Tạo điểm danh
                </button>
              </div>
            </div>
          </>
        )}

            {/* --- CONTENT --- */}
            <div>{renderTab()}</div>


        </div>
    );
};

export default StudySessionPage;
