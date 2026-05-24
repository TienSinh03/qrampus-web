import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Paperclip, Trash2, Check, AlertTriangle, Clock } from "lucide-react";
import attendanceService from "@services/attendance.service";

const STATUS_OPTIONS = [
  { value: "manual_override", label: "Điều chỉnh thủ công (xác nhận có dạy)" },
  { value: "on_time",         label: "Đúng giờ" },
  { value: "late",            label: "Trễ" },
];

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

const REQ_STATUS_CFG = {
  pending:   { label: "Đang chờ duyệt", cls: "bg-yellow-100 text-yellow-700", Icon: Clock },
  approved:  { label: "Đã được duyệt",  cls: "bg-emerald-100 text-emerald-700", Icon: Check },
  rejected:  { label: "Đã bị từ chối",  cls: "bg-red-100 text-red-700", Icon: AlertTriangle },
  cancelled: { label: "Đã huỷ",         cls: "bg-gray-100 text-gray-600", Icon: X },
};

const fmtDateTime = (d) => {
  if (!d) return "--";
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

/**
 * Modal cho GV gửi yêu cầu điều chỉnh chấm công cho 1 buổi absent — HOẶC xem chi tiết request đã gửi.
 *
 * Props:
 *   session: object { classSessionId, classDate, startHour, endHour, courseCode, courseName, lecturerAttendanceStatus }
 *   existingRequest: object | null — nếu đã có request cho buổi này
 *   onClose()
 *   onSubmitted()      — callback sau khi gửi / huỷ thành công, dùng để refresh ngoài
 */
export default function TeacherAdjustmentRequestModal({
  session,
  existingRequest,
  onClose,
  onSubmitted,
}) {
  const [status,      setStatus]      = useState("manual_override");
  const [checkinTime, setCheckinTime] = useState(session?.startHour?.slice(0, 5) || "");
  const [reason,      setReason]      = useState("");
  const [files,       setFiles]       = useState([]);
  const [submitting,  setSubmitting]  = useState(false);
  const [resubmitMode, setResubmitMode] = useState(false);

  // Reset state khi đổi session
  useEffect(() => {
    setStatus("manual_override");
    setCheckinTime(session?.startHour?.slice(0, 5) || "");
    setReason("");
    setFiles([]);
    setResubmitMode(false);
  }, [session?.classSessionId, session?.startHour]);

  const isViewMode = !!existingRequest && !resubmitMode;

  const enterResubmitMode = () => {
    // Kế thừa lý do/trạng thái cũ để GV chỉ cần chỉnh sửa thêm
    setStatus(existingRequest?.requested_status || "manual_override");
    setReason(existingRequest?.reason || "");
    setFiles([]);
    if (existingRequest?.requested_checkin_at) {
      const d = new Date(existingRequest.requested_checkin_at);
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setCheckinTime(`${hh}:${mm}`);
    } else {
      setCheckinTime(session?.startHour?.slice(0, 5) || "");
    }
    setResubmitMode(true);
  };
  const showCheckin = status !== "manual_override";

  const handleFilesChange = (e) => {
    const picked = Array.from(e.target.files || []);
    const accepted = [];
    for (const f of picked) {
      if (!f.type.startsWith("image/")) {
        toast.error(`File "${f.name}" không phải ảnh`);
        continue;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`File "${f.name}" vượt quá ${MAX_SIZE_MB}MB`);
        continue;
      }
      accepted.push(f);
    }
    const combined = [...files, ...accepted].slice(0, MAX_FILES);
    if (files.length + accepted.length > MAX_FILES) {
      toast.warning(`Tối đa ${MAX_FILES} ảnh minh chứng`);
    }
    setFiles(combined);
    e.target.value = "";
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.classSessionId) return;
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do");
      return;
    }

    let requested_checkin_at = null;
    if (showCheckin && checkinTime && session.classDate) {
      requested_checkin_at = `${session.classDate}T${checkinTime}:00`;
    }

    try {
      setSubmitting(true);
      await attendanceService.createMyAdjustmentRequest({
        class_session_id: session.classSessionId,
        requested_status: status,
        requested_checkin_at,
        reason: reason.trim(),
        evidence: files,
      });
      toast.success("Đã gửi yêu cầu điều chỉnh, vui lòng chờ bộ phận chấm công duyệt");
      onSubmitted?.();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Không thể gửi yêu cầu");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!existingRequest?.id) return;
    if (!window.confirm("Bạn có chắc chắn muốn huỷ yêu cầu này?")) return;

    try {
      setSubmitting(true);
      await attendanceService.cancelMyAdjustmentRequest(existingRequest.id);
      toast.success("Đã huỷ yêu cầu");
      onSubmitted?.();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Không thể huỷ yêu cầu");
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return null;

  const statusCfg = isViewMode
    ? (REQ_STATUS_CFG[existingRequest.status] || REQ_STATUS_CFG.pending)
    : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-gray-800">
            {isViewMode
              ? "Chi tiết yêu cầu điều chỉnh"
              : resubmitMode
                ? "Gửi lại yêu cầu điều chỉnh"
                : "Gửi yêu cầu điều chỉnh chấm công"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Session info */}
          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
            <div><span className="text-gray-500">Môn:</span> <strong>{session.courseCode || "--"}</strong> — {session.courseName || "--"}</div>
            <div><span className="text-gray-500">Ngày dạy:</span> {session.classDate || "--"}</div>
            <div><span className="text-gray-500">Giờ:</span> {session.startHour?.slice(0, 5) || "--"} – {session.endHour?.slice(0, 5) || "--"}</div>
            <div>
              <span className="text-gray-500">Trạng thái hiện tại:</span>{" "}
              <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                {session.lecturerAttendanceStatus === "absent" ? "Vắng mặt" : (session.lecturerAttendanceStatus || "—")}
              </span>
            </div>
          </div>

          {isViewMode ? (
            <>
              {/* VIEW EXISTING REQUEST */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                  <statusCfg.Icon className="w-3.5 h-3.5" />
                  {statusCfg.label}
                </span>
                <span className="text-xs text-gray-500">Gửi lúc: {fmtDateTime(existingRequest.requested_at)}</span>
              </div>

              <section>
                <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Yêu cầu chuyển sang</div>
                <div className="text-sm font-medium text-blue-700">
                  {STATUS_OPTIONS.find((s) => s.value === existingRequest.requested_status)?.label
                    || existingRequest.requested_status}
                </div>
              </section>

              <section>
                <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Lý do bạn đã gửi</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-3">{existingRequest.reason}</div>
              </section>

              {Array.isArray(existingRequest.evidence) && existingRequest.evidence.length > 0 && (
                <section>
                  <div className="text-xs uppercase text-gray-500 font-semibold mb-2">
                    Minh chứng ({existingRequest.evidence.length})
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {existingRequest.evidence.map((ev, i) => (
                      <a
                        key={i}
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        title={ev.originalname || `minh-chung-${i + 1}`}
                        className="block aspect-square rounded-lg overflow-hidden border bg-gray-50 hover:opacity-90"
                      >
                        {ev.mimetype?.startsWith("image/") ? (
                          <img src={ev.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Paperclip className="w-5 h-5" />
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {existingRequest.status !== "pending" && (
                <section className="border-t pt-3">
                  <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Kết quả duyệt</div>
                  <div className="text-sm text-gray-700">
                    <span className="text-gray-500">Người duyệt:</span>{" "}
                    {existingRequest.reviewed_by?.user_name || "—"}
                    <span className="text-xs text-gray-500 ml-2">
                      {fmtDateTime(existingRequest.reviewed_at)}
                    </span>
                  </div>
                  {existingRequest.review_note && (
                    <div className="mt-1 text-sm text-gray-600 italic whitespace-pre-wrap bg-gray-50 rounded p-3">
                      "{existingRequest.review_note}"
                    </div>
                  )}
                </section>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t">
                {existingRequest.status === "pending" && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 font-medium text-sm disabled:opacity-60"
                  >
                    {submitting ? "Đang huỷ..." : "Huỷ yêu cầu"}
                  </button>
                )}
                {existingRequest.status === "rejected" && (
                  <button
                    type="button"
                    onClick={enterResubmitMode}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm"
                  >
                    Gửi lại yêu cầu
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm"
                >
                  Đóng
                </button>
              </div>
            </>
          ) : (
            <>
              {/* CREATE NEW REQUEST */}
              {resubmitMode && existingRequest?.review_note && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-red-700 mb-1">Yêu cầu trước đã bị từ chối</div>
                      <div className="text-gray-700 italic whitespace-pre-wrap">"{existingRequest.review_note}"</div>
                      <button
                        type="button"
                        onClick={() => setResubmitMode(false)}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                      >
                        ← Quay lại xem chi tiết yêu cầu cũ
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái muốn chuyển sang <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {showCheckin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ check-in đề xuất
                    </label>
                    <input
                      type="time"
                      value={checkinTime}
                      onChange={(e) => setCheckinTime(e.target.value)}
                      className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lý do <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Vd: Tôi có dạy buổi này nhưng quên tạo phiên điểm danh, đã có danh sách sinh viên ký tay xác nhận..."
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ảnh minh chứng <span className="text-gray-400 text-xs font-normal">(tối đa {MAX_FILES} ảnh, mỗi ảnh ≤ {MAX_SIZE_MB}MB)</span>
                  </label>
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer text-sm">
                    <Paperclip className="w-4 h-4" />
                    Chọn ảnh từ máy
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between gap-2 text-sm bg-gray-50 px-2 py-1 rounded">
                          <span className="truncate flex-1">{f.name}</span>
                          <span className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)}MB</span>
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                  <strong>Lưu ý:</strong> Sau khi gửi, bộ phận chấm công sẽ xem xét và duyệt yêu cầu của bạn.
                  Bạn có thể theo dõi trạng thái tại chính buổi học này.
                </div>

                <div className="flex items-center justify-end gap-3 pt-1 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm disabled:opacity-60"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm disabled:opacity-60"
                  >
                    {submitting ? "Đang gửi..." : resubmitMode ? "Gửi lại yêu cầu" : "Gửi yêu cầu"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
