import { useState } from 'react';
import { EllipsisVertical, CheckCircle2, Clock, XCircle, Ban } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

// Dữ liệu mẫu
const transactions = [
    { name: 'Nguyễn Văn A', icon: 'A', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Thành công' },
    { name: 'Trần Thị B', icon: 'B', date: 'Nov 23, 02:15 PM', price: '$1,299.00', category: 'Finance', status: 'Vượt mức' },
    { name: 'Lê Văn C', icon: 'C', date: 'Nov 23, 03:30 PM', price: '$899.50', category: 'Finance', status: 'Cho phép' },
    // Thêm nhiều hơn nếu cần...
    ...Array(20).fill(null).map((_, i) => ({
        name: `Sinh viên ${i + 4}`,
        icon: (i + 4).toString(),
        date: 'Nov 23, 04:00 PM',
        price: `$${(Math.random() * 3000).toFixed(2)}`,
        category: 'Finance',
        status: ['Thành công', 'Vượt mức', 'Cho phép'][Math.floor(Math.random() * 3)],
    })),
];

const ResultQRextendPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('authenticator');

    const rowsPerPage = 10;
    const totalPages = Math.ceil(transactions.length / rowsPerPage);
    const currentTransactions = transactions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Thành công': return 'bg-green-100 text-green-700 border border-green-200';
            case 'Vượt mức': return 'bg-red-100 text-red-700 border border-red-200';
            case 'Cho phép': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            {/* Bảng danh sách */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-800">Danh sách sinh viên</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Export
                        </button>
                        <div className="relative">
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {['Name', 'Date', 'Price', 'Category', 'Status', ''].map((h) => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentTransactions.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => navigate('/dashboard/results-qr-detail-user')}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                {t.icon}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{t.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{t.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.price}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{t.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpen(true);
                                            }}
                                            className="text-gray-400 hover:text-gray-700 transition"
                                        >
                                            <EllipsisVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 text-sm rounded-lg border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        Previous
                    </button>
                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === page ? 'bg-violet-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 text-sm rounded-lg border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* MODAL GIỐNG HỆT ẢNH MỚI NHẤT */}

            {/* === MODAL CẬP NHẬT ĐÚNG ICON + MÀU + TEXT === */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                        {/* Close button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8 pb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Cập nhật trạng thái điểm danh</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Chọn trạng thái phù hợp cho sinh viên này
                            </p>
                        </div>

                        <div className="px-8 space-y-3 pb-6">
                            {/* 1. Thành công */}
                            <label
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${selectedMethod === 'success'
                                        ? 'border-green-500 bg-green-50/60'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedMethod('success')}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    checked={selectedMethod === 'success'}
                                    onChange={() => { }}
                                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Thành công</p>
                                        <p className="text-sm text-gray-500">Điểm danh đúng giờ</p>
                                    </div>
                                </div>
                            </label>

                            {/* 2. Trễ */}
                            <label
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${selectedMethod === 'late'
                                        ? 'border-orange-500 bg-orange-50/60'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedMethod('late')}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    checked={selectedMethod === 'late'}
                                    onChange={() => { }}
                                    className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Trễ</p>
                                        <p className="text-sm text-gray-500">Đi muộn, vẫn được tính điểm danh</p>
                                    </div>
                                </div>
                            </label>

                            {/* 3. Vắng có phép */}
                            <label
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${selectedMethod === 'absent-permitted'
                                        ? 'border-blue-500 bg-blue-50/60'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedMethod('absent-permitted')}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    checked={selectedMethod === 'absent-permitted'}
                                    onChange={() => { }}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <XCircle className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Vắng có phép</p>
                                        <p className="text-sm text-gray-500">Có đơn xin nghỉ được duyệt</p>
                                    </div>
                                </div>
                            </label>

                            {/* 4. Vắng không phép */}
                            <label
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${selectedMethod === 'absent'
                                        ? 'border-red-500 bg-red-50/60'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setSelectedMethod('absent')}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    checked={selectedMethod === 'absent'}
                                    onChange={() => { }}
                                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                                />
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <Ban className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Vắng không phép</p>
                                        <p className="text-sm text-gray-500">Không điểm danh, không có lý do</p>
                                    </div>
                                </div>
                            </label>
                        </div>

                        {/* Footer */}
                        <div className="p-8 pt-4 flex justify-end">
                            <button
                                onClick={() => {
                                    // Xử lý lưu trạng thái ở đây (gửi API, cập nhật DB, v.v.)
                                    console.log("Trạng thái đã chọn:", selectedMethod);
                                    setOpen(false);
                                }}
                                className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition shadow-sm flex items-center gap-2"
                            >
                                Xác nhận
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultQRextendPage;