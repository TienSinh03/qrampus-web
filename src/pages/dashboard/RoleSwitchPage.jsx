import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, ChevronRight } from "lucide-react";

const RoleSwitchPage = () => {
    const navigate = useNavigate();

    const images = [
        "/assets/images/illus-1.png",
        "/assets/images/illus-2.png",
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 flex items-center justify-center overflow-hidden">
            {/* Background decoration - responsive blur circles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-300 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-300 rounded-full blur-3xl opacity-20 translate-x-1/3 translate-y-1/3" />
            </div>

            {/* Main content */}
            <div className="relative z-10 w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
                {/* Title */}
                <div className="text-center mb-10 sm:mb-16">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-800 mb-4">
                        HỆ THỐNG PHÂN QUYỀN
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600">
                        Vui lòng chọn vai trò để tiếp tục
                    </p>
                </div>

                {/* Grid layout - responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Illustrations - trên mobile ở trên */}
                    <div className="order-1 flex justify-center">
                        <div className="relative w-full max-w-sm sm:max-w-md aspect-square">
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`Hình minh họa ${i + 1}`}
                                    className={`absolute inset-0 w-full h-full object-contain rounded-2xl drop-shadow-2xl transition-all duration-1000 ease-in-out ${i === index ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                        }`}
                                />
                            ))}
                            {/* Dots indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === index ? "bg-blue-600 w-8" : "bg-gray-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Role selection card */}
                    <div className="order-2">
                        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

                        <div className="bg-white/90 backdrop-blur-2xl rounded-b-xl p-8 sm:p-10 lg:p-12 border border-white/50">
                            <div className="space-y-6">
                                {/* Nút Quản trị viên */}
                                <button
                                    onClick={() => navigate("/admin")}
                                    className="group w-full flex items-center justify-between gap-4 py-6 px-6 sm:px-8 rounded-2xl
                             bg-blue-50 border-2 border-blue-200 text-blue-800
                             text-lg sm:text-xl font-semibold
                             hover:bg-blue-100 hover:border-blue-300 hover:shadow-xl
                             hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 sm:gap-5">
                                        <div className="p-3 sm:p-4 bg-blue-100 rounded-xl">
                                            <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-blue-700" />
                                        </div>
                                        <span>Quản trị viên</span>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-blue-600 group-hover:translate-x-2 transition-transform" />
                                </button>

                                {/* Nút Chấm công */}
                                <button
                                    onClick={() => navigate("/attendance")}
                                    className="group w-full flex items-center justify-between gap-4 py-6 px-6 sm:px-8 rounded-2xl
                             bg-emerald-50 border-2 border-emerald-200 text-emerald-800
                             text-lg sm:text-xl font-semibold
                             hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-xl
                             hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 sm:gap-5">
                                        <div className="p-3 sm:p-4 bg-emerald-100 rounded-xl">
                                            <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" />
                                        </div>
                                        <span>Bộ phận chấm công</span>
                                    </div>
                                    <ChevronRight className="w-6 h-6 text-emerald-600 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>

                            <p className="text-center text-xs sm:text-sm text-gray-500 mt-10">
                                © 2026 Khóa luận tốt nghiệp • Phiên bản 1.0
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleSwitchPage;