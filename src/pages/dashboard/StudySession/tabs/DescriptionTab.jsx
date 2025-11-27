import React from "react";
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
    BookA,
    FileImage,
    FileUser,
    QrCode,
} from "lucide-react";
const DescriptionTab = () => {
    const activities = [
        {
            dotColor: "bg-violet-500",
            title: "12 Invoices have been paid",
            desc: "Invoices have been paid to the company.",
            badge: "invoice.pdf",
            time: "12 min ago",
        },
        {
            dotColor: "bg-emerald-500",
            title: "Client Meeting",
            desc: "Project meeting with John @10:15am",
            sub: "Lester McCarthy (Client), CEO of ThemeSelection",
            time: "45 min ago",
        },
        {
            dotColor: "bg-sky-500",
            title: "Create a new project for client",
            desc: "6 team members in a project",
            time: "2 Day Ago",
        },
    ];
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Left column - About */}
            <div className="space-y-6 md:col-span-1">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-slate-800">
                        Giảng viên giảng dạy
                    </h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-green-600"><SquareUser /></span>
                            <div>
                                <p className="text-xs font-semibold text-gray-900">
                                    Nguyễn Văn A
                                </p>
                                <p className="text-gray-700">0122222</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-green-600"><SquareUser /></span>
                            <div>
                                <p className="text-xs font-semibold text-gray-900">
                                    Nguyễn Văn Hoài Thanh
                                </p>
                                <p className="text-gray-700">0123456</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5"><SquareCheck /></span>
                            <div>
                                <p className="text-xs font-semibold  text-gray-900">
                                    Trạng thái khóa học
                                </p>
                                <p className="text-emerald-500">Active</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-yellow-500"><BookA /></span>
                            <div>
                                <p className="text-xs font-semibold  text-gray-900">
                                    Mô tả
                                </p>
                                <p className="text-gray-700 text-justify">Nhập môn lập trình thiết bị di động trang bị cho người học kiến thức nền tảng về app mobile.</p>
                            </div>
                        </div>

                        <div className="flex items-start justify-between gap-8">
                            {/* Bắt đầu học */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-blue-500">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-semibold text-gray-900">
                                        Bắt đầu học từ
                                    </span>
                                </div>
                                <p className="mt-1 text-gray-700 font-medium">19/8/2025</p>
                            </div>

                            {/* Kết thúc vào */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-blue-500">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-semibold text-gray-900">
                                        Kết thúc vào
                                    </span>
                                </div>
                                <p className="mt-1 text-gray-700 font-medium">19/12/2025</p>
                            </div>
                        </div>



                    </div>

                    <hr className="my-5 border-slate-100" />

                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Contacts
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5">📞</span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-400">
                                    Contact
                                </p>
                                <p>(123) 456-7890</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5">💬</span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-400">
                                    Skype
                                </p>
                                <p>John.doe</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5">✉️</span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-400">
                                    Email
                                </p>
                                <p>john.doe@example.com</p>
                            </div>
                        </div>
                    </div>

                    <hr className="my-5 border-slate-100" />

                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Teams
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Backend Developer</span>
                            <span className="text-slate-400">126 Members</span>
                        </div>
                        <div className="flex justify-between">
                            <span>React Developer</span>
                            <span className="text-slate-400">98 Members</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle column - Activity Timeline */}
            <div className="space-y-6 md:col-span-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Activity Timeline
                        </h2>
                        <span className="text-xs text-slate-400">Last updates</span>
                    </div>

                    <div className="space-y-6">
                        {activities.map((a) => (
                            <div key={a.title} className="flex gap-4">
                                {/* timeline dot & line */}
                                <div className="flex flex-col items-center">
                                    <span
                                        className={`h-3 w-3 rounded-full ${a.dotColor}`}
                                    />
                                    <span className="mt-1 h-full w-px bg-slate-200" />
                                </div>

                                {/* content */}
                                <div className="flex flex-1 items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {a.title}
                                        </p>
                                        <p className="text-xs text-slate-500">{a.desc}</p>

                                        {a.badge && (
                                            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-600">
                                                <span>📄</span>
                                                <span className="font-medium">{a.badge}</span>
                                            </div>
                                        )}

                                        {a.sub && (
                                            <p className="mt-2 text-xs text-slate-400">
                                                {a.sub}
                                            </p>
                                        )}
                                    </div>

                                    <span className="text-xs text-slate-400">
                                        {a.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom cards: Connections & Teams */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Connections
                            </h2>
                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
                                ⋮
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100">
                                        🙂
                                    </span>
                                    <div>
                                        <p className="font-medium">Cecilia Payne</p>
                                        <p className="text-xs text-slate-400">
                                            UI Designer
                                        </p>
                                    </div>
                                </div>
                                <button className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                    View
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
                                        😀
                                    </span>
                                    <div>
                                        <p className="font-medium">Mark Green</p>
                                        <p className="text-xs text-slate-400">
                                            Product Owner
                                        </p>
                                    </div>
                                </div>
                                <button className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                    View
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Teams
                            </h2>
                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
                                ⋮
                            </button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                        💻
                                    </span>
                                    <div>
                                        <p className="font-medium">React Developers</p>
                                        <p className="text-xs text-slate-400">
                                            98 Members
                                        </p>
                                    </div>
                                </div>
                                <button className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                    View
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                        🧩
                                    </span>
                                    <div>
                                        <p className="font-medium">Backend Developers</p>
                                        <p className="text-xs text-slate-400">
                                            126 Members
                                        </p>
                                    </div>
                                </div>
                                <button className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DescriptionTab;
