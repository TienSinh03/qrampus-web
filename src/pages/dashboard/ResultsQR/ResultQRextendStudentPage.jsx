import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Layers, Play, Square, Timer, UserCheck, Maximize2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const FinalAttendancePage = () => {
    const classInfo = {
        maHocPhan: "420300362101",
        tenMonHoc: "Lập trình WWW (Java)",
        tietHoc: "13-16",
        giangVien: "Đặng Thị Thu Hà",
        siSo: 85,
        hinhThuc: "Thực hành",
        nhom: "Nhóm 02",
        phongHoc: "H7.1.2"
    };

    const [isStarted, setIsStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [duration, setDuration] = useState(300);
    const [sessionId, setSessionId] = useState(null);

    // 👉 responsive screen
    const [screen, setScreen] = useState({
        w: window.innerWidth,
        h: window.innerHeight
    });

    useEffect(() => {
        const resize = () => {
            setScreen({
                w: window.innerWidth,
                h: window.innerHeight
            });
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    const progress = isStarted ? (timeLeft / duration) * 100 : 0;

    useEffect(() => {
        let timer;
        if (isStarted && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0 && isStarted) {
            setIsStarted(false);
        }
        return () => clearInterval(timer);
    }, [isStarted, timeLeft]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleStart = () => {
        const id = `${classInfo.maHocPhan}-${Date.now()}`;
        setSessionId(id);
        setTimeLeft(duration);
        setIsStarted(true);
    };

    // 👉 QR size chuẩn responsive
    const qrSize = Math.min(
        screen.w * 0.85,
        screen.h * 0.6,
        600
    );

    return (
        <div className="text-slate-700 min-h-screen">

            {!isStarted ? (
                /* ================= SETUP ================= */
                <div className="mx-auto space-y-8">

                    {/* CLASS INFO */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b bg-slate-50">
                            <h1 className="text-2xl font-semibold">
                                {classInfo.tenMonHoc}
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">
                                {classInfo.maHocPhan} • Tiết {classInfo.tietHoc}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x">
                            {[
                                { icon: Users, label: "Sĩ số", value: `${classInfo.siSo} SV` },
                                { icon: BookOpen, label: "Hình thức", value: classInfo.hinhThuc },
                                { icon: Layers, label: "Nhóm", value: classInfo.nhom },
                                { icon: UserCheck, label: "Giảng viên", value: classInfo.giangVien },
                            ].map((item, i) => (
                                <div key={i} className="p-5">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                        <item.icon size={14} />
                                        {item.label}
                                    </div>
                                    <p className="font-medium truncate">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONTROL */}
                    <div className="max-w-md mx-auto text-center space-y-8 py-10">

                        <div>
                            <h2 className="text-lg font-semibold mb-4">
                                Thời gian điểm danh
                            </h2>

                            <div className="grid grid-cols-3 gap-3">
                                {[120, 180, 300].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setDuration(t)}
                                        className={`
                                            py-3 rounded-xl border transition
                                            ${duration === t
                                                ? 'bg-emerald-500 text-white border-emerald-500'
                                                : 'bg-white hover:bg-slate-50'}
                                        `}
                                    >
                                        {t / 60} phút
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full py-4 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                        >
                            <Play size={18} />
                            Bắt đầu điểm danh
                        </button>

                    </div>
                </div>
            ) : (
                /* ================= RUNNING ================= */
                <div className="fixed inset-0 bg-white z-50 flex flex-col">

                    {/* TOP BAR */}
                    <div className="flex justify-between items-center px-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <Maximize2 size={18} className="text-emerald-500" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium line-clamp-1">{classInfo.tenMonHoc}</p>
                                <p className="text-slate-400 text-xs">{classInfo.nhom}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-slate-400">Thời gian</p>
                            <div className={`text-2xl font-semibold ${timeLeft < 60 ? 'text-red-500' : ''}`}>
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className="flex-1 flex flex-col items-center justify-center px-4">

                        {/* QR */}
                        <div className="bg-white p-4 rounded-2xl border shadow-sm">
                            <QRCodeSVG
                                value={sessionId}
                                size={qrSize}
                                level="H"
                            />
                        </div>

                        {/* TEXT */}
                        <p className="text-sm text-slate-400 mt-4 text-center">
                            Quét mã để điểm danh
                        </p>

                        {/* PROGRESS */}
                        <div className="w-full max-w-md mt-4">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${
                                        timeLeft < 60 ? 'bg-red-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* STOP */}
                    <div className="pb-6 pt-2 flex justify-center">
                        <button
                            onClick={() => setIsStarted(false)}
                            className="text-sm text-slate-400 hover:text-red-500 flex items-center gap-2"
                        >
                            <Square size={14} />
                            Dừng phiên
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default FinalAttendancePage;