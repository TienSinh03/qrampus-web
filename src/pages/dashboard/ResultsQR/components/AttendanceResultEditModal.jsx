import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'present', label: 'Có mặt' },
  { value: 'absent', label: 'Vắng' },
  { value: 'excused', label: 'Có phép' },
  { value: 'late', label: 'Đi muộn' },
];

const AttendanceResultEditModal = ({
  isOpen,
  onClose,
  result,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    status: 'present',
    note: '',
  });

  useEffect(() => {
    if (!isOpen || !result) return;

    setFormData({
      status: result.status || 'present',
      note: result.note || '',
    });
  }, [isOpen, result]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!onSubmit) return;
    await onSubmit({
      status: formData.status,
      note: formData.note,
    });
  };

  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Chỉnh sửa kết quả</p>
            <h3 className="mt-1 text-xl font-black text-slate-900">{result.name}</h3>
            <p className="mt-1 text-sm text-slate-500">MSSV: {result.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Ghi chú</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={4}
              placeholder="Nhập lý do hoặc ghi chú chỉnh sửa..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Giá trị hiện tại sẽ được ghi nhận lại với nguồn <span className="font-semibold">manual</span>.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default AttendanceResultEditModal;