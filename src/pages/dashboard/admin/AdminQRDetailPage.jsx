import React from "react";
import { Users, Phone, Mail, Building2, IdCard, BookAudioIcon, ChevronLeft, ChevronRight } from "lucide-react";

const AdminQRDetailPage = () => {


    const lecturer = {
        code: "10000001",
        name: "Nguyễn Văn A",
        phone: "0909 123 456",
        email: "nguyenvana@iuh.edu.vn",
        department: "Khoa Công nghệ Thông tin",
        avatar_url:
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
    const patterns = [
        "leaves.png",
        "tic-tac-toe.png",
        "embossed-diamond.png",
        "floor-tile.png",
        "email-pattern.png",
        "intersection.png",
        "memphis-colorful.png"
    ];
    return (
        <div className="space-y-3 mx-auto">
            {/* Header */}
            <div className="flex items-center gap-2 text-xl font-semibold text-blue-600">
                <Users className="w-6 h-6" />
                Chi tiết giảng viên
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <img
                    src={lecturer.avatar_url}
                    alt={lecturer.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0 border"
                />

                {/* Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 border"><IdCard className="w-5 h-5" /></div>, label: "Mã nhân sự", value: lecturer.code },
                        { icon: <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-50 text-green-600 border"><Users className="w-5 h-5" /></div>, label: "Tên giảng viên", value: lecturer.name },
                        { icon: <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 border"><Phone className="w-5 h-5" /></div>, label: "Số điện thoại", value: lecturer.phone },
                        { icon: <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 border"><Mail className="w-5 h-5" /></div>, label: "Email", value: lecturer.email },
                        { icon: <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 border"><Building2 className="w-5 h-5" /></div>, label: "Khoa", value: lecturer.department }
                    ].map(({ icon, label, value }, index) => (
                        <div key={index} className={`flex items-center gap-3 ${index === 4 ? "md:col-span-2" : ""}`}>
                            {icon}
                            <div>
                                <p className="text-sm text-gray-500">{label}</p>
                                <p className="font-medium">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 text-xl font-semibold text-blue-600">
                <BookAudioIcon className="w-6 h-6" />
                Học phần kỳ này
            </div>

            {/* Course List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold">Danh sách các khóa học</h1>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 overflow-hidden"

                            //AdminDetailSessionQRPage
                            onClick={() => { window.location.href = '/dashboard/admin/qrcode/session/qrcode-detail/session-detail' }}


                        >
                            {/* Header Pattern */}
                            <div
                                className="h-36 w-full relative"
                                style={{
                                    backgroundImage: `url('https://www.toptal.com/designers/subtlepatterns/uploads/${patterns[index % patterns.length]}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0" />
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {/* Title */}
                                <p className="font-bold text-gray-900 text-lg leading-snug truncate">
                                    {course.title.length > 40
                                        ? course.title.slice(0, 40) + "..."
                                        : course.title}
                                </p>

                                {/* Divider */}
                                <div className="h-px bg-gray-300" />

                                {/* Meta Information */}
                                <div className="flex flex-col gap-2 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Mã học phần</span>
                                        <span className="font-medium text-gray-800">{course.mahocphan}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-800">Mã lớp</span>
                                        <span className="font-medium text-gray-800">{course.code}</span>
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
