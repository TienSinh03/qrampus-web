import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ResultQRextendStudentPage = () => {
    const examEvent = {
        mahocphan: "420300362101",
        title: "Lập trình WWW (Java)",
        tiet: "13-16",
        giaovien: [
            { magiangvien: "10000001", name: "Đặng Thị Thu Hà" },
            { magiangvien: "10000002", name: "Hà Thị Kim Thoa" }
        ],
        ngaytao: "2023-12-18",
    };

    const [qrSize, setQrSize] = useState(580);
    const [timeLeft, setTimeLeft] = useState(300); // 5 phút

    // Đếm ngược
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSliderChange = (e) => {
        setQrSize(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            <div className="mx-auto">
                {/* Main Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-8">
                        <h1 className="text-xl font-bold text-center">   {examEvent.title} • Tiết {examEvent.tiet}</h1>

                    </div>

                    <div className="p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                            {/* QR Code + Countdown bên trái (chiếm 2/3) */}
                            <div className="lg:col-span-2 flex flex-col items-center">
                                {/* QR Code */}
                                <div className="bg-white rounded-2xl shadow-xl border-4 border-indigo-100">
                                    <QRCodeSVG
                                        value="https://your-link-or-data-here.com"
                                        size={qrSize}
                                        level="H"
                                        includeMargin={true}
                                        fgColor="#1e293b" // màu đen đậm đẹp hơn
                                        bgColor="#ffffff"
                                    />

                                    {/* Nút mở modal image AI */}
                                    <div className="">
                                        {/** option chọn thời gian 2,3 ,5 phút */}
                                        <select className="bg-white text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="120">2 phút</option>
                                            <option value="180">3 phút</option>
                                            <option value="300" selected>5 phút</option>
                                        </select>
                                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                            Khi nhấn vào chọn thời gian và nút điểm danh sẽ tạo phiên điểm danh hiển thị QR code
                                            Nếu tạo trên mobile thì chỉ cần hiển thị qr code và đồng hồ đếm ngược
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin lớp học bên phải */}
                            <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-indigo-100">
                                <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
                                    Thông tin lớp học
                                </h2>

                                <div className="space-y-5 text-gray-700">
                                    <div>
                                        <span className="font-semibold text-indigo-700">Mã học phần:</span>
                                        <p className="text-lg font-medium">{examEvent.mahocphan}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-indigo-700">Tên học phần:</span>
                                        <p className="text-lg font-medium">{examEvent.title}</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-indigo-700">Ngày tạo:</span>
                                        <p className="text-lg font-medium">{examEvent.ngaytao}</p>
                                    </div>

                                    <div>
                                        <span className="font-semibold text-indigo-700 block mb-2">Giảng viên:</span>
                                        {examEvent.giaovien.map((gv, index) => (
                                            <div key={index} className="bg-white/70 rounded-lg p-3 mb-2 shadow">
                                                <p className="font-medium">{gv.name}</p>
                                                <p className="text-sm text-gray-600">MGV: {gv.magiangvien}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Slider điều chỉnh kích thước QR */}
                                    <div className="mt-10 w-full max-w-md">
                                        <label className="block text-center text-gray-700 font-medium mb-3">
                                            Điều chỉnh kích thước QR
                                        </label>
                                        <input
                                            type="range"
                                            min="400"
                                            max="800"
                                            step="20"
                                            value={qrSize}
                                            onChange={handleSliderChange}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <p className="text-center text-gray-600 mt-2 font-medium">{qrSize}px</p>
                                    </div>
                                    {/* Đồng hồ đếm ngược ngay dưới QR, nổi bật */}
                                    <div className="mt-8 flex flex-col items-center">
                                        <p className="text-gray-600 font-medium mb-3 text-lg">Thời gian còn lại để quét</p>
                                        <div
                                            className={`text-6xl font-bold tracking-wider ${timeLeft <= 60 ? 'text-red-600' : timeLeft <= 120 ? 'text-orange-500' : 'text-emerald-600'
                                                } drop-shadow-lg`}
                                        >
                                            {formatTime(timeLeft)}
                                        </div>
                                        {timeLeft <= 60 && (
                                            <p className="mt-4 text-red-600 font-semibold animate-pulse text-xl">
                                                Sắp hết thời gian!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultQRextendStudentPage;