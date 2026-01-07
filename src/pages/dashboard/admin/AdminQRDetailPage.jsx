import React from "react";
import {
    Users,
    Phone,
    Mail,
    Building2,
    IdCard,
    BookAudio,
} from "lucide-react";

// ================= MOCK DATA =================
const lecturer = {
    code: "10000001",
    name: "Nguyễn Văn A",
    phone: "0909 123 456",
    email: "nguyenvana@iuh.edu.vn",
    department: "Khoa Công nghệ Thông tin",
    avatarUrl:
        "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
};

const courses = [
    {
        title: "Pretest Kỹ thuật phần mềm HK2/2025",
        mahocphan: "420300143202",
        code: "CNTT_HK2_24_25",
    },
    {
        title: "Đảm bảo chất lượng và Kiểm thử phần mềm",
        mahocphan: "420300143203",
        code: "CNTT_HK1_24_25",
    },
    {
        title: "Nhập môn dữ liệu lớn",
        mahocphan: "420300143204",
        code: "CNTT_HK1_25_26",
    },
    {
        title: "Automat & ngôn ngữ hình thức",
        mahocphan: "420300143205",
        code: "CNTT_HK1_24_25",
    },
    {
        title: "Phát triển ứng dụng",
        mahocphan: "420300143206",
        code: "CNTT_HK1_23_24",
    },
];

const AdminQRDetailPage = () => {
    const gradients = [
        "from-blue-500 to-indigo-500",
        "from-emerald-500 to-teal-500",
        "from-violet-500 to-purple-500",
        "from-orange-500 to-amber-500",
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />

            {/* ================= GIẢNG VIÊN ================= */}
            <div className="bg-white shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-7 h-7 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                        Chi tiết giảng viên
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex justify-center md:justify-start">
                        <img
                            src={lecturer.avatarUrl}
                            alt={lecturer.name}
                            className="w-36 h-36 rounded-full border-4 border-blue-100 shadow-md object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: IdCard, label: "Mã nhân sự", value: lecturer.code },
                            { icon: Users, label: "Tên giảng viên", value: lecturer.name },
                            { icon: Phone, label: "Số điện thoại", value: lecturer.phone },
                            { icon: Mail, label: "Email", value: lecturer.email },
                            {
                                icon: Building2,
                                label: "Khoa",
                                value: lecturer.department,
                                colSpan: true,
                            },
                        ].map(({ icon: Icon, label, value, colSpan }, i) => (
                            <div
                                key={i}
                                className={`flex items-center gap-4 ${colSpan ? "md:col-span-2" : ""
                                    }`}
                            >
                                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                                    <p className="text-lg font-semibold text-gray-900">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= HỌC PHẦN ================= */}
            <div className="bg-white rounded-b-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <BookAudio className="w-7 h-7 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">
                        Học phần kỳ này
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <div
                            key={index}
                            onClick={() =>
                            (window.location.href =
                                "/dashboard/admin/qrcode/session/qrcode-detail/session-detail")
                            }
                            className="group cursor-pointer bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            {/* Header gradient */}

                            <div className={`h-0.5 bg-gradient-to-r ${gradients[index % gradients.length]}`} />

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-gray-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Mã học phần</span>
                                        <span className="font-semibold text-gray-800">
                                            {course.mahocphan}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Mã lớp</span>
                                        <span className="font-semibold text-gray-800">
                                            {course.code}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminQRDetailPage;
