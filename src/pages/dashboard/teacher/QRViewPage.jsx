import React, { useState } from "react";
import {
    Calendar, Bell, Clock, User, SquareStar, Check,
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreVertical,

} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ReactPaginate from "react-paginate";
const steps = [
    { MSSV: "21010611", HOTEN: "Nguyễn Văn A", completed: true },
    { MSSV: "21010612", HOTEN: "Trần Thị B", completed: true },
    { MSSV: "21010613", HOTEN: "Lê Văn C", completed: true },
    { MSSV: "21010614", HOTEN: "Phạm Thị D", completed: true },
    { MSSV: "21010615", HOTEN: "Hoàng Văn E", completed: true },
    { MSSV: "21010616", HOTEN: "Đặng Thị F", completed: true },
    { MSSV: "21010617", HOTEN: "Bùi Văn G", completed: true },
    { MSSV: "21010618", HOTEN: "Vũ Thị H", completed: true },
    { MSSV: "21010619", HOTEN: "Ngô Văn I", completed: true },
    { MSSV: "21010620", HOTEN: "Dương Thị K", completed: true },
    { MSSV: "21010613", HOTEN: "Lê Văn C", completed: true },
    { MSSV: "21010614", HOTEN: "Phạm Thị D", completed: true },
    { MSSV: "21010615", HOTEN: "Hoàng Văn E", completed: true },
    { MSSV: "21010616", HOTEN: "Đặng Thị F", completed: true },
    { MSSV: "21010617", HOTEN: "Bùi Văn G", completed: true },
    { MSSV: "21010618", HOTEN: "Vũ Thị H", completed: false },
    { MSSV: "21010619", HOTEN: "Ngô Văn I", completed: false },
    { MSSV: "21010620", HOTEN: "Dương Thị K", completed: false },
];
const users = [
    {
        id: 1,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 2,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 3,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 4,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 5,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    },
    {
        id: 6,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 7,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 8,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 9,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }, {
        id: 10,
        avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
        full_name: "Galen Slixby",
        user_id: "123456",
        time_scanned: "2024-01-15 10:30 AM",
        time_submitted: "2024-01-15 10:35 AM",
        status: "Inactive",
    }
];
const ITEMS_PER_PAGE = 5;


