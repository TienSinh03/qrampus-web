import React, { useEffect, useState, useMemo } from "react";
import {
  X, Search, FilterX, FileSpreadsheet,
  Star, Users, MessageSquare, TrendingUp, Clock,
} from "lucide-react";
import surveyService from "../../services/survey.service";
import LoadingSpinner from "@components/layout/LoadingSpinner";
import EmptyState from "@components/layout/EmptyState";
import Pagination from "../common/Pagination";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRatingColor = (r) => {
  if (r >= 4.5) return { text: "text-emerald-600", bg: "bg-emerald-100", dot: "#10b981" };
  if (r >= 4.0) return { text: "text-blue-600",    bg: "bg-blue-100",    dot: "#3b82f6" };
  if (r >= 3.5) return { text: "text-amber-600",   bg: "bg-amber-100",   dot: "#f59e0b" };
  if (r >= 3.0) return { text: "text-orange-600",  bg: "bg-orange-100",  dot: "#f97316" };
  return           { text: "text-red-600",     bg: "bg-red-100",     dot: "#ef4444" };
};

const getRatingLabel = (r) => {
  if (r >= 4.5) return "Xuất sắc";
  if (r >= 4.0) return "Tốt";
  if (r >= 3.5) return "Khá";
  if (r >= 3.0) return "Trung bình";
  return "Yếu";
};

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
};

const formatDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const StarMini = ({ rating }) => {
  const { dot } = getRatingColor(rating);
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill={i <= filled ? dot : "#e5e7eb"}>
          <path d="M5 1l1.12 2.27 2.51.36-1.82 1.77.43 2.5L5 6.77l-2.24 1.13.43-2.5L1.37 3.63l2.51-.36z" />
        </svg>
      ))}
    </div>
  );
};

const CompletionBar = ({ pct }) => (
  <div className="flex items-center gap-1.5 min-w-[80px]">
    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: pct === 100 ? "#10b981" : pct >= 70 ? "#3b82f6" : "#f59e0b",
        }}
      />
    </div>
    <span className="text-xs font-semibold text-gray-600 w-8 text-right">{pct}%</span>
  </div>
);

