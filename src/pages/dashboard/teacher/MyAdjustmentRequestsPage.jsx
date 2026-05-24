import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  X, Paperclip, FileSearchIcon, FilterX, RefreshCw, Eye, Trash2, Image as ImageIcon, ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@components/common/Pagination";
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
  status: "",
  course_code: "",
  from_date: "",
  to_date: "",
};

const DetailDrawer = ({ request, onClose, onCancel, cancelling }) => {
  if (!request) return null;
  const cs = request.class_session || {};
  const course = cs.course_section || {};
  const statusCfg = STATUS_CFG[request.status] || { label: request.status, cls: "bg-gray-100 text-gray-600" };

  return (
    <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-bold text-gray-800">Chi tiết yêu cầu của bạn</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
              {statusCfg.label}
            </span>
            <span className="text-xs text-gray-500">Gửi lúc: {fmtDateTime(request.requested_at)}</span>
          </div>

          <section className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
            <div><span className="text-gray-500">Môn:</span> <strong>{course.code || "—"}</strong> — {course.name || "—"}</div>
            <div><span className="text-gray-500">Ngày dạy:</span> {fmtDate(cs.class_date)}</div>
            <div><span className="text-gray-500">Giờ:</span> {fmtTime(cs.start_hour)} – {fmtTime(cs.end_hour)}</div>
            <div>
              <span className="text-gray-500">Trạng thái hiện tại:</span>{" "}
              <span className="font-medium">
                {LECTURER_STATUS_LABEL[cs.lecturer_attendance_status] || cs.lecturer_attendance_status || "—"}
              </span>
            </div>
          </section>

          <section>
            <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Bạn yêu cầu chuyển sang</div>
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
            <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-3">{request.reason}</div>
          </section>

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

          {request.status !== "pending" && (
            <section className="border-t pt-3">
              <div className="text-xs uppercase text-gray-500 font-semibold mb-1">Kết quả duyệt</div>
              <div className="text-sm text-gray-700">
                <span className="text-gray-500">Người duyệt:</span>{" "}
                {request.reviewed_by?.user_name || "—"}
                <span className="text-xs text-gray-500 ml-2">{fmtDateTime(request.reviewed_at)}</span>
              </div>
              {request.review_note && (
                <div className="mt-1 text-sm text-gray-600 italic whitespace-pre-wrap bg-gray-50 rounded p-3">
                  "{request.review_note}"
                </div>
              )}
            </section>
          )}

          {request.status === "pending" && (
            <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-white border-t flex items-center justify-end">
              <button
                onClick={() => onCancel(request)}
                disabled={cancelling}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 font-medium text-sm disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" /> {cancelling ? "Đang huỷ..." : "Huỷ yêu cầu"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MyAdjustmentRequestsPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, total_pages: 0 });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [tempFilters, setTempFilters] = useState(EMPTY_FILTERS);

  const [selected, setSelected] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getMyAdjustmentRequests({
        status: filters.status || undefined,
        page: currentPage,
        limit: 20,
      });
      const data = res?.data || {};
      let rawItems = Array.isArray(data.items) ? data.items : [];

      // Client-side filter cho course_code + from_date/to_date (BE chưa support 2 field này cho /me)
      const codeQuery = filters.course_code.trim().toLowerCase();
      if (codeQuery) {
        rawItems = rawItems.filter((r) =>
          String(r.class_session?.course_section?.code || "").toLowerCase().includes(codeQuery)
        );
      }
      if (filters.from_date) {
        rawItems = rawItems.filter((r) => (r.class_session?.class_date || "") >= filters.from_date);
      }
      if (filters.to_date) {
        rawItems = rawItems.filter((r) => (r.class_session?.class_date || "") <= filters.to_date);
      }

      setItems(rawItems);
      setPagination(data.pagination || { total: 0, page: 1, limit: 20, total_pages: 0 });
    } catch (err) {
      console.error(err);
      setItems([]);
      toast.error(err?.message || "Không tải được danh sách yêu cầu của bạn");
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

  const handleCancel = async (req) => {
    if (!req?.id) return;
    if (!window.confirm("Bạn có chắc chắn muốn huỷ yêu cầu này?")) return;
    try {
      setCancelling(true);
      await attendanceService.cancelMyAdjustmentRequest(req.id);
      toast.success("Đã huỷ yêu cầu");
      setSelected(null);
      fetchData();
    } catch (err) {
      toast.error(err?.message || "Không thể huỷ yêu cầu");
    } finally {
      setCancelling(false);
    }
  };

  const summary = items.reduce(
    (acc, r) => {
      acc.total += 1;
      acc[r.status] = (acc[r.status] || 0) + 1;
      acc.evidence_count += Array.isArray(r.evidence) ? r.evidence.length : 0;
      return acc;
    },
    { total: 0, evidence_count: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {selected && (
        <DetailDrawer
          request={selected}
          onClose={() => setSelected(null)}
          onCancel={handleCancel}
          cancelling={cancelling}
        />
      )}

      <div className="mx-auto">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

        {/* Header */}
        <div className="bg-white border shadow-sm rounded-b-xl p-6 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <Link
                to="/dashboard/timekeeping"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại Quản lý chấm công
              </Link>
              <h1 className="text-xl font-bold text-gray-800">Minh chứng & yêu cầu điều chỉnh đã gửi</h1>
              <p className="text-sm text-gray-500 mt-1">
                Theo dõi trạng thái duyệt và minh chứng các yêu cầu điều chỉnh chấm công bạn đã gửi.
              </p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-1 text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
            </button>
          </div>

          {/* Summary chips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <p className="text-2xl font-bold text-blue-700">{summary.total}</p>
              <p className="text-xs text-gray-600 mt-0.5">Tổng yêu cầu</p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-3 text-center">
              <p className="text-2xl font-bold text-yellow-700">{summary.pending || 0}</p>
              <p className="text-xs text-gray-600 mt-0.5">Chờ duyệt</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-700">{summary.approved || 0}</p>
              <p className="text-xs text-gray-600 mt-0.5">Đã duyệt</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{summary.rejected || 0}</p>
              <p className="text-xs text-gray-600 mt-0.5">Từ chối</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <p className="text-2xl font-bold text-slate-700 flex items-center justify-center gap-1">
                <ImageIcon className="w-5 h-5" />
                {summary.evidence_count}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">Ảnh minh chứng</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border p-6 mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={applyFilters}
              className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 text-sm"
            >
              <FileSearchIcon className="w-4 h-4" /> Tìm kiếm
            </button>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 border border-gray-400 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-50 text-sm"
            >
              <FilterX className="w-4 h-4" /> Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-x border-b overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Buổi học</th>
                  <th className="px-4 py-3 text-left font-semibold">Ngày dạy</th>
                  <th className="px-4 py-3 text-left font-semibold">Yêu cầu chuyển sang</th>
                  <th className="px-4 py-3 text-center font-semibold">Minh chứng</th>
                  <th className="px-4 py-3 text-left font-semibold">Gửi lúc</th>
                  <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-gray-500">Đang tải...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center text-gray-500">
                      Bạn chưa gửi yêu cầu điều chỉnh nào.
                    </td>
                  </tr>
                ) : (
                  items.map((req) => {
                    const cs = req.class_session || {};
                    const course = cs.course_section || {};
                    const statusCfg = STATUS_CFG[req.status] || { label: req.status, cls: "bg-gray-100 text-gray-600" };
                    const evList = Array.isArray(req.evidence) ? req.evidence : [];

                    return (
                      <tr key={req.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{course.code || "—"}</div>
                          <div className="text-xs text-gray-500 line-clamp-1" title={course.name}>{course.name || "—"}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{fmtTime(cs.start_hour)} – {fmtTime(cs.end_hour)}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{fmtDate(cs.class_date)}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                            {LECTURER_STATUS_LABEL[req.requested_status] || req.requested_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {evList.length > 0 ? (
                            <div className="flex items-center justify-center gap-1">
                              <div className="flex -space-x-2">
                                {evList.slice(0, 3).map((ev, i) => (
                                  <a
                                    key={i}
                                    href={ev.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    title={ev.originalname || `minh-chung-${i + 1}`}
                                    className="block w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden hover:scale-110 transition"
                                  >
                                    {ev.mimetype?.startsWith("image/") ? (
                                      <img src={ev.url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Paperclip className="w-3.5 h-3.5" />
                                      </div>
                                    )}
                                  </a>
                                ))}
                              </div>
                              {evList.length > 3 && (
                                <span className="text-xs text-gray-500 ml-1">+{evList.length - 3}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300 flex items-center justify-center">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{fmtDateTime(req.requested_at)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelected(req)}
                              title="Xem chi tiết"
                              className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {req.status === "pending" && (
                              <button
                                onClick={() => handleCancel(req)}
                                disabled={cancelling}
                                title="Huỷ yêu cầu"
                                className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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

          <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
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
