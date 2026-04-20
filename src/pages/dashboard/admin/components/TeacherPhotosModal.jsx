import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const TeacherPhotosModal = ({ isOpen, onClose, photos = [] }) => {
    const [selectedImage, setSelectedImage] = useState(photos[0] || null);

    useEffect(() => {
        if (isOpen) {
            setSelectedImage(photos[0] || null);
        }
    }, [isOpen, photos]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 !space-y-0">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Ảnh lớp học giảng viên đã chụp ({photos.length} ảnh)
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-lime-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-full lg:w-80 bg-gray-50 p-4 overflow-y-auto border-r">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                            {photos.map((photo) => (
                                <div
                                    key={photo.id}
                                    onClick={() => setSelectedImage(photo)}
                                    className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                                        selectedImage?.id === photo.id ? "border-green-500 shadow-lg" : "border-transparent"
                                    }`}
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.caption}
                                        className="w-full h-40 object-cover hover:opacity-90 transition"
                                    />
                                    <p className="text-center text-sm mt-2 text-gray-700 font-medium">{photo.caption}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
                        {selectedImage ? (
                            <div className="text-center">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.caption}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                />
                                <p className="mt-6 text-lg font-medium text-gray-800">{selectedImage.caption}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-xl">Chọn ảnh từ danh sách để xem chi tiết</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherPhotosModal;
