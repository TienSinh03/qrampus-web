import { useState } from 'react';

const ModalEdit = ({ closeModal }) => {
    const [selectedMethod, setSelectedMethod] = useState('');

    const handleMethodChange = (method) => {
        setSelectedMethod(method);
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50">
            <div
                className="bg-white p-6 rounded-lg w-96 shadow-xl z-60"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <h2 className="text-xl font-semibold mb-4">Kết quả điểm danh của Sinh viên</h2>
                <p className="mb-4 text-sm text-gray-600">
                    Tùy chỉnh trạng thái ghi danh của buổi học hôm đó
                </p>

                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="thanhcong"
                            name="authentication-method"
                            className="h-4 w-4 text-indigo-600"
                            checked={selectedMethod === 'thanhcong'}
                            onChange={() => handleMethodChange('thanhcong')}
                        />
                        <label htmlFor="thanhcong" className="ml-2 text-lg text-gray-800">
                            Ghi danh cho sinh viên
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="tre"
                            name="authentication-method"
                            className="h-4 w-4 text-indigo-600"
                            checked={selectedMethod === 'tre'}
                            onChange={() => handleMethodChange('tre')}
                        />
                        <label htmlFor="tre" className="ml-2 text-lg text-gray-800">
                            Trễ, quá trình điểm danh
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="vangphep"
                            name="authentication-method"
                            className="h-4 w-4 text-indigo-600"
                            checked={selectedMethod === 'vangphep'}
                            onChange={() => handleMethodChange('vangphep')}
                        />
                        <label htmlFor="vangphep" className="ml-2 text-lg text-gray-800">
                            Vắng mặt, có lý do
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="vangkhongphep"
                            name="authentication-method"
                            className="h-4 w-4 text-indigo-600"
                            checked={selectedMethod === 'vangkhongphep'}
                            onChange={() => handleMethodChange('vangkhongphep')}
                        />
                        <label htmlFor="vangkhongphep" className="ml-2 text-lg text-gray-800">
                            Vắng mặt, không điểm danh
                        </label>
                    </div>
                </div>

                <button
                    onClick={() => alert(`Selected Method: ${selectedMethod}`)}
                    className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                >
                    Lưu thay đổi
                </button>
            </div>
        </div>
    );
};

export default ModalEdit;