export default function QRViewPage() {

    const [page, setPage] = useState(0);
    const [selected, setSelected] = useState([]);
    const [sort, setSort] = useState({ key: "", dir: "asc" });

    // Sắp xếp
    const sortedUsers = [...users].sort((a, b) => {
        if (!sort.key) return 0;
        if (a[sort.key] < b[sort.key]) return sort.dir === "asc" ? -1 : 1;
        if (a[sort.key] > b[sort.key]) return sort.dir === "asc" ? 1 : -1;
        return 0;
    });

    const pageCount = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
    const displayedUsers = sortedUsers.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const handleSort = (key) => {
        setSort({
            key,
            dir: sort.key === key && sort.dir === "asc" ? "desc" : "asc",
        });
    };

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        if (selected.length === displayedUsers.length) {
            setSelected([]);
        } else {
            setSelected(displayedUsers.map(u => u.id));
        }
    };

    const getStatusClass = (status) => {
        return status === "Active" ? "bg-emerald-100 text-emerald-800" :
            status === "Pending" ? "bg-amber-100 text-amber-800" :
                "bg-gray-100 text-gray-800";
    };



    return (
        <div className="">
            <div className="overflow-hidden bg-white shadow-xl rounded-b-3xl">
                <div className="h-12 w-full bg-gradient-to-r from-sky-400 via-cyan-300 to-orange-300" />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between px-8 py-6 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="-mt-20 h-32 w-32 rounded-3xl border-8 border-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center text-white text-5xl font-bold">
                            LV
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                LẬP TRÌNH THIẾT BỊ DI ĐỘNG
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-6 text-gray-600">
                                <span className="font-mono text-xl">42345677843</span>
                                <span className="flex items-center gap-2">
                                    <SquareStar className="w-6 h-6 text-indigo-600" />
                                    <span className="font-semibold">HK1 2025-2026</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                {/* Left: Meeting schedule */}

                <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-2 shadow-lg ring-1 ring-gray-200">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        Để thời gian chạy 
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-indigo-600">
                            Quét QR để điểm danh
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            12:30 PM - 1:30 PM, Thứ Hai, 20 Tháng 1, 2025
                        </p>
                    </div>
                </div>

                {/* Right: Highlighted event */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex space-x-4 justify-around">

                        {/* Cột 1 */}
                        <div className="w-1/3 max-h-96 pr-2 flex flex-col">

                            {/* Tiêu đề cố định */}
                            <h2 className="text-lg font-semibold text-white bg-yellow-600 px-4 py-3 rounded-t-lg">
                                Đã điểm danh
                            </h2>

                            {/* Vùng cuộn */}
                            <div className="overflow-y-auto flex-1">

                                <div className="relative pl-12">
                                    {/* Line progress */}
                                    <div className="absolute left-5 top-2 bottom-8 w-0.5 bg-yellow-300">
                                        <div
                                            className="w-full bg-yellow-300 transition-all duration-700 ease-out"
                                            style={{
                                                height: `${(steps.filter(s => s.completed).length - 1) / (steps.length - 1) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    {/* Danh sách items */}
                                    {steps.map((step, index) => (
                                        <div key={index} className="relative flex items-start mb-4 last:mb-0">
                                            <div className="absolute left-[-34px] top-1 flex items-center justify-center">
                                                <div
                                                    className={`w-4 h-4 rounded-full border-2 shadow-md transition-all 
                                                    ${step.completed ? 'bg-yellow-400' : 'bg-gray-300'}`}
                                                />
                                            </div>

                                            <div className={step.completed ? '' : 'opacity-50'}>
                                                <h3 className={`font-medium text-gray-900 ${!step.completed && 'text-gray-500'}`}>
                                                    {step.MSSV}
                                                </h3>
                                                <p className="mt-0.5 text-sm text-gray-600">{step.HOTEN}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>


                        {/* Cột 2 */}
                        <div className="w-1/3 max-h-96 pr-2 flex flex-col">
                            {/* Tiêu đề cố định */}
                            <h2 className="text-lg font-semibold text-white bg-sky-600 px-4 py-3 rounded-t-lg">
                                Chưa điểm danh
                            </h2>

                            {/* Vùng cuộn */}
                            <div className="overflow-y-auto flex-1">

                                <div className="relative pl-12">
                                    {/* Line progress */}
                                    <div className="absolute left-5 top-2 bottom-8 w-0.5 bg-sky-200">
                                        <div
                                            className="w-full bg-sky-600 transition-all duration-700 ease-out"
                                            style={{
                                                height: `${(steps.filter(s => s.completed).length - 1) / (steps.length - 1) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    {/* Danh sách items */}
                                    {steps.map((step, index) => (
                                        <div key={index} className="relative flex items-start mb-4 last:mb-0">
                                            <div className="absolute left-[-34px] top-1 flex items-center justify-center">
                                                <div
                                                    className={`w-4 h-4 rounded-full border-4 shadow-md transition-all 
                                                    ${step.completed ? 'bg-sky-600' : 'bg-gray-300'}`}
                                                />
                                            </div>

                                            <div className={step.completed ? '' : 'opacity-50'}>
                                                <h3 className={`font-medium text-gray-900 ${!step.completed && 'text-gray-500'}`}>
                                                    {step.MSSV}
                                                </h3>
                                                <p className="mt-0.5 text-sm text-gray-600">{step.HOTEN}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-8 mt-8">
                        {/* 1. ĐÃ ĐIỂM DANH – Màu vàng (thành công) */}
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-yellow-500 shadow glow-yellow"></div>
                            <span className="text-sm font-medium text-gray-700">
                                Sinh viên đã điểm danh thành công vào hệ thống hôm nay
                            </span>
                        </div>

                        {/* 2. ĐANG ĐIỂM DANH – Màu xanh sky (đang xử lý) */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-sky-500 shadow"></div>
                                <div className="absolute inset-0 rounded-full bg-sky-400 animate-ping"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                Sinh viên chưa điểm danh
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            

        </div>
    );
}
