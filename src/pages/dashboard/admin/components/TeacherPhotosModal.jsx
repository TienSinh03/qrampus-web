import React, { useEffect, useState } from "react";
import { X, ChevronLeft, Images, Clock, Users, ImageOff, Loader2 } from "lucide-react";
import { useImageSession } from "@contexts/ImageSessionContext";

const formatDateTime = (iso) => {
  if (!iso) return "---";
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const SessionListPanel = ({ sessions, loading, onSelect }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm">Đang tải phiên ảnh...</span>
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
        <ImageOff className="w-12 h-12" />
        <span className="text-sm text-center">Chưa có phiên ảnh nào cho buổi học này</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto">
      {sessions.map((session, idx) => {
        const captureLabel =
          session.capture_type === "manual" ? "Thủ công" : "Tự động";

        return (
          <button
            key={session.id}
            type="button"
            onClick={() => onSelect(session)}
            className="text-left w-full rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md p-4 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700">
                Phiên {idx + 1}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
                {captureLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDateTime(session.started_at)}</span>
            </div>
            {session.note && (
              <p className="mt-2 text-xs text-slate-400 italic line-clamp-2">
                {session.note}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
};

const SessionImagesPanel = ({ images, loading, selectedImage, onSelectImage }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm">Đang tải ảnh...</span>
      </div>
    );
  }

  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
        <ImageOff className="w-12 h-12" />
        <span className="text-sm">Phiên này chưa có ảnh nào</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {images.map((img, idx) => {
        const url = img.thumbnail_url || img.file_url || img.thumbnailUrl || img.fileUrl;
        const isSelected = selectedImage?.id === img.id;

        return (
          <div
            key={img.id}
            onClick={() => onSelectImage(img)}
            className={`cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
              isSelected ? "border-green-500 shadow-lg" : "border-transparent"
            }`}
          >
            <img
              src={url}
              alt={`Ảnh ${idx + 1}`}
              className="w-full h-40 object-cover hover:opacity-90 transition"
            />
            <div className="px-3 py-2 bg-white">
              <p className="text-center text-sm font-medium text-gray-700">
                Ảnh {idx + 1}
              </p>
              {img.student_count_ai != null && (
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>{img.student_count_ai} sinh viên</span>
                </div>
              )}
              <p className="text-center text-[11px] text-slate-400 mt-0.5">
                {formatDateTime(img.taken_at || img.takenAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Main Modal 
const TeacherPhotosModal = ({ isOpen, onClose, classSessionId }) => {
  const {
    imageSessions,
    imageSessionsLoading,
    fetchImageSessionsByClassSession,
    sessionImages,
    sessionImagesLoading,
    fetchImagesBySession,
    clearSessionImages,
  } = useImageSession();

  const [activeSession, setActiveSession] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!isOpen || !classSessionId) return;
    // External side-effects only — no setState here.
    clearSessionImages();
    fetchImageSessionsByClassSession(classSessionId);
  }, [isOpen, classSessionId, fetchImageSessionsByClassSession, clearSessionImages]);

  const handleSelectSession = (session) => {
    setActiveSession(session);
    setSelectedImage(null);
    fetchImagesBySession(session.id);
  };

  const handleBack = () => {
    setActiveSession(null);
    setSelectedImage(null);
    clearSessionImages();
  };

  if (!isOpen) return null;

  const displayImages = sessionImages.map((img, idx) => ({
    ...img,
    caption: `Ảnh ${idx + 1}`,
    url: img.thumbnail_url || img.file_url || img.thumbnailUrl || img.fileUrl,
  }));

  const totalPhotos = activeSession ? displayImages.length : imageSessions.length;
  const headerLabel = activeSession ? `Ảnh trong phiên (${totalPhotos} ảnh)` : `Phiên chụp ảnh (${totalPhotos} phiên)`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 !space-y-0">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            {activeSession && (
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                title="Quay lại danh sách phiên"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <Images className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold text-gray-800">
              {headerLabel}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-lime-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-full lg:w-80 bg-gray-50 border-r overflow-hidden flex flex-col">
            {activeSession ? (
              <SessionImagesPanel
                images={displayImages}
                loading={sessionImagesLoading}
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
              />
            ) : (
              <SessionListPanel
                sessions={imageSessions}
                loading={imageSessionsLoading}
                onSelect={handleSelectSession}
              />
            )}
          </div>

          {/* Main preview */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
            {selectedImage ? (
              <div className="text-center max-w-full">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
                />
                <p className="mt-6 text-lg font-medium text-gray-800">
                  {selectedImage.caption}
                </p>
                {selectedImage.student_count_ai != null && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-slate-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      Phát hiện {selectedImage.student_count_ai} sinh viên
                    </span>
                  </div>
                )}
                <p className="text-sm text-slate-400 mt-1">
                  {formatDateTime(selectedImage.taken_at || selectedImage.takenAt)}
                </p>
              </div>
            ) : activeSession ? (
              <p className="text-gray-500 text-xl">
                Chọn ảnh từ danh sách để xem chi tiết
              </p>
            ) : (
              <div className="text-center text-gray-400">
                <Images className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Chọn một phiên ảnh để xem nội dung</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPhotosModal;
