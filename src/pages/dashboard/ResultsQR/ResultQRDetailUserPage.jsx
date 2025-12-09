import React from 'react';
import { SquareStar } from 'lucide-react';

const ResultQRDetailUserPage = () => {
    // Dữ liệu mẫu trực tiếp, không dùng useState
    const project1 = { name: 'BGc eCommerce App', totalTask: '122/240', progress: 78, hours: '18:42', icon: '📦' };
    const project2 = { name: 'Falcon Logo Design', totalTask: '9/56', progress: 18, hours: '20:42', icon: '🎨' };
    const project3 = { name: 'Dashboard Design', totalTask: '290/320', progress: 62, hours: '120:87', icon: '📊' };
    const project4 = { name: 'Foodista Mobile App', totalTask: '7/63', progress: 8, hours: '89:19', icon: '📱' };
    const project5 = { name: 'Dojo React Project', totalTask: '120/186', progress: 49, hours: '230:10', icon: '💻' };
    const project6 = { name: 'Blockchain Website', totalTask: '99/109', progress: 92, hours: '342:41', icon: '🌐' };
    const project7 = { name: 'Hoffman Website', totalTask: '98/110', progress: 88, hours: '12:45', icon: '🌍' };

    return (
        <div className="space-y-6">
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
                        <span>Connected</span>
                    </button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-2 gap-6">
                {/* Left Section: User Info */}
                <div className="lg:w-1/3 bg-white rounded-xl shadow p-6 flex flex-col items-center">
                    <img src="https://i.pravatar.cc/150?img=7" alt="User Avatar" className="w-24 h-24  border-4 border-blue-500" />
                    <h2 className="text-xl font-semibold text-gray-800 mt-3">Trần Minh Tiến</h2>
                    <span className="text-sm text-gray-500">Sinh viên</span>

                    <div className="mt-4 space-y-2 text-gray-600 text-sm w-full">
                        <p><strong>Họ tên:</strong> Trần Minh Tiến</p>
                        <p><strong>Billing Email:</strong> shallamb@gmail.com</p>
                        <p><strong>MSSV:</strong> 21010611</p>
                        <p><strong>Role:</strong> Subscriber</p>
                        <p><strong>Tax ID:</strong> Tax-8894</p>
                        <p><strong>Contact:</strong> +1 (234) 464-0600</p>
                        <p><strong>Language:</strong> English</p>
                        <p><strong>Country:</strong> France</p>
                    </div>
                </div>

                {/* Right Section: Project List */}
                <div className="lg:w-2/3 bg-white rounded-xl shadow p-6 overflow-x-auto">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">Quá trình điểm danh</h3>
                    <table className="min-w-[700px] text-sm text-left text-gray-700">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3">Project</th>
                                <th className="px-4 py-3">Total Task</th>
                                <th className="px-4 py-3">Progress</th>
                                <th className="px-4 py-3">Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[project1, project2, project3, project4, project5, project6, project7].map((project, i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <span>{project.icon}</span>
                                        <span className="font-medium text-gray-900">{project.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{project.totalTask}</td>
                                    <td className="px-4 py-3">
                                        <div className="w-32 h-2 bg-gray-300 rounded-full">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${project.progress}%`,
                                                    backgroundColor: project.progress >= 80 ? 'green' : project.progress >= 50 ? 'orange' : 'red'
                                                }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{project.hours}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResultQRDetailUserPage;
