import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  UserCircle2,
  ScanFace,
  ZoomIn,
} from 'lucide-react';
import { useFaceVerify } from '@contexts/FaceVerifyContext';
import Lightbox from '@components/common/Lightbox';

const STATUS_CONFIG = {
  match: {
    label: 'Khớp',
    icon: CheckCircle2,
    badge: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
    glow: 'ring-2 ring-emerald-300',
  },
  no_match: {
    label: 'Không khớp',
    icon: XCircle,
    badge: 'text-rose-700 bg-rose-50 border border-rose-200',
    glow: 'ring-2 ring-rose-300',
  },
  error: {
    label: 'Lỗi',
    icon: AlertCircle,
    badge: 'text-amber-700 bg-amber-50 border border-amber-200',
    glow: 'ring-2 ring-amber-300',
  },
};

const formatDateTime = (iso) => {
  if (!iso) return '---';
  return new Date(iso).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const MINIO_BASE_URL = 'https://api.diemdanhiuh.io.vn/minio-files/qrampus-avatars/';

const FaceCard = ({ record, onZoom }) => {
  const statusCfg = STATUS_CONFIG[record.status] || STATUS_CONFIG.error;
  const StatusIcon = statusCfg.icon;
  const metadata = record.metadata || {};
  const similarity = metadata.cosine_similarity;
  const similarityPct = similarity != null ? (Math.abs(similarity) * 100).toFixed(1) : null;
  const isMatch = record.status === 'match';
  const isError = record.status === 'error';

  const anh1 = metadata.anh_1 || (isError ? record.student?.avatar_url : null);
  const anh2 = metadata.anh_2 || (isError && metadata.minio?.objectName
    ? `${MINIO_BASE_URL}${metadata.minio.objectName}`
    : null);

  const zoomImages = [
    ...(anh1 ? [{ src: anh1, label: 'Ảnh đăng ký' }] : []),
    ...(anh2 ? [{ src: anh2, label: 'Ảnh quét' }] : []),
  ];

  return (
    <div className={`group bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${isMatch ? 'border-emerald-100' : 'border-slate-100'}`}>
      {/* Images row */}
      <div className="grid grid-cols-2 divide-x divide-slate-100">
        {[
          { src: anh1, label: 'Đăng ký', index: 0 },
          { src: anh2, label: 'Quét', index: 1 },
        ].map(({ src, label, index }) => (
          <div
            key={label}
            className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer"
            onClick={() => zoomImages.length > 0 && onZoom(zoomImages, index < zoomImages.length ? index : 0)}
          >
            {src ? (
              <>
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow" />
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-200">
                {index === 0 ? <UserCircle2 className="w-10 h-10" /> : <ScanFace className="w-10 h-10" />}
              </div>
            )}
            <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-black/50 text-white px-1.5 py-0.5 rounded-full leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <p className="text-sm font-black text-slate-800 leading-tight line-clamp-1">
            {record.student?.full_name || 'N/A'}
          </p>
          <p className="text-xs font-bold text-indigo-500 mt-0.5">
            {record.student?.student_code || '---'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusCfg.badge}`}>
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </span>
          {similarityPct != null && (
            <span className={`text-[11px] font-black tabular-nums ${isMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
              {similarityPct}%
            </span>
          )}
        </div>

        {isError && metadata.error && (
          <p className="text-[10px] text-amber-600 leading-tight bg-amber-50 border border-amber-100 rounded-lg px-2 py-1">
            {metadata.error}
          </p>
        )}

        <p className="text-[10px] text-slate-400 leading-tight">
          {formatDateTime(record.verified_at)}
        </p>
      </div>
    </div>
  );
};


const FilterChip = ({ active, onClick, color, label, count }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-150 ${color} ${active ? 'shadow-md scale-105' : 'opacity-60 hover:opacity-90 hover:scale-[1.02]'}`}
  >
    {label}
    <span className="font-black bg-white/40 rounded-full px-1.5 py-0.5 leading-none">{count}</span>
  </button>
);


const FaceVerificationsModal = ({ isOpen, onClose, classSessionId, teacherId }) => {
  const { fetchByClassSession, classSessionData, classSessionLoading: loading, classSessionError: error } = useFaceVerify();
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);

  const records = classSessionData || [];

  const fetchData = useCallback(async () => {
    if (!classSessionId) return;
    await fetchByClassSession(classSessionId, teacherId);
  }, [classSessionId, teacherId, fetchByClassSession]);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  if (!isOpen) return null;

  const matchCount = records.filter((r) => r.status === 'match').length;
  const noMatchCount = records.filter((r) => r.status === 'no_match').length;
  const errorCount = records.filter((r) => r.status === 'error').length;

  const filtered = filter === 'all' ? records : records.filter((r) => r.status === filter);

  const chips = [
    { key: 'all', label: 'Tất cả', count: records.length, color: 'bg-slate-100 text-slate-700 border-slate-200' },
    { key: 'match', label: 'Khớp', count: matchCount, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'no_match', label: 'Không khớp', count: noMatchCount, color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { key: 'error', label: 'Lỗi', count: errorCount, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <ScanFace className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-800 leading-tight">Nhận diện khuôn mặt</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {records.length > 0 ? `${records.length} bản ghi — ${matchCount} khớp · ${noMatchCount} không khớp` : 'Buổi học này'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter chips */}
          {!loading && records.length > 0 && (
            <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-50 bg-white overflow-x-auto">
              {chips.map(({ key, label, count, color }) => (
                <FilterChip
                  key={key}
                  active={filter === key}
                  onClick={() => setFilter(key)}
                  color={color}
                  label={label}
                  count={count}
                />
              ))}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 bg-slate-50/50">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-56 gap-3 text-slate-400">
                <Loader2 className="w-9 h-9 animate-spin text-indigo-400" />
                <span className="text-sm font-medium">Đang tải dữ liệu...</span>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center h-56 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-rose-400" />
                </div>
                <p className="text-sm font-semibold text-slate-600">{error}</p>
                <button
                  type="button"
                  onClick={fetchData}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && records.length === 0 && (
              <div className="flex flex-col items-center justify-center h-56 gap-3 text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <ScanFace className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-center text-slate-500">
                  Chưa có dữ liệu nhận diện khuôn mặt<br />cho buổi học này.
                </p>
              </div>
            )}

            {/* No match for filter */}
            {!loading && !error && records.length > 0 && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
                <p className="text-sm">Không có bản ghi nào phù hợp.</p>
              </div>
            )}

            {/* Grid */}
            {!loading && !error && filtered.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filtered.map((record) => (
                  <FaceCard
                    key={record.id}
                    record={record}
                    onZoom={(images, index) => setLightbox({ images, index })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          maxWidth="max-w-2xl"
          maxImgHeight="max-h-[70vh]"
        />
      )}
    </>
  );
};

export default FaceVerificationsModal;
