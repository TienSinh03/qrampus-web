import React, { useEffect } from "react";
import {
  X,
  BookOpen,
  Hash,
  CalendarRange,
  Layers,
  Users,
  Percent,
  Star,
  BarChart3,
} from "lucide-react";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatPercent = (value) => `${toNumber(value).toFixed(1)}%`;
const formatRating = (value) => `${toNumber(value).toFixed(1)}`;

const DetailCard = ({ icon: Icon, label, value, tone = "blue" }) => {
  const toneClassMap = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-500">
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${toneClassMap[tone] || toneClassMap.blue}`}>
          <Icon className="h-4 w-4" />
        </span>
        {label}
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-gray-100 px-3 py-2.5">
    <div className="mb-1 flex items-center gap-2 text-xs font-medium text-gray-500">
      <Icon className="h-4 w-4" />
      {label}
    </div>
    <div className="text-sm font-semibold text-gray-800">{value || "-"}</div>
  </div>
);

const ModalViewTeacherSurvey = ({ isOpen, onClose, surveyData }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !surveyData) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Chi tiết khảo sát</p>
            
            <h3 className="mt-1 text-xl font-bold text-gray-900">{surveyData.course_section_name || "Khảo sát học phần"}</h3>
            
            <p className="mt-1 text-sm text-gray-600">Mã học phần: {surveyData.course_section_code || "-"}</p>
          </div>
          
          <button
            className="rounded-full p-2 text-gray-500 transition hover:bg-white hover:text-gray-800"
            aria-label="Đóng"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[78vh] overflow-y-auto px-6 py-5">
          <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
            <DetailCard
              icon={Users}
              label="Sinh viên tham gia"
              value={`${surveyData.students_participated || 0}/${surveyData.students_enrolled || 0}`}
              tone="blue"
            />

            <DetailCard
              icon={Percent}
              label="Tỷ lệ tham gia"
              value={formatPercent(surveyData.participation_rate_percent)}
              tone="emerald"
            />

            <DetailCard
              icon={Star}
              label="Điểm đánh giá"
              value={surveyData.average_rating !== undefined ? formatRating(surveyData.average_rating) : "Chưa có"}
              tone="amber"
            />

            <DetailCard
              icon={BarChart3}
              label="Mức độ hoàn thành"
              value={surveyData.students_enrolled > 0 && surveyData.students_participated === surveyData.students_enrolled ? "Đủ mẫu" : "Đang thu thập"}
              tone="purple"
            />
          </div>

          <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
              <span>Tiến độ tham gia khảo sát</span>
              <span>{formatPercent(surveyData.participation_rate_percent)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                style={{ width: `${Math.min(Math.max(surveyData.participation_rate_percent, 0), 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <InfoItem
              icon={CalendarRange}
              label="Học kỳ"
              value={surveyData.semester}
            />
            <InfoItem
              icon={BookOpen}
              label="Hình thức học"
              value={surveyData.class_type}
            />
            <InfoItem
              icon={Layers}
              label="Nhóm thực hành"
              value={surveyData.practice_group_number != null ? String(surveyData.practice_group_number) : "Lý thuyết"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewTeacherSurvey;
