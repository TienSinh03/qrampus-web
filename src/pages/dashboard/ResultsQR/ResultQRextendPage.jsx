import { EllipsisIcon, Search } from 'lucide-react';
import React, { useState } from 'react';

const icons = {
    PYPL: 'PayPal',
    AAPL: 'Apple',
    KKST: 'Kakao',
    FB: 'Facebook',
    AMZN: 'Amazon',
    TSLA: 'Tesla',
    MSFT: 'Microsoft',
};

const transactions = [
    { name: 'Bought PYPL', icon: 'PYPL', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Thành công' },
    { name: 'Bought AAPL', icon: 'AAPL', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Vượt mức' },
    { name: 'Sell KKST', icon: 'KKST', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Cho phép' },
    { name: 'Bought FB', icon: 'FB', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Thành công' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Vượt mức' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Thành công' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Không' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Vượt mức' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Không' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Thành công' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Cho phép' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Cho phép' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Thành công' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Cho phép' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Thành công' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Cho phép' },
    { name: 'Sell AMZN', icon: 'AMZN', date: 'Nov 23, 01:00 PM', price: '$2,567.88', category: 'Finance', status: 'Cho phép' },
    // Có thể thêm ít hơn 5 dòng để test
];

const ResultQRextendPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(transactions.length / rowsPerPage);

    const currentTransactions = transactions.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Thành công': return 'bg-violet-400 text-white border border-green-200';
            case 'Cho phép': return 'bg-yellow-400 text-yellow-700 border border-yellow-200';
            case 'Vượt mức': return 'bg-red-100 text-red-700 border border-red-200';
            case 'Không': return 'bg-gray-100 text-red-700 border border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };


    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap md:flex-nowrap">
                    {/* Tiêu đề */}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 md:mb-0">Danh sách sinh viên</h2>

                    <div className="flex items-center gap-4">
                        {/* Nút Export */}
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
                            Export
                        </button>

                        {/* Dropdown List Trạng Thái */}
                        <div className="relative">
                            <select
                                value={status}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="All">All</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Tìm kiếm */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64 md:w-96"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Container - QUAN TRỌNG: cố định chiều cao */}
                <div className="min-h-[380px]"> {/* ~5 dòng x 70px + padding */}
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                {['Name', 'Date', 'Price', 'Category', 'Status'].map((h) => (
                                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentTransactions.map((t, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                                {icons[t.icon] || 'Logo'}
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
                                    <td className="px-6 py-4 text-right text-gray-400 hover:text-gray-600 cursor-pointer">
                                        <EllipsisIcon className="w-5 h-5" onClick={() => handleShowNotification(t.status)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Nếu không đủ 5 dòng → thêm hàng trống để giữ chiều cao */}
                    {currentTransactions.length < rowsPerPage && (
                        <div className="text-transparent select-none">
                            {Array(rowsPerPage - currentTransactions.length).fill(null).map((_, i) => (
                                <div key={i} className="h-16 border-b border-gray-200"></div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination - luôn cố định ở dưới */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border ${currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultQRextendPage;