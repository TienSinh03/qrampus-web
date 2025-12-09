import React from "react";
import { Calendar, Bell, Clock, User, SquareStar } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function QRViewPage() {


    return (
        <div className="min-h-screen">
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
                        <span>View Học phần</span>
                    </button>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 mt-6">
                {/* Left: Meeting schedule */}

                <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-8 shadow-lg ring-1 ring-gray-200">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <QRCodeSVG
                            value="https://your-link-or-data-here.com"
                            size={320}
                            level="H"
                            includeMargin={true}
                            className="w-full md:w-96 bg-gray-50"
                        />
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

                </div>

            </div>

        </div>
    );
}
