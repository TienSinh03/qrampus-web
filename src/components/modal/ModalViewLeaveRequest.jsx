import React from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  BookOpen,
  Building2,
  FileText,
  Paperclip,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("vi-VN");
};

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleString("vi-VN");
};

const formatFileSize = (size) => {
  if (!size || Number.isNaN(Number(size))) return "-";
  const mb = Number(size) / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(2)} MB`;
  const kb = Number(size) / 1024;
  return `${kb.toFixed(0)} KB`;
};

const getStatusConfig = (status) => {
  switch (status) {
    case "approved":
      return {
        text: "Đã duyệt",
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: <CheckCircle className="h-4 w-4" />,
      };
    case "rejected":
      return {
        text: "Từ chối",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="h-4 w-4" />,
      };
    default:
      return {
        text: "Chờ duyệt",
        className: "bg-amber-100 text-amber-700 border-amber-200",
        icon: <AlertCircle className="h-4 w-4" />,
      };
  }
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-gray-100 bg-white px-3 py-2">
    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="text-sm font-medium text-gray-800">{value || "-"}</div>
  </div>
);

const ModalViewLeaveRequest = ({ isOpen, onClose, leaveData }) => {
  if (!isOpen || !leaveData) return null;

  const statusConfig = getStatusConfig(leaveData?.status);
  const attachments = Array.isArray(leaveData?.attachments) ? leaveData.attachments : [];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 py-6" onClick={onClose}>
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chi tiết đơn xin nghỉ</h3>
            {/* <p className="text-sm text-gray-600">Mã đơn: {leaveData?.id || "-"}</p> */}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-white hover:text-gray-700"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-140px)] overflow-y-auto px-5 py-4">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Trạng thái</p>
              <div className={`mt-1 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium ${statusConfig.className}`}>
                {statusConfig.icon}
                {statusConfig.text}
              </div>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Tạo lúc: {formatDateTime(leaveData?.created_at)}</p>
              {leaveData?.reviewed_at && <p className="mt-1">Duyệt lúc: {formatDateTime(leaveData?.reviewed_at)}</p>}
              {leaveData?.reviewed_by && <p className="mt-1">Người duyệt: {leaveData?.classSession?.personnel?.full_name}</p>}
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <InfoItem icon={User} label="Sinh viên" value={leaveData?.student?.full_name} />
            <InfoItem icon={User} label="Mã số sinh viên" value={leaveData?.student?.student_code} />
            <InfoItem icon={BookOpen} label="Học phần" value={leaveData?.classSession?.courseSection?.name} />
            <InfoItem icon={BookOpen} label="Mã học phần" value={leaveData?.classSession?.courseSection?.code} />
            <InfoItem icon={Calendar} label="Ngày nghỉ" value={formatDate(leaveData?.classSession?.class_date)} />
            <InfoItem
              icon={Clock}
              label="Thời gian học"
              value={`${leaveData?.classSession?.start_hour || "-"} - ${leaveData?.classSession?.end_hour || "-"}`}
            />
            <InfoItem icon={Building2} label="Phòng học" value={leaveData?.classSession?.room?.room_name || leaveData?.classSession?.room?.room_code} />
            <InfoItem icon={User} label="Lớp" value={leaveData?.student?.class_name} />
          </div>

          <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <p className="mb-2 text-sm font-semibold text-gray-800">Lý do xin nghỉ</p>
            <p className="text-sm leading-relaxed text-gray-700">{leaveData?.note || "-"}</p>
            {leaveData?.status === "rejected" && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                <p className="text-xs font-semibold text-red-700">Lý do từ chối</p>
                <p className="mt-1 text-sm text-red-700">{leaveData?.rejected_reason || "-"}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-semibold text-gray-800">File đính kèm ({attachments.length})</p>
            </div>

            {attachments.length === 0 ? (
              <p className="text-sm text-gray-500">Không có file đính kèm</p>
            ) : (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <a
                    key={file?.public_id || file?.url || index}
                    href={file?.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">{file?.originalName || `Tệp ${index + 1}`}</p>
                      <p className="text-xs text-gray-500">
                        {file?.format?.toUpperCase() || "FILE"} - {formatFileSize(file?.size)}
                      </p>
                    </div>
                    <Download className="ml-3 h-4 w-4 text-gray-500" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-200 bg-white px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewLeaveRequest;
