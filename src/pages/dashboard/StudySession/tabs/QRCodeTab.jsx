import React from "react";

const QRCodeTab = () => {
    const qrList = [
        {
            id: 1,
            maHP: "IT001",
            tenHP: "Lập trình Web",
            thoiGianTao: "2025-01-12 08:00",
            thoiGianKT: "2025-01-12 09:30",
            maGV: "GV001",
            loailich: "LT",
            nhomTH: "",
            tenGV: "Nguyễn Văn A",
        },
        {
            id: 2,
            maHP: "IT002",
            tenHP: "Cơ sở dữ liệu",
            thoiGianTao: "2025-01-14 10:00",
            thoiGianKT: "2025-01-14 11:30",
            maGV: "GV002",
            loailich: "LT",
            nhomTH: "",
            tenGV: "Trần Thị B",
        },
        {
            id: 3,
            maHP: "IT003",
            tenHP: "Cấu trúc dữ liệu",
            thoiGianTao: "2025-01-15 13:30",
            thoiGianKT: "2025-01-15 15:00",
            maGV: "GV003",
            loailich: "TH",
            nhomTH: "1",
            tenGV: "Phạm Văn C",
        },
    ];

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">QR Điểm danh</h2>
            <p className="mt-2 mb-6 text-gray-600">Danh sách QR đã tạo cho học phần.</p>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-3 px-4 border-b text-left">STT</th>
                            <th className="py-3 px-4 border-b text-left">Mã học phần</th>
                            <th className="py-3 px-4 border-b text-left">Tên học phần</th>
                            <th className="py-3 px-4 border-b text-left">Thời gian tạo QR</th>
                            <th className="py-3 px-4 border-b text-left">Kết thúc QR</th>
                            <th className="py-3 px-4 border-b text-left">Mã GV</th>
                            <th className="py-3 px-4 border-b text-left">Loại lịch</th>
                            <th className="py-3 px-4 border-b text-left">Nhóm TH</th>
                            <th className="py-3 px-4 border-b text-left">Tên giảng viên</th>
                        </tr>
                    </thead>

                    <tbody>
                        {qrList.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{index + 1}</td>
                                <td className="py-3 px-4 border-b">{item.maHP}</td>
                                <td className="py-3 px-4 border-b">{item.tenHP}</td>
                                <td className="py-3 px-4 border-b">{item.thoiGianTao}</td>
                                <td className="py-3 px-4 border-b">{item.thoiGianKT}</td>
                                <td className="py-3 px-4 border-b">{item.loailich}</td>
                                <td className="py-3 px-4 border-b">{item.nhomTH || ""}</td>
                                <td className="py-3 px-4 border-b">{item.maGV}</td>
                                <td className="py-3 px-4 border-b">{item.tenGV}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QRCodeTab;
