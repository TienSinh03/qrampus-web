import React from "react";
import {
    Users,
    Phone,
    Mail,
    Building2,
    IdCard,
    BookAudio,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// Dữ liệu mẫu
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
        image: "https://via.placeholder.com/200/FFCC00/FFFFFF?text=Pretest",
    },
    {
        title: "Đảm bảo chất lượng và Kiểm thử phần mềm",
        mahocphan: "420300143203",
        code: "CNTT_HK1_24_25",
        image: "https://via.placeholder.com/200/FF99CC/FFFFFF?text=Chất+lượng",
    },
    {
        title: "Nhập môn dữ liệu lớn",
        mahocphan: "420300143204",
        code: "CNTT_HK1_25_26",
        image: "https://via.placeholder.com/200/CCCCCC/FFFFFF?text=Nhập+môn",
    },
    {
        title: "Automat & ngôn ngữ hình thức",
        mahocphan: "420300143205",
        code: "CNTT_HK1_24_25",
        image: "https://via.placeholder.com/200/6666FF/FFFFFF?text=Automat",
    },
    {
        title: "Phát triển ứng dụng",
        mahocphan: "420300143206",
        code: "CNTT_HK1_23_24",
        image: "https://via.placeholder.com/200/9900FF/FFFFFF?text=Ứng+dụng",
    },
];

const backgroundPatterns = [
    "leaves.png",
    "tic-tac-toe.png",
    "embossed-diamond.png",
    "floor-tile.png",
    "email-pattern.png",
    "intersection.png",
    "memphis-colorful.png",
];

const AdminQRDetailPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header gradient line */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full" />

            {/* Lecturer Info Card */}
            <div className="bg-white shadow-lg p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-7 h-7 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">Chi tiết giảng viên</h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex justify-center md:justify-start">
                        <img
                            src={lecturer.avatarUrl}
                            alt={lecturer.name}
                            className="w-36 h-36 rounded-full object-cover border-4 border-blue-100 shadow-md"
                        />
                    </div>

                    {/* Lecturer Information */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { icon: IdCard, label: "Mã nhân sự", value: lecturer.code, color: "blue" },
                            { icon: Users, label: "Tên giảng viên", value: lecturer.name, color: "green" },
                            { icon: Phone, label: "Số điện thoại", value: lecturer.phone, color: "yellow" },
                            { icon: Mail, label: "Email", value: lecturer.email, color: "purple" },
                            {
                                icon: Building2,
                                label: "Khoa",
                                value: lecturer.department,
                                color: "gray",
                                colSpan: true,
                            },
                        ].map(({ icon: Icon, label, value, color, colSpan }, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-4 ${colSpan ? "md:col-span-2" : ""}`}
                            >
                                <div
                                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-${color}-50 text-${color}-600 border border-${color}-200 shadow-sm`}
                                >
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

            {/* Courses Section */}
            <div className="bg-white rounded-b-xl shadow-lg p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <BookAudio className="w-7 h-7 text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-800">Học phần kỳ này</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                window.location.href = "/dashboard/admin/qrcode/session/qrcode-detail/session-detail";
                            }}
                            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden border border-gray-100"
                        >
                            {/* Pattern Header */}
                            <div
                                className="h-40 w-full relative"
                                style={{
                                    backgroundImage: `url('https://www.toptal.com/designers/subtlepatterns/uploads/${backgroundPatterns[index % backgroundPatterns.length]
                                        }')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 group-hover:to-black/50 transition-all duration-300" />
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[3.5rem] mb-4 group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                </h3>

                                <div className="h-px bg-gray-200 mb-4" />

                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Mã học phần:</span>
                                        <span className="font-semibold text-gray-800">{course.mahocphan}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-600">Mã lớp:</span>
                                        <span className="font-semibold text-gray-800">{course.code}</span>
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