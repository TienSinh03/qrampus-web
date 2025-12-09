import React, { useState } from "react";
import DescriptionTab from "./tabs/DescriptionTab";
import StudentStudySession from "./tabs/StudentStudySession";
import ScheduleStudySession from "./tabs/ScheduleStudySession";
import QRCodeTab from "./tabs/QRCodeTab";
import { FileImage, FileUser, Calendar, QrCode, SquareStar } from "lucide-react";

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

    return (
        <div className="mx-auto space-y-6">
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
                                    <span>📅</span> 2025 - 2026
                                </span>
                            </div>
                        </div>
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-violet-600">
                        <span>Connected</span>
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

            {/* --- CONTENT --- */}
            <div>{renderTab()}</div>
        </div>
    );
};

export default StudySessionPage;
