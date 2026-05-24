import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ScanFace,
  UserCircle2,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { useFaceVerify } from "@contexts/FaceVerifyContext";
import Lightbox from "@components/common/Lightbox";

// Constants
const FACE_STATUS = {
  match:    { label: "Khớp",         icon: CheckCircle2, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  no_match: { label: "Không khớp",   icon: XCircle,      cls: "text-rose-700 bg-rose-50 border-rose-200" },
  error:    { label: "Lỗi xác thực", icon: AlertCircle,  cls: "text-amber-700 bg-amber-50 border-amber-200" },
};

const ModalFaceVerify = ({ attendance, onClose }) => {
  const { fetchByAttendance } = useFaceVerify();

  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data: result, error: err } = await fetchByAttendance(attendance.id);
      if (!cancelled) {
        setData(result);
        setError(err);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [attendance.id, fetchByAttendance]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const meta       = data?.metadata || {};
  const anh1       = meta.anh_1 || null;
  const anh2       = meta.anh_2 || data?.image_url || null;
  const similarity = meta.cosine_similarity;
  const simPct     = similarity != null ? (Math.abs(similarity) * 100).toFixed(1) : null;
  const cfg        = FACE_STATUS[data?.status] || FACE_STATUS.error;
  const StatusIcon = cfg.icon;

  const zoomImages = [
    ...(anh1 ? [{ src: anh1, label: "Ảnh đăng ký" }] : []),
    ...(anh2 ? [{ src: anh2, label: "Ảnh quét" }] : []),
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <ScanFace className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 leading-tight">Nhận diện khuôn mặt</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {attendance.student?.full_name} · {attendance.student?.student_code}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {loading && (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <span className="text-sm">Đang tải...</span>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-rose-500">
                <AlertCircle className="w-8 h-8" />
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {!loading && !error && !data && (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                <ScanFace className="w-10 h-10 text-slate-200" />
                <p className="text-sm text-center">
                  Sinh viên chưa có dữ liệu<br />nhận diện khuôn mặt.
                </p>
              </div>
            )}

            {!loading && !error && data && (
              <div className="space-y-4">
                {/* Image pair */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { src: anh1, label: "Ảnh đăng ký", idx: 0,          fallback: <UserCircle2 className="w-10 h-10 text-slate-200" /> },
                    { src: anh2, label: "Ảnh quét",    idx: anh1 ? 1 : 0, fallback: <ScanFace    className="w-10 h-10 text-slate-200" /> },
                  ].map(({ src, label, idx, fallback }) => (
                    <div
                      key={label}
                      onClick={() => src && setLightbox({ images: zoomImages, index: idx })}
                      className={`relative group rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-square flex items-center justify-center ${src ? "cursor-pointer" : ""}`}
                    >
                      {src ? (
                        <>
                          <img
                            src={src}
                            alt={label}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 flex items-center justify-center transition-all duration-200">
                            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                          </div>
                        </>
                      ) : fallback}
                      <span className="absolute bottom-0 inset-x-0 text-[10px] font-bold text-center bg-black/40 text-white py-1 leading-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Status + similarity */}
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${cfg.cls}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </span>
                  {simPct != null && (
                    <span className={`text-sm font-black tabular-nums ${data.status === "match" ? "text-emerald-600" : "text-rose-500"}`}>
                      {simPct}%
                    </span>
                  )}
                </div>

                {/* Similarity bar */}
                {similarity != null && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Độ tương đồng khuôn mặt
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${data.status === "match" ? "bg-emerald-400" : "bg-rose-400"}`}
                        style={{ width: `${Math.max(0, Math.min(100, Math.abs(similarity) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Verified at */}
                <p className="text-xs text-slate-400">
                  Xác thực lúc:{" "}
                  <span className="font-semibold text-slate-600">
                    {data.verified_at ? new Date(data.verified_at).toLocaleString("vi-VN") : "---"}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          zIndex="z-[70]"
        />
      )}
    </>
  );
};

export default ModalFaceVerify;