// ─── Main Modal ───────────────────────────────────────────────────────────────
// API response shape:
// { success, message, data: {
//     total_surveys, total_course_sections,
//     pagination: { page, limit, total, totalPages },
//     filters: { course_code, course_name, teacher_code, teacher_name },
//     items: [{
//       survey_id, survey_title, class_type, closes_at,
//       course_section: { id, code, name, semester },
//       practice_group: { id, number_group, group_name } | null,
//       teachers: [{ id, teacher_code, full_name, email }],
//       overview: {
//         total_students_enrolled, total_students, total_responses,
//         avg_rating, star_1_count..star_5_count,
//         completion_rate, text_feedback_count, last_response_at
//       },
//       question_results: [...]
//     }]
// }}
const ModalSurveyResultsPage = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows]       = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const defaultFilters = {
    courseCode: "", courseName: "",
    teacherCode: "", teacherName: "",
    semester: "", classType: "all",
  };
  const [filters, setFilters]               = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const fetchData = async (page = 1, f = appliedFilters) => {
    try {
      setLoading(true);
      const res = await surveyService.getSurveyResults({
        page,
        limit:        10,
        course_code:  f.courseCode   || undefined,
        course_name:  f.courseName   || undefined,
        teacher_code: f.teacherCode  || undefined,
        teacher_name: f.teacherName  || undefined,
        semester:     f.semester     || undefined,
        class_type:   f.classType !== "all" ? f.classType : undefined,
      });
      const data  = res?.data || {};
      const items = Array.isArray(data.items) ? data.items : [];
      const pg    = data.pagination || {};
      setRows(items);
      setPagination({
        page:       Number(pg.page)                             || page,
        limit:      Number(pg.limit)                           || 10,
        total:      Number(pg.total ?? data.total_surveys)     || 0,
        totalPages: Number(pg.totalPages)                      || 1,
      });
    } catch (err) {
      console.error("Error fetching survey results:", err);
      toast.error(err.message || "Không thể tải kết quả khảo sát");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchData(1, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleApply = () => {
    setAppliedFilters(filters);
    fetchData(1, filters);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    fetchData(1, defaultFilters);
  };

  const handlePageChange = (p) => {
    const next = Math.max(1, Math.min(Number(p) || 1, pagination.totalPages));
    if (next === pagination.page) return;
    fetchData(next);
  };

  const handleExport = () => {
    if (!rows.length) { toast.warning("Không có dữ liệu để xuất"); return; }
    const headers = [
      "survey_id","survey_title","class_type",
      "course_code","course_name","semester",
      "practice_group",
      "teacher_code","teacher_name","teacher_email",
      "total_students_enrolled","total_students","total_responses",
      "avg_rating","star_1","star_2","star_3","star_4","star_5",
      "completion_rate","text_feedback_count","last_response_at","closes_at",
    ];
    const esc = (v) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      headers.join(","),
      ...rows.map((item) => {
        const ov = item.overview || {};
        const t  = item.teachers?.[0] || {};
        return [
          item.survey_id, item.survey_title, item.class_type,
          item.course_section?.code, item.course_section?.name, item.course_section?.semester,
          item.practice_group?.group_name || "",
          t.teacher_code || "", t.full_name || "", t.email || "",
          ov.total_students_enrolled, ov.total_students, ov.total_responses,
          ov.avg_rating,
          ov.star_1_count, ov.star_2_count, ov.star_3_count, ov.star_4_count, ov.star_5_count,
          ov.completion_rate, ov.text_feedback_count, ov.last_response_at, item.closes_at,
        ].map(esc).join(",");
      }),
    ];
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `survey-results-p${pagination.page}.csv`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    toast.success("Xuất file thành công");
  };

  const summary = useMemo(() => ({
    total:     pagination.total,
    enrolled:  rows.reduce((s, i) => s + (i.overview?.total_students_enrolled || 0), 0),
    responses: rows.reduce((s, i) => s + (i.overview?.total_responses         || 0), 0),
    avg: rows.length
      ? (rows.reduce((s, i) => s + (i.overview?.avg_rating || 0), 0) / rows.length).toFixed(2)
      : "—",
  }), [rows, pagination.total]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />

      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div
          className="w-full max-w-7xl bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col"
          style={{ maxHeight: "92vh" }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-teal-50 flex-shrink-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Tổng kết kết quả khảo sát</h3>
              <p className="text-sm text-gray-500">Danh sách khảo sát kèm điểm đánh giá và tỷ lệ phản hồi</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-teal-100 p-2 transition">
              <X size={18} />
            </button>
          </div>

          {/* ── Summary strip ── */}
          <div className="grid grid-cols-4 border-b flex-shrink-0">
            {[
              { icon: TrendingUp,    label: "Tổng khảo sát",  val: summary.total,     color: "text-teal-600 bg-teal-50"       },
              { icon: Users,         label: "SV ghi danh",    val: summary.enrolled,  color: "text-blue-600 bg-blue-50"       },
              { icon: MessageSquare, label: "Tổng phản hồi",  val: summary.responses, color: "text-amber-600 bg-amber-50"     },
              { icon: Star,          label: "Điểm TB chung",  val: summary.avg,       color: "text-emerald-600 bg-emerald-50" },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className={`flex items-center gap-3 px-5 py-3 border-r last:border-r-0 ${color}`}>
                <Icon size={18} className="opacity-70 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-xl font-black text-gray-800">{val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="p-4 border-b bg-gray-50 flex-shrink-0">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { key: "courseCode",  placeholder: "Mã học phần"    },
                { key: "courseName",  placeholder: "Tên học phần"   },
                { key: "teacherCode", placeholder: "Mã giảng viên"  },
                { key: "teacherName", placeholder: "Tên giảng viên" },
                { key: "semester",    placeholder: "Học kỳ (2026-2)"},
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  type="text"
                  value={filters[key]}
                  placeholder={placeholder}
                  onChange={(e) => setFilters((p) => ({ ...p, [key]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              ))}
              <select
                value={filters.classType}
                onChange={(e) => setFilters((p) => ({ ...p, classType: e.target.value }))}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              >
                <option value="all">Tất cả loại lớp</option>
                <option value="LY_THUYET">Lý thuyết</option>
                <option value="THUC_HANH">Thực hành</option>
              </select>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={handleApply} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 text-sm">
                <Search size={15} /> Tìm kiếm
              </button>
              <button onClick={handleClear} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 text-sm">
                <FilterX size={15} /> Xóa lọc
              </button>
              <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-teal-500 text-teal-600 hover:bg-teal-50 text-sm">
                <FileSpreadsheet size={15} /> Xuất file
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="border-b text-gray-600 uppercase text-xs">
                  <th className="px-3 py-3 text-left  whitespace-nowrap">Mã học phần</th>
                  <th className="px-3 py-3 text-left  whitespace-nowrap">Tên học phần</th>
                  <th className="px-3 py-3 text-left  whitespace-nowrap">Học kỳ</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap">Loại lớp</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap">Nhóm TH</th>
                  <th className="px-3 py-3 text-left  whitespace-nowrap">Giảng viên</th>
                  <th className="px-3 py-3 text-right whitespace-nowrap">Ghi danh</th>
                  <th className="px-3 py-3 text-right whitespace-nowrap">Phản hồi</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap">Điểm TB</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap">Hoàn thành</th>
                  <th className="px-3 py-3 text-right whitespace-nowrap">Góp ý</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap">PH cuối</th>
                  <th className="px-3 py-3 text-center whitespace-nowrap">Đóng ngày</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={13} className="py-8 text-center">
                      <LoadingSpinner text="Đang tải dữ liệu..." color="blue" />
                    </td>
                  </tr>
                )}

                {!loading && rows.length === 0 && (
                  <EmptyState
                    title="Không có dữ liệu kết quả khảo sát"
                    description="Không tìm thấy khảo sát phù hợp với bộ lọc hiện tại."
                    colSpan={13}
                    onAction={() => fetchData(1, appliedFilters)}
                    actionLabel="Tải lại"
                  />
                )}

                {!loading && rows.map((item) => {
                  const ov = item.overview || {};
                  const rc = getRatingColor(ov.avg_rating || 0);
                  return (
                    <tr key={item.survey_id} className="border-b hover:bg-slate-50 transition-colors">

                      {/* Mã học phần */}
                      <td className="px-3 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                        {item.course_section?.code}
                      </td>

                      {/* Tên học phần */}
                      <td className="px-3 py-3 max-w-[200px]">
                        <p className="font-medium text-gray-800 truncate" title={item.course_section?.name}>
                          {item.course_section?.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate" title={item.survey_title}>
                          {item.survey_title}
                        </p>
                      </td>

                      {/* Học kỳ */}
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">
                        {item.course_section?.semester}
                      </td>

                      {/* Loại lớp */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {item.class_type === "LY_THUYET" ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700">Lý thuyết</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-teal-100 text-teal-700">Thực hành</span>
                        )}
                      </td>

                      {/* Nhóm TH */}
                      <td className="px-3 py-3 text-center">
                        {item.practice_group ? (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                            {item.practice_group.group_name}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Giảng viên */}
                      <td className="px-3 py-3 max-w-[160px]">
                        {item.teachers?.map((t) => (
                          <p key={t.id} className="text-sm text-gray-700 truncate"
                            title={`${t.full_name} · ${t.teacher_code}`}>
                            {t.full_name}
                          </p>
                        ))}
                      </td>

                      {/* Ghi danh — total_students_enrolled / total_students */}
                      <td className="px-3 py-3 text-right whitespace-nowrap">
                        <span className="font-medium text-gray-700">
                          {ov.total_students_enrolled ?? "—"}
                        </span>
                        {ov.total_students_enrolled !== ov.total_students && ov.total_students != null && (
                          <span className="ml-1 text-xs text-gray-400">/{ov.total_students}</span>
                        )}
                      </td>

                      {/* Phản hồi */}
                      <td className="px-3 py-3 text-right font-medium text-gray-700">
                        {ov.total_responses ?? "—"}
                      </td>

                      {/* Điểm TB */}
                      <td className="px-3 py-3 text-center">
                        {(ov.avg_rating || 0) > 0 ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <span className={`text-base font-black ${rc.text}`}>
                              {Number(ov.avg_rating).toFixed(2)}
                            </span>
                            <StarMini rating={ov.avg_rating} />
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${rc.bg} ${rc.text}`}>
                              {getRatingLabel(ov.avg_rating)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Hoàn thành */}
                      <td className="px-3 py-3">
                        <CompletionBar pct={ov.completion_rate ?? 0} />
                      </td>

                      {/* Góp ý text */}
                      <td className="px-3 py-3 text-right">
                        {(ov.text_feedback_count ?? 0) > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            <MessageSquare size={10} /> {ov.text_feedback_count}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Phản hồi cuối — last_response_at */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        {ov.last_response_at ? (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={10} className="text-gray-400 flex-shrink-0" />
                            {formatDateTime(ov.last_response_at)}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>

                      {/* Đóng ngày */}
                      <td className="px-3 py-3 text-center text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(item.closes_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          <div className="px-6 py-4 border-t bg-white flex items-center justify-between gap-4 flex-shrink-0">
            <div className="text-sm text-gray-600">
              Tổng: <span className="font-semibold">{pagination.total}</span> khảo sát
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalSurveyResultsPage;