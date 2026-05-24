import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Check, X, Paperclip, FileSearchIcon, FilterX, RefreshCw, Eye,
} from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import attendanceService from "@services/attendance.service";

const STATUS_CFG = {
  pending:   { label: "Chờ duyệt", cls: "bg-yellow-100 text-yellow-700" },
  approved:  { label: "Đã duyệt",  cls: "bg-emerald-100 text-emerald-700" },
  rejected:  { label: "Từ chối",   cls: "bg-red-100 text-red-700" },
  cancelled: { label: "Đã huỷ",    cls: "bg-gray-100 text-gray-600" },
};

const LECTURER_STATUS_LABEL = {
  on_time:         "Đúng giờ",
  late:            "Trễ",
  absent:          "Vắng",
  manual_override: "Điều chỉnh thủ công",
};

const fmtDate = (d) => {
  if (!d) return "--";
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};
const fmtDateTime = (d) => {
  if (!d) return "--";
  return new Date(d).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};
const fmtTime = (t) => (t ? String(t).slice(0, 5) : "--");

const EMPTY_FILTERS = {
  status: "pending",
  course_code: "",
  teacher_name: "",
  from_date: "",
  to_date: "",
};

const ReviewModal = ({ request, mode, onClose, onConfirm, submitting }) => {
  const [note, setNote] = useState("");
  const isApprove = mode === "approve";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isApprove && !note.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    onConfirm(note.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            {isApprove ? "Duyệt yêu cầu điều chỉnh" : "Từ chối yêu cầu"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm text-gray-600">
            {isApprove ? (
              <>
                Bạn sẽ <strong>duyệt</strong> yêu cầu của giảng viên{" "}
                <strong>{request?.requested_by?.full_name || "—"}</strong>.
                Hệ thống tự động ghi nhận trạng thái chấm công thành{" "}
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                  {LECTURER_STATUS_LABEL[request?.requested_status] || request?.requested_status}
                </span>.
              </>
            ) : (
              <>
                Bạn sẽ <strong>từ chối</strong> yêu cầu của giảng viên{" "}
                <strong>{request?.requested_by?.full_name || "—"}</strong>.
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isApprove ? "Ghi chú (tuỳ chọn)" : <>Lý do từ chối <span className="text-red-500">*</span></>}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={isApprove ? "Ghi chú nội bộ..." : "Vd: Minh chứng chưa rõ ràng, vui lòng bổ sung..."}
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              required={!isApprove}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
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
              className={`px-4 py-2 rounded-lg text-white font-medium text-sm disabled:opacity-60 ${
                isApprove ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {submitting ? "Đang xử lý..." : isApprove ? "Xác nhận duyệt" : "Xác nhận từ chối"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DetailDrawer = ({ request, onClose, onApprove, onReject }) => {
  if (!request) return null;
  const cs = request.class_session || {};
  const course = cs.course_section || {};
  const requestedBy = request.requested_by || {};
  const statusCfg = STATUS_CFG[request.status] || { label: request.status, cls: "bg-gray-100 text-gray-600" };

  return (
    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-gray-800">Chi tiết yêu cầu</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status + meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
              {statusCfg.label}
            </span>
            <span className="text-xs text-gray-500">Gửi lúc: {fmtDateTime(request.requested_at)}</span>
          </div>

          {/* Teacher */}
          <section>
            <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Người gửi</div>
            <div className="text-sm text-gray-800 font-medium">{requestedBy.full_name || requestedBy.user_name || "—"}</div>
            {requestedBy.teacher_code && (
              <div className="text-xs text-gray-500">Mã GV: {requestedBy.teacher_code}</div>
            )}
          </section>

          {/* Class session */}
          <section className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
            <div><span className="text-gray-500">Môn:</span> <strong>{course.code || "—"}</strong> — {course.name || "—"}</div>
            <div><span className="text-gray-500">Ngày dạy:</span> {fmtDate(cs.class_date)}</div>
            <div><span className="text-gray-500">Giờ:</span> {fmtTime(cs.start_hour)} – {fmtTime(cs.end_hour)}</div>
            <div>
              <span className="text-gray-500">Trạng thái GV hiện tại:</span>{" "}
              <span className="font-medium">
                {LECTURER_STATUS_LABEL[cs.lecturer_attendance_status] || cs.lecturer_attendance_status || "—"}
              </span>
            </div>
          </section>

          {/* Request body */}
          <section>
            <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Trạng thái yêu cầu chuyển sang</div>
            <div className="text-sm font-medium text-blue-700">
              {LECTURER_STATUS_LABEL[request.requested_status] || request.requested_status}
              {request.requested_checkin_at && (
                <span className="text-xs text-gray-500 ml-2">
                  (Giờ check-in đề xuất: {fmtDateTime(request.requested_checkin_at)})
                </span>
              )}
            </div>
          </section>

          <section>
            <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Lý do</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{request.reason}</div>
          </section>

          {/* Evidence */}
          <section>
            <div className="text-xs uppercase text-gray-500 font-semibold mb-2">
              Minh chứng {Array.isArray(request.evidence) && `(${request.evidence.length})`}
            </div>
            {Array.isArray(request.evidence) && request.evidence.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {request.evidence.map((ev, i) => (
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
            ) : (
              <div className="text-xs text-gray-400 italic">Không có minh chứng đính kèm</div>
            )}
          </section>

          {/* Review result if any */}
          {request.status !== "pending" && (
            <section className="border-t pt-3">
              <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Kết quả duyệt</div>
              <div className="text-sm text-gray-700">
                <span className="text-gray-500">Người duyệt:</span>{" "}
                {request.reviewed_by?.user_name || "—"}
                <span className="text-xs text-gray-500 ml-2">{fmtDateTime(request.reviewed_at)}</span>
              </div>
              {request.review_note && (
                <div className="mt-1 text-sm text-gray-600 italic whitespace-pre-wrap">"{request.review_note}"</div>
              )}
            </section>
          )}

          {/* Actions */}
          {request.status === "pending" && (
            <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-white border-t flex items-center justify-end gap-2">
              <button
                onClick={() => onReject(request)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 font-medium text-sm"
              >
                <X className="w-4 h-4" /> Từ chối
              </button>
              <button
                onClick={() => onApprove(request)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium text-sm"
              >
                <Check className="w-4 h-4" /> Duyệt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AttendanceAdjustmentRequestsPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, total_pages: 0 });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [tempFilters, setTempFilters] = useState(EMPTY_FILTERS);

  const [selected, setSelected] = useState(null);            // request mở drawer
  const [reviewing, setReviewing] = useState(null);          // { request, mode: 'approve' | 'reject' }
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceService.listAdjustmentRequests({
        ...filters,
        page: currentPage,
        limit: 20,
      });
      const data = res?.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 20, total_pages: 0 });
    } catch (err) {
      console.error(err);
      setItems([]);
      toast.error(err?.message || "Không tải được danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };
  const applyFilters = () => { setFilters({ ...tempFilters }); setCurrentPage(1); };
  const clearFilters = () => { setTempFilters(EMPTY_FILTERS); setFilters(EMPTY_FILTERS); setCurrentPage(1); };

  const openDetail = (req) => setSelected(req);
  const askApprove = (req) => { setSelected(null); setReviewing({ request: req, mode: "approve" }); };
  const askReject  = (req) => { setSelected(null); setReviewing({ request: req, mode: "reject"  }); };

  const handleConfirmReview = async (note) => {
    if (!reviewing) return;
    const { request, mode } = reviewing;
    try {
      setSubmitting(true);
      if (mode === "approve") {
        await attendanceService.approveAdjustmentRequest(request.id, note || undefined);
        toast.success("Đã duyệt yêu cầu");
      } else {
        await attendanceService.rejectAdjustmentRequest(request.id, note);
        toast.success("Đã từ chối yêu cầu");
      }
      setReviewing(null);
      fetchData();
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {selected && (
        <DetailDrawer
          request={selected}
          onClose={() => setSelected(null)}
          onApprove={askApprove}
          onReject={askReject}
        />
      )}
      {reviewing && (
        <ReviewModal
          request={reviewing.request}
          mode={reviewing.mode}
          onClose={() => setReviewing(null)}
          onConfirm={handleConfirmReview}
          submitting={submitting}
        />
      )}

      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800 mb-4" />

          <div className="px-2 mb-4 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Yêu cầu điều chỉnh chấm công</h1>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="w-4 h-4" /> Làm mới
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white border p-6 mb-0">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  name="status"
                  value={tempFilters.status}
                  onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tất cả --</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Từ chối</option>
                  <option value="cancelled">Đã huỷ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã môn học</label>
                <input
                  type="text" name="course_code"
                  value={tempFilters.course_code} onChange={handleTempChange}
                  placeholder="Vd: INT3104"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên giảng viên</label>
                <input
                  type="text" name="teacher_name"
                  value={tempFilters.teacher_name} onChange={handleTempChange}
                  placeholder="Tìm theo tên GV"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date" name="from_date"
                  value={tempFilters.from_date} onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date" name="to_date"
                  value={tempFilters.to_date} onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={applyFilters}
                className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-100"
                title="Tìm kiếm"
              >
                <FileSearchIcon className="w-5 h-5" />
              </button>
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100"
                title="Xoá bộ lọc"
              >
                <FilterX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow mb-4">
            <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr className="border-b">
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Gửi lúc</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Giảng viên</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Môn / Ngày dạy</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Yêu cầu chuyển sang</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Minh chứng</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Trạng thái</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Đang tải...
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                      Không có yêu cầu nào
                    </td>
                  </tr>
                ) : (
                  items.map((req) => {
                    const cs = req.class_session || {};
                    const course = cs.course_section || {};
                    const requestedBy = req.requested_by || {};
                    const statusCfg = STATUS_CFG[req.status] || { label: req.status, cls: "bg-gray-100 text-gray-600" };
                    const evidenceCount = Array.isArray(req.evidence) ? req.evidence.length : 0;
                    return (
                      <tr key={req.id} className="border-b hover:bg-slate-50 transition-colors h-12">
                        <td className="px-4 py-2 text-gray-600">{fmtDateTime(req.requested_at)}</td>
                        <td className="px-4 py-2">
                          <div className="font-medium text-gray-800">{requestedBy.full_name || requestedBy.user_name || "—"}</div>
                          {requestedBy.teacher_code && (
                            <div className="text-xs text-gray-500">{requestedBy.teacher_code}</div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-gray-800"><strong>{course.code || "—"}</strong> {course.name || ""}</div>
                          <div className="text-xs text-gray-500">
                            {fmtDate(cs.class_date)} · {fmtTime(cs.start_hour)}–{fmtTime(cs.end_hour)}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {LECTURER_STATUS_LABEL[req.requested_status] || req.requested_status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {evidenceCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                              <Paperclip className="w-3.5 h-3.5" /> {evidenceCount}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openDetail(req)}
                              title="Chi tiết"
                              className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {req.status === "pending" && (
                              <>
                                <button
                                  onClick={() => askApprove(req)}
                                  title="Duyệt"
                                  className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => askReject(req)}
                                  title="Từ chối"
                                  className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-sm text-gray-500">
              Tổng: <strong>{pagination.total || 0}</strong> yêu cầu
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.total_pages || 1}
              onPageChange={(page) => setCurrentPage(page)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
